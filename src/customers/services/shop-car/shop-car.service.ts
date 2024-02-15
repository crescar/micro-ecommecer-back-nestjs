import { HttpException, HttpStatus, Injectable, Session } from '@nestjs/common';
import { InjectModel,  } from '@nestjs/mongoose';
import { Model, startSession, SessionStarter} from 'mongoose';
import { ShopCar } from 'src/Schemas/shop-car.schema';
import { Order } from 'src/Schemas/orders.schema';
import { Product } from 'src/Schemas/products.schema';
import { ShopCarDto, StripeIntent} from 'src/customers/Dtos/shop-car.dto';
import Response from 'src/responses/response';
import { createPaymentIntent, updatePaymentIntent, cancelPaymentIntent, 
    checkPaymentIntentStripe, refundsPayment } from 'src/utils/stripe.utils';

@Injectable()
export class ShopCarService {
    
    constructor(
        @InjectModel(ShopCar.name) private readonly shopCarModel: Model<ShopCar>,
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ){}

    async createCheckout(shopcar:ShopCarDto, userId: string): Promise<Response<StripeIntent>>{
        try {
            if(!shopcar.striperIntendId){
                
                const totalAmount = await this.calculeAmounToPayment(shopcar)

                const paymentIntent = await createPaymentIntent(totalAmount,userId)

                return  new Response(true, paymentIntent,'Checkout process')    
                
            }

            throw new HttpException(new Response(false,null,'Error already exist payment process on striper'), HttpStatus.BAD_REQUEST);

        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async updateCheckout(shopcar:ShopCarDto): Promise<Response<StripeIntent>>{
        try {
            if(shopcar.striperIntendId){

                const totalAmount = await this.calculeAmounToPayment(shopcar)

                const paymentIntent = await updatePaymentIntent(shopcar.striperIntendId, totalAmount)

                return  new Response(true, paymentIntent,'Checkout process update')    
                
            }

            throw new HttpException(new Response(false,null,'Error not exist payment process on striper'), HttpStatus.BAD_REQUEST);

        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async cancelCheckout(striperIntendId:string): Promise<Response<StripeIntent>>{
        try {
            if(striperIntendId){
                const paymentIntent = await cancelPaymentIntent(striperIntendId)
                return  new Response(true, paymentIntent,'Checkout process cancel')    
            }

            throw new HttpException(new Response(false,null,'Error not exist payment process on striper'), HttpStatus.BAD_REQUEST);

        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }
 
    async renderCar(shopcar:ShopCarDto, userId: string): Promise<Response<null>>{
        try {
            if(shopcar.striperIntendId){
                const checkPayment = await checkPaymentIntentStripe(shopcar.striperIntendId)
                const notExistOder = await this.orderModel.findOne({
                    striperIntendId: shopcar.striperIntendId
                })
                if(notExistOder){
                    throw new HttpException(new Response(false,null,'Error  payment already register'), HttpStatus.BAD_REQUEST);
                }
                if(checkPayment){
                    const productsId = shopcar.items.map((item)=>{return item.productId})
                    const products = await this.productModel.find({_id:productsId})
                    if(!products.length){
                        throw new HttpException(new Response(false,null,'Error to find products'), HttpStatus.BAD_REQUEST);
                    }
                    let totalAmount = 0
                    const stockUpdates = []
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        let errorMessage = ''
                        if(!productsId.includes(product.id)){
                            const refunds = await refundsPayment(shopcar.striperIntendId, 'product do not exists')
                            refunds ? errorMessage = 'Error products do not exits, payment refunds' :
                                errorMessage = 'Error products do not exits, payment do not refunds, please contact support'
                            throw new HttpException(new Response(false,null,errorMessage), HttpStatus.BAD_REQUEST);
                        }
                        const getCardItem = shopcar.items.find((item)=> item.productId === product.id);
                        if(product.stock < getCardItem.quantityItems){
                            const refunds = await refundsPayment(shopcar.striperIntendId, `insufficient stock for product: ${product.name}`)
                            refunds ? errorMessage = `insufficient stock for product: ${product.name}, payment refunds` :
                                errorMessage = `insufficient stock for product: ${product.name}, payment do not refunds, please contact support`
                            throw new HttpException(new Response(false,null,errorMessage), HttpStatus.BAD_REQUEST);
                        }
                        stockUpdates.push(this.productModel.findByIdAndUpdate(product.id,{
                            stock: product.stock - getCardItem.quantityItems
                        }))
                        totalAmount+= product.price*getCardItem.quantityItems
                    }
                    Promise.all(stockUpdates)
                    const dataOrder: Order = {
                        userId: userId,
                        directionDelivery: shopcar.direction,
                        striperIntendId: shopcar.striperIntendId
                    }
                    const createOrder = await this.orderModel.create(dataOrder)
                    const dataShopCar: ShopCar = {
                        items: shopcar.items,
                        userId: userId,
                        totalAmount: totalAmount,
                        orderId: createOrder.id
                    }
                    await this.shopCarModel.create(dataShopCar)
                    return  new Response(true, null,'Finished payment')
                }
                throw new HttpException(new Response(false,null,'Error  payment confirm'), HttpStatus.BAD_REQUEST);
            }
            throw new HttpException(new Response(false,null,'Error not exist payment process on striper'), HttpStatus.BAD_REQUEST);
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        } 
    }

    private async calculeAmounToPayment(shopcar:ShopCarDto):Promise<number>{

        const productsId = shopcar.items.map((item)=>{
            return item.productId
        })

        const products = await this.productModel.find(
            {
                _id:productsId
            }
        )

        if(!products.length){
            throw new HttpException(new Response(false,null,'Error to find products'), HttpStatus.BAD_REQUEST);
        }

        let totalAmount = 0

        products.map((product)=>{
            if(productsId.includes(product.id)){
                const getCardItem = shopcar.items.find((item)=> item.productId === product.id);
                if(product.stock < getCardItem.quantityItems){
                    throw new HttpException(new Response(false,null,`insufficient stock for product: ${product.name}`), HttpStatus.BAD_REQUEST);
                }
                totalAmount += getCardItem.quantityItems * product.price
                return
            }
            throw new HttpException(new Response(false,null,'Error products do not exits'), HttpStatus.BAD_REQUEST);
        })

        return totalAmount
    }

}
