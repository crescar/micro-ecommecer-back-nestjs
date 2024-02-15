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

    async create(category: Category): Promise<Response<Category>> {
        try {
            const createCategory = await this.categoryModel.create(category)
            return new Response(true, createCategory,'Category Create')
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

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

    async findById(id:string): Promise<Response<Category>> {
        try {
            const category = await this.categoryModel.findById(id).exec()
            const resp = new Response(true, category,'')
            !category ? resp.message = "Category not found" : resp.message = 'Category found'
            return resp;
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async update(id:string, category: Category):Promise<Response<Category>>{
        try {
            const updateCategory = await this.categoryModel.findByIdAndUpdate(id,category);
            const resp = new Response(true, updateCategory,'Category Updated')
            if(!updateCategory){
                resp.message = 'Category not Exist'
                resp.success = false
            }      
            return resp
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

    async delete(id:string):Promise<Response<Category>>{
        try {
            const deleteCategory = await this.categoryModel.findByIdAndDelete(id);
            const resp = new Response(true, deleteCategory,'Category delete')
            if(!deleteCategory){
                resp.message = 'Category not Exist'
                resp.success = false
                return resp
            }
            if(!deleteCategory.LinkendCategoryId){
                const subCategories = await this.categoryModel.deleteMany({
                    LinkendCategoryId: id
                })
                subCategories.deletedCount ? resp.message = 'Deleted Category and SubCategories' : undefined
            }      
            return resp
        } catch (error) {
            throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
        }
    }

}
