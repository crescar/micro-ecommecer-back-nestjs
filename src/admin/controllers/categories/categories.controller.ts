import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags,ApiQuery } from '@nestjs/swagger';
import { SecurityGuardAdmin } from 'src/security/securityAdmin.guard'; 
import { Category } from 'src/Schemas/categories.schema';
import Response from 'src/responses/response';
import { CategoriesService } from 'src/admin/services/categories/categories.service';
import { PaginationResponse } from 'src/responses/pagination';

@Controller('admin/categories')
@UseGuards(SecurityGuardAdmin)
@ApiTags('Admin/Categories')
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

    @Get(':id')
    @ApiResponse({
        type: Response<Category>
    })
    async findById(@Param('id') id:string):Promise<Response<Category>>{
        return await this.categoriesService.findById(id)
    }

    @Post()
    @ApiBody({
        type: Category
    })
    @ApiResponse({
        type: Response<Category>
    })
    async create(@Body() category: Category): Promise<Response<Category>> {
        return await this.categoriesService.create(category)
    }

    @Put(':id')
    @ApiBody({
        type: Category
    })
    @ApiResponse({
        type: Response<Category>
    })
    async update(@Param('id') id:string,@Body() category: Category):Promise<Response<Category>>{
        return await this.categoriesService.update(id,category)
    }

    @Delete(':id')
    @ApiResponse({
        type: Response<Category>
    })
    async delete(@Param('id') id:string):Promise<Response<Category>>{
        return await this.categoriesService.delete(id)
    }

}
