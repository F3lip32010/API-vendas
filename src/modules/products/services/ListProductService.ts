import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
    public async execute(): Promise<Product[]> {
        const productsRepository = getCustomRepository(ProductRepository);

        const redisCache = new RedisCache();

        const products = productsRepository.find();

        await redisCache.save('teste', 'teste');

        return products;
    }
}

export default ListProductService;
