import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ShopCarStatusEnum {
    RENDER = 'RENDER',
    PENDING = 'PENDING',
}

export class ItemsShopCar {
    @ApiProperty(
        {
            required:true
        }
    )
    @IsNotEmpty()
    productId: string
    @ApiProperty(
        {
            required:true
        }
    )
    @IsNotEmpty()
    @IsNumber()
    quantityItems: number
} 

export class ShopCarDto {
    @ApiProperty(
        {
            required:true,
            example: [
                {
                    productId: "65ca8c03dbfe622861bef375",
                    quantityItems: 3
                },
                {
                    productId: "65ca902d0b207769cd5cee09",
                    quantityItems: 3
                }
            ],
            type: ItemsShopCar,
            isArray: true
            
        }
    )
    @IsNotEmpty()
    items:ItemsShopCar[]
    @ApiProperty({
        required:true,
        example:"Street 5 chicago"
    })
    @IsNotEmpty()
    direction: string
    @ApiProperty({
        required:false,
        example: "pi_6562asd"
    })
    striperIntendId?: string
    
}

export class StripeIntent {
    clientSecret: string
    stripeIntentId: string
}