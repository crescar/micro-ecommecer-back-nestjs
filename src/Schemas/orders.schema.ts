import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export type OrderDocument = HydratedDocument<Order>

export enum StatusOrderEnum  {

}

@Schema({timestamps:true})
export class Order {

    @IsNotEmpty({message:'User Id is require'})
    @ApiProperty({
        required:true,
        example: 'asd2852asd-asdas21das',
        description: 'User id'
    })
    @Prop({
        required: true
    })
    userId: string

    @IsNotEmpty({message:'Striper Intend Id is require'})
    @ApiProperty({
        required:true,
        example: 'asd2852asd-asdas21das',
        description: 'Striper intent Id'
    })
    @Prop({
        required: true,
        unique: true
    })
    striperIntendId: string
    
    @Prop({
        required: true,
        default: false,
    })
    delivey?: boolean

    @Prop({
        required: true,
    })
    directionDelivery: string

}
export const OrderSchema = SchemaFactory.createForClass(Order)