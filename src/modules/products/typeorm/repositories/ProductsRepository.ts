import { EntityRepository, Repository, In } from 'typeorm';
import Product from '../entities/Product';

interface iFindProducts {
    id: string;
}

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
    public async findByName(name: string): Promise<Product | undefined> {
        const product = this.findOne({
            where: {
                name,
            },
        });

        return product;
    }

    public async findAllByIds(products: iFindProducts[]): Promise<Product[]> {
        const productIds = products.map(product => product.id);

        const existsProducts = await this.find({
            where: {
                id: In(productIds),
            },
        });

        return existsProducts;
    }
}
