import { ApiProperty } from "@nestjs/swagger"

export class SingInDto {
    @ApiProperty({
        required:true,
        example:'crescar',
        description:'User Name or Email of account',
    })
    userNameEmail: string
    @ApiProperty({
        required:true,
        example:'12345',
        description:'Pass of account',
    })
    password: string
}