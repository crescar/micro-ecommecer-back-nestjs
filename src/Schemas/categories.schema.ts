import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export type CategoryDocument = HydratedDocument<Category>

@Schema({timestamps:true})
export class Category {

    @IsNotEmpty({message:'category name is require'})
    @ApiProperty({
        required:true,
        example: 'Game',
        description: 'Catergory name'
    })
    @Prop({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        uppercase:true,
        unique: true
    })
    name: string;

    @ApiProperty({
        required:false,
        example: '1',
        description: 'SubCategory Linkend',
    })
    @Prop({
        required: false,
        default: null
    })
    LinkendCategoryId: string | null

}

export const CategorySchema = SchemaFactory.createForClass(Category)