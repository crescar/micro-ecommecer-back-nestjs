import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryRequestDTO } from 'src/Schemas/deliveries.schema';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';

@Injectable()
export class DeliveriesService {
    constructor(
        @InjectModel(Delivery.name) private readonly deliveryModel: Model<Delivery>
    ){}

    async findAll(page: number = 1, limit: number = 3): Promise<Response<PaginationResponse<Delivery[]>>>{
        try {
            const count = await this.deliveryModel.countDocuments()
            const pages = Math.ceil(count/limit)
            const skip = (page-1)*limit
            const orders = await this.deliveryModel.find().skip(skip).limit(limit).exec();
            const data: PaginationResponse<Delivery[]> = {
                pages,
                page,
                limit,
                items:orders,
                fromXToY: `From ${skip + 1} to ${orders.length + skip}`,
                totalItems: count
            }
            return new Response(true, data,'return deliveries')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async findById(id: string): Promise<Response<Delivery>>{
        try {
            const delivery = await this.deliveryModel.findById(id).exec();
            if(!delivery){
                throw new HttpException(new Response(false,null,'delivery not found'), HttpStatus.BAD_REQUEST);
            }
            return new Response(true,delivery,'Order found')  
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }
}
