import { ApiProperty } from "@nestjs/swagger";
export class PaginationResponse<T>{

    @ApiProperty()
    pages: number;
    @ApiProperty()
    page: number;
    @ApiProperty()
    limit: number;
    @ApiProperty()
    items: T;
    @ApiProperty()
    totalItems: number;
    @ApiProperty()
    fromXToY: string;

    constructor(pages: number, page: number, items: T, totalItems: number, fromXToY: string){
        this.pages = pages
        this.page = page
        this.items = items
        this.totalItems = totalItems
        this.fromXToY = fromXToY
    }

}