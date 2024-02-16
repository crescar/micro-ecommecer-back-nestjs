import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';

export class DeliveryRequestDTO {

    @ApiProperty({
        required:true,
        example: true,
        type: Boolean
    })
    @IsBoolean()
    delivery:boolean

    @ApiProperty({
        required:true,
        example: new Date()
    })
    @IsNotEmpty()
    @IsDateString()
    deliveryDate: Date

    @ApiProperty({
        required:true,
        example: new Date()
    })
    @IsNotEmpty()
    @IsDateString()
    arriveDate: Date
    
}

export type DeliveryDocument = HydratedDocument<Delivery>

@Schema({
    timestamps: true
})
export class Delivery {
    
    @Prop({
        required:true,
        unique: true
    })
    orderId: string
   
    @Prop({
        required: true
    })
    direction: string
    
    @Prop({
        required:true,
    })
    deliveryDate: Date
    
    @Prop({
        required:true,
    })
    arriveDate: Date
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery)