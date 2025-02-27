import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import RedisCache from '@shared/cache/RedisCache';

interface IRequest {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

class UpdateProductService {
    public async execute({
        id,
        name,
        price,
        quantity,
    }: IRequest): Promise<Product> {
        try {
            const productsRepository = getCustomRepository(ProductRepository);

            const product = await productsRepository.findOne(id);
            if (!product) {
                throw new AppError('Product not found.');
            }

            const productExists = await productsRepository.findByName(name);
            if (productExists && productExists.id !== id) {
                throw new AppError(
                    'There is already one product with this name',
                );
            }

            const redisCache = new RedisCache();
            await redisCache.invalidate('api-vendas-PRODUCT_LIST');

            product.name = name;
            product.price = price;
            product.quantity = quantity;

            const updatedProduct = await productsRepository.save(product);
            return updatedProduct;
        } catch (error: unknown) {
            // Option 1: Explicitly type as unknown and handle
            if (error instanceof AppError) {
                throw error;
            }
            // Option 2: Type guard to safely access message
            if (error instanceof Error) {
                throw new AppError('Error updating product: ' + error.message);
            }
            // Fallback for unknown error types
            throw new AppError(
                'Error updating product: An unexpected error occurred',
            );
        }
    }
}

export default UpdateProductService;
