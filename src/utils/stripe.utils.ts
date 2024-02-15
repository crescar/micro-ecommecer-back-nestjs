import { HttpException, HttpStatus } from "@nestjs/common";
import Response from "src/responses/response";
import Stripe from "stripe";


export async function createPaymentIntent(amount:number, userId: string) {
    
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const create = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'usd',
            automatic_payment_methods:{
                enabled: true
            },
            metadata:{
                userId
            },
            description: `purchased by user: ${userId}`
        })
        return {
            clientSecret: create.client_secret,
            stripeIntentId: create.id
        }
    } catch (error) {
        throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
}

export async function updatePaymentIntent(id: string, amount:number) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const update = await stripe.paymentIntents.update(id,{
            amount: amount
        })
        return {
            clientSecret: update.client_secret,
            stripeIntentId: update.id
        }
    } catch (error) {
        throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
}

export async function cancelPaymentIntent(id: string) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const update = await stripe.paymentIntents.cancel(id)
        return {
            clientSecret: update.client_secret,
            stripeIntentId: update.id
        }
    } catch (error) {
        throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
}

export async function checkPaymentIntentStripe(id: string) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const payment = await stripe.paymentIntents.retrieve(id)
        return payment.status === 'succeeded'
    } catch (error) {
        throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
}

export async function refundsPayment(id: string, reason: string) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const payment = await stripe.refunds.create({
            payment_intent: id,
            metadata: {
                reason
            }
        })
        return payment.status === 'succeeded'
    } catch (error) {
        throw new HttpException(new Response(false,null,error.message), HttpStatus.BAD_REQUEST);
    }
}
