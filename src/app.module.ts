import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from './email/email.service';
import { AdminModule } from './admin/admin.module';
import { CustomersModule } from './customers/customers.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn: '6h'
      }
    }),
    AuthModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    AdminModule,
    CustomersModule
  ],
  providers: [EmailService],

})
export class AppModule {}
