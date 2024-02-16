import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/Schemas/orders.schema';
import { Delivery, DeliveryRequestDTO } from 'src/Schemas/deliveries.schema';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';

@Injectable()
export class OrdersService {
    
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        @InjectModel(Delivery.name) private readonly deliveryModel: Model<Delivery>
    ){}


    async findAll(page: number = 1, limit: number = 3): Promise<Response<PaginationResponse<Order[]>>>{

        try {
            const count = await this.orderModel.countDocuments()
            const pages = Math.ceil(count/limit)
            const skip = (page-1)*limit
            const orders = await this.orderModel.find().skip(skip).limit(limit).exec();
            const data: PaginationResponse<Order[]> = {
                pages,
                page,
                limit,
                items:orders,
                fromXToY: `From ${skip + 1} to ${orders.length + skip}`,
                totalItems: count
            }
            return new Response(true, data,'return orders')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }

    }

    async findById(id: string): Promise<Response<Order>>{
        try {
            const order = await this.orderModel.findById(id).exec();
            if(!order){
                throw new HttpException(new Response(false,null,'Order not found'), HttpStatus.BAD_REQUEST);
            }
            return new Response(true,order,'Order found')  
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async updateDelivery(id: string, data: DeliveryRequestDTO): Promise<Response<null>>{
        try {
            const order = await this.orderModel.findByIdAndUpdate(id,{
                delivery: data.delivery
            }).exec()
            const getDelivery = await this.deliveryModel.findOne({
                orderId: id
            }).exec()
            if(data.delivery){
                const delivery = {
                    orderId:id,
                    direction: order.directionDelivery,
                    deliveryDate: data.deliveryDate,
                    arriveDate: data.arriveDate
                }
                if(getDelivery){
                    await this.deliveryModel.findByIdAndUpdate(getDelivery.id,delivery).exec()
                }else{
                    await this.deliveryModel.create(delivery)
                }
            }
            if(!data.delivery){
                if(getDelivery){
                    await this.deliveryModel.findByIdAndDelete(getDelivery.id)
                }
            }
            return new Response(true, null,'status order update')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

}
