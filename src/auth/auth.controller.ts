import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { SingInDto } from './Dtos/SingIn.dto';
import { User } from '../Schemas/user.schema';
import Response from '../responses/response';
import { UsersTypeEnum } from 'src/enums/userTipes.enum';
import { SecurityGuardAdmin } from 'src/security/securityAdmin.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singin')
  @ApiBody({
    type: SingInDto,
    required:true
  })
  @ApiResponse({
    type: Response<User>,
  })
  async SingIn(@Body() credentiales: SingInDto): Promise<Response<User>>{
    return await this.authService.SingIn(credentiales)
  }

  @Post('singup')
  @ApiBody({
    type: User,
    required:true
  })
  @ApiResponse({
    type: Response<User>
  })
  async SingUp(@Body() user: User): Promise<Response<User>>{
    return await this.authService.SingUp(user)
  }

  @Post('singup/admin')
  @UseGuards(SecurityGuardAdmin)
  @ApiBody({
    type: User,
    required:true
  })
  @ApiResponse({
    type: Response<User>
  })
  async SingUpAdmin(@Body() user: User): Promise<Response<User>>{
    return await this.authService.SingUp(user,UsersTypeEnum.ADMIN)
  }

}
