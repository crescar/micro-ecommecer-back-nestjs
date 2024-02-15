import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/Schemas/categories.schema';
import { PaginationResponse } from 'src/responses/pagination';
import Response from 'src/responses/response';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectModel(Category.name) private readonly categoryModel: Model<Category>
    ){}

    async findAll(page: number = 1, limit: number = 3, subCategories: string ):Promise<Response<PaginationResponse<Category[]>>>{
        try {
            const query = {
                LinkendCategoryId: subCategories ?? null
            }
            const count = await this.categoryModel.countDocuments({...query})
            const pages = Math.ceil(count/limit)
            const skip = (page-1)*limit
            const categories = await this.categoryModel.find({...query}).skip(skip).limit(limit).exec();

            const data: PaginationResponse<Category[]> = {
                pages,
                page,
                limit,
                items:categories,
                fromXToY: `From ${skip + 1} to ${categories.length + skip}`,
                totalItems: count
            }
            return new Response(true, data,'return categories')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }
}
