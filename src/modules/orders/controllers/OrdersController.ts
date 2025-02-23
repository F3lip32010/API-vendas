import { Request, Response, NextFunction } from 'express';
import ShowOrderService from '../services/ShowOrderService';
import CreateOrderService from '../services/CreateOrderService';

export default class OrdersController {
    /* SHOW */
    public async show(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const { id } = request.params;
            const showOrder = new ShowOrderService();
            const order = await showOrder.execute({ id });
            return response.json(order);
        } catch (error) {
            next(error);
        }
    }

    /* CREATE */
    public async create(
        request: Request,
        response: Response,
        next: NextFunction
    ): Promise<Response | void> {
        try {
            const { customer_id, products } = request.body;
            const createOrder = new CreateOrderService();
            const order = await createOrder.execute({
                customer_id,
                products,
            });
            return response.status(201).json(order);
        } catch (error) {
            next(error);
        }
    }
}