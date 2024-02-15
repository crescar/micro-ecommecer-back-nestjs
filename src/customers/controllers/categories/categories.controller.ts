import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from 'src/Schemas/categories.schema';
import { CategoriesService } from 'src/customers/services/categories/categories.service';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';

@Controller('customers/categories')
@ApiTags('Customers/Categories')
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Get()
    @ApiResponse({
        type: Response<PaginationResponse<Category[]>>
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
        name:'subCategories',
        type: String
    })
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 3,
        @Query('subCategories') subCategories: string 
    ):Promise<Response<PaginationResponse<Category[]>>>{
        return await this.categoriesService.findAll(Number(page), Number(limit), subCategories)
    }
}
