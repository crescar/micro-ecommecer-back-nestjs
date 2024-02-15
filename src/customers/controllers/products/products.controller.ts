import { Controller, Get, Param, Query, Search } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from 'src/Schemas/products.schema';
import { ProductsService } from 'src/customers/services/products/products.service';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';

@Controller('customers/products')
@ApiTags('Customers/Products')
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
    @ApiQuery({
        required: false,
        name:'search',
        type: String
    })
    @ApiQuery({
        required: false,
        name:'categories',
        type: Array
    })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('search') search: string,
        @Query('categories') categories: string[] 
    ): Promise<Response<PaginationResponse<Product[]>>>{

        return await this.productsService.findAll(page, limit, search, categories)

    }

    @Get(':id')
    @ApiResponse({
        type: Response<Product>
    })
    async findById(@Param('id') id:string): Promise<Response<Product>>{

        return await this.productsService.findById(id)

    }
}
