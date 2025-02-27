/* Serviço de Exclusão de Produto */

import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
    id: string;
}

class DeleteProductService {
    public async execute({ id }: IRequest): Promise<void> {
        const productsRepository = getCustomRepository(ProductRepository);

        const product = await productsRepository.findOne(id);

        if (!product) {
            throw new AppError('Product not found.');
        }

        const redisCache = new RedisCache();

        await redisCache.invalidate('api-vendas-PRODUCT_LIST');

        await productsRepository.remove(product);
    }
}

export default DeleteProductService;
