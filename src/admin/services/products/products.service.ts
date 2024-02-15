import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/Schemas/products.schema';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';
import { moneyToFront, moneyToStripe } from 'src/utils/converts.utils';


@Injectable()
export class ProductsService {

    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<Product>
    ){}

    async create(product: Product): Promise<Response<Product>>{
        try { 
            product.price = moneyToStripe(product.price);
            const create = await this.productModel.create(product);
            return new Response(true,create,'Order created')   
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async findAll(page: number = 1, limit: number = 3): Promise<Response<PaginationResponse<Product[]>>>{
        try {
            const count = await this.productModel.countDocuments()
            const pages = Math.ceil(count/limit)
            const skip = (page-1)*limit
            const products = await this.productModel.find().skip(skip).limit(limit).exec();
            products.map((product)=> product.price = moneyToFront(product.price))
            const data: PaginationResponse<Product[]> = {
                pages,
                page,
                limit,
                items:products,
                fromXToY: `From ${skip + 1} to ${products.length + skip}`,
                totalItems: count
            }
            return new Response(true, data,'return categories')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }

    }

    async findById(id:string):Promise<Response<Product>>{

        try {
            const product = await this.productModel.findById(id).exec();
            product.price = moneyToFront(product.price)
            if(!product){
                throw new HttpException(new Response(false,null,'product not found'), HttpStatus.BAD_REQUEST);
            }
            return new Response(true,product,'product found')  
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }

    }

    async deleted(id:string):Promise<Response<Product>>{
        try {
            const deleted = await this.productModel.findByIdAndDelete(id);
            const resp = new Response(true, deleted,'Category delete')
            if(!deleted){
                resp.message = 'Product not Exist'
                resp.success = false
                return resp
            }  
            return resp
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }

    }

    async update(id:string,product: Product):Promise<Response<Product>>{

        try {
            product.price = moneyToStripe(product.price)
            const update = await this.productModel.findByIdAndUpdate(id,product)
            if(!update){
                throw new HttpException(new Response(false,null,'Product not found'), HttpStatus.BAD_REQUEST);
            }
            update.price = moneyToFront(update.price)
            return new Response(true,update,'Order update')  
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }

    }

}
