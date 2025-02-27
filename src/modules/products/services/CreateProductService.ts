/* Serviço de Criação de Produto */

import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
    name: string;
    price: number;
    quantity: number;
}

class CreateProductService {
    public async execute({
        name,
        price,
        quantity,
    }: IRequest): Promise<Product> {
        const productsRepository = getCustomRepository(ProductRepository);
        const productExists = await productsRepository.findByName(name);

        if (productExists) {
            throw new AppError('There is already one product with this name');
        }

        const redisCache = new RedisCache();

        const product = productsRepository.create({
            name,
            price,
            quantity,
        });

        await redisCache.invalidate('api-vendas-PRODUCT_LIST');

        await productsRepository.save(product);

        return product;
    }
}

export default CreateProductService;
