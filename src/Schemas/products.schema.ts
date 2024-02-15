import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, IsInt } from 'class-validator';

export type ProductDocument = HydratedDocument<Product>

@Schema({timestamps:true})
export class Product {

    @IsNotEmpty({message:"Name's products can not empety"})
    @ApiProperty({
        required:true,
        example: 'puppys candle',
        description: 'Name of product'
    })
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 150
    })
    name: string;

    @ApiProperty({
        required:true,
        example: 'candle with puppys form',
        description: 'description of product'
    })
    @IsNotEmpty({message:"Description's product can not empety"})
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 500
    })
    description: string;

    @IsArray()
    @ApiProperty({
        required:true,
        example: ['65c43aa18fb889f319500ba6'],
        description: 'categories id of product'
    })
    @Prop({
        required: true,
        minlength: 3,
        maxlength: 150,
    })
    categoryId: string[];

    @IsInt()
    @ApiProperty({
        required:true,
        example: '10',
        description: 'stock of product'
    })
    @Prop({
        required: true
    })
    stock: number;

    @IsArray()
    @ApiProperty({
        required:true,
        example: ['/image1'],
        description: 'url images of product'
    })
    @Prop({
        required: true
    })
    mediaUrl: string[]

    @IsInt()
    @ApiProperty({
        required:true,
        example: '10',
        description: 'price of product'
    })
    @Prop({
        required: true
    })
    price: number

}

export const ProductSchema = SchemaFactory.createForClass(Product)