import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopCarController } from './controllers/shop-car/shop-car.controller';
import { ProductsController } from './controllers/products/products.controller';
import { CategoriesController } from './controllers/categories/categories.controller';
import { CategoriesService } from './services/categories/categories.service';
import { ProductsService } from './services/products/products.service';
import { ShopCarService } from './services/shop-car/shop-car.service';
import { Category, CategorySchema } from 'src/Schemas/categories.schema';
import { Product, ProductSchema } from 'src/Schemas/products.schema';
import { ShopCar, ShopCarchema } from 'src/Schemas/shop-car.schema';
import { Order, OrderSchema } from 'src/Schemas/orders.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema
      },
      {
        name: Product.name,
        schema: ProductSchema
      },
      {
        name: ShopCar.name,
        schema: ShopCarchema
      },
      {
        name: Order.name,
        schema: OrderSchema
      }
    ])
  ],
  controllers: [ShopCarController, ProductsController, CategoriesController],
  providers: [CategoriesService, ProductsService, ShopCarService]
})
export class CustomersModule {}
