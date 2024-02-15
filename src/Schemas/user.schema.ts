import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, IsDateString, IsNumber, MaxLength,MinLength, IsInt} from 'class-validator';


export type UserDocument = HydratedDocument<User>


@Schema({
    timestamps:true
})
export class User {

    @IsNotEmpty({message:"The userName is required"})
    @MinLength(2, {message:"Min length 2"})
    @MaxLength(50, {message: "Max length 50"})
    @ApiProperty({
        required: true,
        example: 'crescar',
        description: 'user name of user'
    })
    @Prop({
        required:[true, 'UserName required'],
        minlength: 3,
        maxlength: 50,
        trim:true,
        unique:true 
    })
    userName: string
    @IsNotEmpty({message:"The firstName is required"})
    @MinLength(2, {message:"Min length 2"})
    @MaxLength(50, {message: "Max length 50"})
    @ApiProperty({
        required: true,
        example: 'Luis',
        description: 'firstname of user'
    })
    @Prop({
        required:true,
        minlength: 3,
        maxlength: 50,
    })
    firstName: string
    @IsNotEmpty({message:"The lastName is required"})
    @MinLength(2, {message:"Min length 2"})
    @MaxLength(50, {message: "Max length 50"})
    @ApiProperty({
        required: true,
        example: 'crespo',
        description: 'lastname of user'
    })
    @Prop({
        required:true,
        minlength: 3,
        maxlength: 50,
        trim:true,
    })
    lastName: string
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9\W]{8,16}$/)
    @ApiProperty({
        required: true,
        example: '1234567*Ps',
        description: 'pass of account'
    })
    @Prop({
        required:true,
    })
    password: string
    @IsEmail({},{message:"Required Valied Email"})
    @ApiProperty({
        required: true,
        example: 'example@example.com',
        description: 'email of account'
    })
    @Prop({
        required:true,
        minlength: 3,
        maxlength: 50,
        trim:true,
        unique:true
    })
    email: string
    @IsDateString({},{message:"Add a validate Date"})
    @ApiProperty({
        required: true,
        example: '1997-06-21',
        description: 'born Dateof user',
    })
    @Prop({
        required:true,
    })
    bornDate: Date
    @Prop({
        required:true,
        default: 2,
        enum:{
            message:'Invalid Type',
            values:[1,2]
        }
    })
    userType: number
    @IsNumber()
    @IsInt()
    @ApiProperty({
        required: true,
        example: '55555555',
        description: 'Phone of user'
    })
    @Prop({
        required:true,
        minlength: 8,
        maxlength: 16,
        trim:true,
    })
    phone: number
    @IsNumber()
    @IsInt()
    @ApiProperty({
        required: true,
        example: '1',
        description: 'Country code of user'
    })
    @Prop({
        required:true,
        minlength: 1,
        maxlength: 3,
    })
    CodeCountry: number
    @Prop({
        default: 0,
        required: true
    })
    verificated: boolean;

}

export const userSchema = SchemaFactory.createForClass(User)