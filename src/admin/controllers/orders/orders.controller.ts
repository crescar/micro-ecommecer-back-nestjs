import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { Order } from 'src/Schemas/orders.schema';
import { PaginationResponse } from 'src/responses/pagination';
import { SecurityGuardAdmin } from 'src/security/securityAdmin.guard';
import Response from 'src/responses/response';
import { OrdersService } from 'src/admin/services/orders/orders.service';

@Controller('admin/orders')
@UseGuards(SecurityGuardAdmin)
@ApiTags('Admin/Orders')
export class OrdersController {

    constructor(
        private readonly orderService: OrdersService
    ){}
    
    @Get()
    @ApiResponse({
        type: Response<PaginationResponse<Order[]>>
    })
    @ApiQuery({
        required: false,
        name:'page',
        type: Number
    })
    @ApiQuery({
        required: false,
        name:'limit',
        type: Number
    })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 3,
    ): Promise<Response<PaginationResponse<Order[]>>>{

        return await this.orderService.findAll(page, limit)

    }

    @Get(':id')
    @ApiResponse({
        type: Response<Order>
    })
    async findById(@Param('id') id:string): Promise<Response<Order>>{
        return await this.orderService.findById(id)
    }

    @Put(':id')
    @ApiBody({
        schema:{
            type:'object',
            example:{
                delivery: false
            },
            properties:{
                delivery: {
                    type:'boolean'
                }
            }
        }
    })
    @ApiResponse({
        type: Response<null>
    })
    async updateDelivery(@Param('id') id: string, @Body() data: {delivery:boolean}): Promise<Response<null>>{
        return await this.orderService.updateDelivery(id, data.delivery);
    }


}
