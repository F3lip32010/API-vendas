/* Controlador de Produtos */

import { Request, Response } from 'express';
import ListProductService from '../services/ListProductService';
import ShowProductService from '../services/ShowProductService';
import CreateProductService from '../services/CreateProductService';
import UpdateProductService from '../services/UpdateProductService';
import DeleteProductService from '../services/DeleteProductService';

export default class ProdcutsController {

    /* INDEX */
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listProducts = new ListProductService();

        const products = await listProducts.execute();

        return response.json(products);
    }

    /* SHOW */
    public async show(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const showProduct = new ShowProductService();

        const product = await showProduct.execute({ id });

        return response.json(product);
    }

    /* CREATE */
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, price, quantity } = request.body;

        const createProduct = new CreateProductService();

        const product = await createProduct.execute({
            name,
            price,
            quantity,
        });

        return response.json(product);
    }

    /* UPDATE */
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, price, quantity } = request.body;
        const { id } = request.params;

        const updateProduct = new UpdateProductService();

        const product = await updateProduct.execute({
            id,
            name,
            price,
            quantity,
        });

        return response.json(product);
    }

    /* DELETE */
    public async delete(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const DeleteProduct = new DeleteProductService();

        await DeleteProduct.execute({ id });

        return response.json([]);
    }
}
