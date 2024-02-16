import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories/categories.controller';
import { ProductsController } from './controllers/products/products.controller';
import { DashboardController } from './controllers/dashboard/dashboard.controller';
import { OrdersController } from './controllers/orders/orders.controller';
import { DeliveriesController } from './controllers/deliveries/deliveries.controller';
import { DeliveriesService } from './services/deliveries/deliveries.service';
import { OrdersService } from './services/orders/orders.service';
import { ProductsService } from './services/products/products.service';
import { DashboardService } from './services/dashboard/dashboard.service';
import { CategoriesService } from './services/categories/categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema, Category } from '../Schemas/categories.schema';
import { OrderSchema, Order } from '../Schemas/orders.schema';
import { Product, ProductSchema } from '../Schemas/products.schema';
import { Delivery, DeliverySchema } from 'src/Schemas/deliveries.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        schema: CategorySchema,
        name: Category.name
      },
      {
        schema: OrderSchema,
        name: Order.name
      },
      {
        schema: ProductSchema,
        name: Product.name
      },
      {
        schema: DeliverySchema,
        name: Delivery.name
      }
    ])
  ],
  controllers: [CategoriesController, ProductsController, DashboardController, OrdersController, DeliveriesController],
  providers: [DeliveriesService, OrdersService, ProductsService, DashboardService, CategoriesService],
})
export class AdminModule {}
