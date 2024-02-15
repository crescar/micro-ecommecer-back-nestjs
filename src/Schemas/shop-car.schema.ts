import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ItemsShopCar } from 'src/customers/Dtos/shop-car.dto';

export type ShopCarDocument = HydratedDocument<ShopCar>

@Schema({timestamps:true})
export class ShopCar {

    @IsNotEmpty({message:'the value was not empety'})
    @ApiProperty({
        required:true,
        example:[
            {
            productId: 'as87asd-asdsdsa7a-asdasd',
            quantityItems: 5,
            onlyPrice: 100,
            totalPrice: 500,
            }
        ],
        isArray:true,
        type: ItemsShopCar,
        description:'Items of shopcar'
    })
    @Prop({
        required: true,
    })
    items: ItemsShopCar[]

    @IsNotEmpty({message:'the value was not empety'})
    @ApiProperty({
        required: true,
        example: 'as87asd-asdsdsa7a-asdasd',
        description: 'user Id'
    })
    @Prop({
        required: true,
        type: String
    })
    userId: string

    @IsNotEmpty({message:'the value was not empety'})
    @IsNumber()
    @ApiProperty({
        required:true,
        example: 1000,
        description:"total to pay"
    })
    @Prop({
        required: true,
        type: Number
    })
    totalAmount: number

    @IsNotEmpty({message:'the value was not empety'})
    @ApiProperty({
        required:false,
        example: 'asdas8e7q-asddr855as8-asda7qw5',
        description:"Order id linked with card",
    })
    @Prop({
        required: false,
        default: null
    })
    orderId?: string | null

}

export const ShopCarchema = SchemaFactory.createForClass(ShopCar)