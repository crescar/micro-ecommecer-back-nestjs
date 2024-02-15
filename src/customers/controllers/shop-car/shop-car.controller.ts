import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { SecurityGuard } from 'src/security/security.guard';
import { ShopCarDto, StripeIntent } from 'src/customers/Dtos/shop-car.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShopCarService } from 'src/customers/services/shop-car/shop-car.service';
import Response from 'src/responses/response';



@Controller('customers/shop-car')
@UseGuards(SecurityGuard)
@ApiTags('Customers/Shop-car')
export class ShopCarController {

    constructor(private readonly shopCarService: ShopCarService){}

    
    @ApiBody({
        type: ShopCarDto
    })
    @ApiResponse({
        type: Response<StripeIntent>
    })
    @Post('checkout')
    async createPaymentIntent(@Body() shopCard: ShopCarDto, @Request() req):Promise<Response<StripeIntent>>{
        return await this.shopCarService.createCheckout(shopCard,req.user.id)
    }
    
    @ApiBody({
        type: ShopCarDto
    })
    @ApiResponse({
        type: Response<StripeIntent>
    })
    @Put('checkout')
    async updatePaymentIntent(@Body() shopCard: ShopCarDto):Promise<Response<StripeIntent>>{
        return await this.shopCarService.updateCheckout(shopCard)
    }

    @ApiBody({
        schema:{
            type:'object',
            example:{
                striperIntendId: "pi_3Oj9sXG5nAyAxxUh1TPNF23s"
            },
            properties:{
                striperIntendId:{
                    type: 'string',
                    description: 'striperIntendId'
                }
            }
        }
    })
    @ApiResponse({
        type: Response<StripeIntent>
    })
    @Delete('checkout')
    async cancelPaymentIntent(@Body() body:{striperIntendId:string}):Promise<Response<StripeIntent>>{
        return await this.shopCarService.cancelCheckout(body.striperIntendId)
    }

    @Post()
    async renderShopCar(@Body() shopCard: ShopCarDto, @Request() req){
        return await this.shopCarService.renderCar(shopCard,req.user.id);
    }
}
