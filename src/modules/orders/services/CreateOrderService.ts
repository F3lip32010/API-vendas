import { getCustomRepository } from 'typeorm';
import AppError from '@shared/errors/AppError';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository';
import Product from '@modules/products/typeorm/entities/Product';

interface IProductRequest {
    id: string;
    quantity: number;
}

interface IRequest {
    customer_id: string;
    products: IProductRequest[];
}

class CreateOrderService {
    public async execute({ customer_id, products }: IRequest): Promise<Order> {
        const ordersRepository = getCustomRepository(OrdersRepository);
        const customersRepository = getCustomRepository(CustomersRepository);
        const productsRepository = getCustomRepository(ProductRepository);

        // Validação do cliente
        const customer = await customersRepository.findById(customer_id);
        if (!customer) {
            throw new AppError('Customer not found.', 404);
        }

        // Busca produtos
        const existingProducts = await productsRepository.findAllByIds(
            products.map(p => ({ id: p.id })),
        );

        // Valida existência dos produtos
        if (existingProducts.length !== products.length) {
            const missingIds = products
                .filter(p => !existingProducts.some(ep => ep.id === p.id))
                .map(p => p.id);
            throw new AppError(
                `Products not found: ${missingIds.join(', ')}`,
                404,
            );
        }

        // Verifica estoque
        const insufficientStockProducts = existingProducts.filter(ep => {
            const requestedQuantity = products.find(
                p => p.id === ep.id,
            )!.quantity;
            return ep.quantity < requestedQuantity;
        });

        if (insufficientStockProducts.length > 0) {
            const messages = insufficientStockProducts.map(
                ep =>
                    `Product ${ep.id} has only ${ep.quantity} units available`,
            );
            throw new AppError(messages.join(' | '), 400);
        }

        // Transação
        const queryRunner =
            ordersRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Serializa produtos
            const serializedProducts = products.map(p => ({
                product_id: p.id,
                quantity: p.quantity,
                price: existingProducts.find(ep => ep.id === p.id)!.price,
            }));

            // Cria ordem dentro da transação
            const order = await ordersRepository.createOrder({
                customer,
                products: serializedProducts,
                manager: queryRunner.manager,
            });

            // Atualiza estoque
            await Promise.all(
                existingProducts.map(async ep => {
                    ep.quantity -= products.find(p => p.id === ep.id)!.quantity;
                    await queryRunner.manager.save(ep);
                }),
            );

            await queryRunner.commitTransaction();
            return order;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            console.error('[ORDER SERVICE ERROR]', error);

            if (error instanceof AppError) throw error;
            throw new AppError(
                'Failed to create order. Please try again.',
                500,
            );
        } finally {
            await queryRunner.release();
        }

        // Dentro do bloco try:
    }
}

export default CreateOrderService;
