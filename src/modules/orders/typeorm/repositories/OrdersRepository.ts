import { EntityRepository, Repository, EntityManager } from 'typeorm';
import Order from '../entities/Order';
import Customer from '@modules/customers/typeorm/entities/Customer';

interface IProduct {
    product_id: string;
    price: number;
    quantity: number;
}

interface IRequest {
    customer: Customer;
    products: IProduct[];
    manager?: EntityManager;
}

@EntityRepository(Order)
class OrdersRepository extends Repository<Order> {
    public async findById(id: string): Promise<Order | undefined> {
        return this.findOne(id, {
            relations: ['order_products', 'customer'],
        });
    }

    public async createOrder({ 
        customer, 
        products, 
        manager 
    }: IRequest): Promise<Order> {
        const order = manager 
            ? manager.create(Order, { 
                customer, 
                order_products: products 
              })
            : this.create({ 
                customer, 
                order_products: products 
              });

        if (manager) {
            await manager.save(order);
        } else {
            await this.save(order);
        }

        return order;
    }
}

export default OrdersRepository;