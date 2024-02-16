import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SecurityGuardAdmin } from 'src/security/securityAdmin.guard';
import { DeliveriesService } from 'src/admin/services/deliveries/deliveries.service';
import { Delivery } from 'src/Schemas/deliveries.schema';
import Response from 'src/responses/response';
import { PaginationResponse } from 'src/responses/pagination';

@Controller('admin/deliveries')
@UseGuards(SecurityGuardAdmin)
@ApiTags('Admin/Deliveries')
export class DeliveriesController {
    
    constructor(
        private readonly deliveriesServices: DeliveriesService
    ){}

    @Get()
    @ApiResponse({
        type: Response<PaginationResponse<Delivery[]>>
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
    ): Promise<Response<PaginationResponse<Delivery[]>>>{
        return await this.deliveriesServices.findAll(page, limit)
    }

    @Get(':id')
    @ApiResponse({
        type: Response<Delivery>
    })
    async findById(@Param('id') id:string): Promise<Response<Delivery>>{
        return await this.deliveriesServices.findById(id)
    }
}
