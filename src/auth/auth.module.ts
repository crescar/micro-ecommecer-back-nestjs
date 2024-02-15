import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from '../Schemas/user.schema';
import { EmailService } from 'src/email/email.service';
@Module({
  imports:[
    MongooseModule.forFeature([
      {
        schema: userSchema,
        name: User.name
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
