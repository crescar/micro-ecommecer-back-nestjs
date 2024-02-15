import { ApiProperty } from "@nestjs/swagger";
export default class Response<T> {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    data: T ;
    @ApiProperty()
    message: string

    constructor(success: boolean, data: T, message: string){
        this.success = success;
        this.data = data;
        this.message = message
    }

}
