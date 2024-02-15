import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
@Injectable()
export class EmailService {

    private resend = new Resend(process.env.RESEND_API_KEY)

    async sendEmail(to: string[], subject: string, body:string){
        const {data,error} = await this.resend.emails.send({
            from: 'Crescar <ing.luiscrespo1997@gmail.com>',
            to:to,
            subject: subject,
            html: body
        })
        if(error){
            console.log(error.message)
        }
        console.log(data)
    }

}
