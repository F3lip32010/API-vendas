/* Serviço de Exibição de Produto */

import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';

interface IRequest {
    id: string;
}

class ShowProductService {
    public async execute({ id }: IRequest): Promise<Product> {
        const productsRepository = getCustomRepository(ProductRepository);

        const product = await productsRepository.findOne(id);

        if (!product) {
            throw new AppError('Product not found.');
        }

        return product;
    }
}

export default ShowProductService;
