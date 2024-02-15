import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/Schemas/products.schema';
import { ProductsService } from 'src/admin/services/products/products.service';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';
import { SecurityGuardAdmin } from 'src/security/securityAdmin.guard';

@Controller('admin/products')
@UseGuards(SecurityGuardAdmin)
@ApiTags('Admin/Products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService
    ){}

    @Get()
    @ApiResponse({
        type: Response<PaginationResponse<Product[]>>
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
    ): Promise<Response<PaginationResponse<Product[]>>>{

        return await this.productsService.findAll(page, limit)

    }

    @Get(':id')
    @ApiResponse({
        type: Response<Product>
    })
    async findById(@Param('id') id:string): Promise<Response<Product>>{

        return await this.productsService.findById(id)

    }

    @Post()
    @ApiBody({
        type: Product
    })
    @ApiResponse({
        type: Response<Product>
    })
    async create(@Body() product: Product): Promise<Response<Product>>{
        return await this.productsService.create(product);
    }

    @Put(':id')
    @ApiBody({
       type: Product
    })
    @ApiResponse({
        type: Response<Product>
    })
    async updateStatus(@Param('id') id:string, @Body() body: Product): Promise<Response<Product>>{
        return await this.productsService.update(id, body)
    }

    @Delete(':id')
    async deleted(@Param('id') id:string):Promise<Response<Product>>{

        return await this.productsService.deleted(id);

    }

}
