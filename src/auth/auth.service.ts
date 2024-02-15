import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../Schemas/user.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import Response from '../responses/response';
import { SingInDto } from './Dtos/SingIn.dto';
import { comparePass,hashingPassword } from 'src/utils/hashPassword.utils';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService
  ){}

  async SingUp(user:User, userType?:number): Promise<Response<User | null>>{
    try {
      userType ? user.userType = userType : undefined;
      user.password = await hashingPassword(user.password)
      const createUser: User = await this.userModel.create(user);
      createUser.password = undefined;
      return new Response(true, createUser,"User created")
    } catch (error) {
      throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
  }

  async SingIn(credentiales: SingInDto): Promise<Response<any | null>>{
    try {
      const user: any = await this.userModel.findOne({
        $or:[
          {
            userName: credentiales.userNameEmail
          },
          {
            email: credentiales.userNameEmail
          }
        ]
      })
      if(!user){
        throw new HttpException(new Response(false,null,'User not found'), HttpStatus.NOT_FOUND);
      }
      if(!await comparePass(credentiales.password, user.password)){
        throw new HttpException(new Response(false,null,'Password worng'), HttpStatus.BAD_REQUEST);
      }
      user.password = undefined
      user.updatedAt = undefined
      user.createdAt = undefined
      
      const data = {
        token: await this.jwtService.signAsync({
          id: user.id,
          userType: user.userType
        }),
        userData: user
      }
      return new Response(true, data,'Login success');
    } catch (error) {
      throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }

  }
  
}
