import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey,
} from 'typeorm';

export class AddCustomerIdToOrders1740176474567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adiciona customer_id à tabela ORDERS (não orders_products)
        await queryRunner.addColumn(
            'orders', // Correção: tabela orders
            new TableColumn({
                name: 'customer_id',
                type: 'uuid',
                isNullable: true,
            }),
        );

        // Cria foreign key em ORDERS (não orders_products)
        await queryRunner.createForeignKey(
            'orders', // Correção: tabela orders
            new TableForeignKey({
                name: 'OrdersCustomer', // Nome corrigido
                columnNames: ['customer_id'],
                referencedTableName: 'customers',
                referencedColumnNames: ['id'],
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove a foreign key de ORDERS
        await queryRunner.dropForeignKey('orders', 'OrdersCustomer');
        // Remove a coluna de ORDERS
        await queryRunner.dropColumn('orders', 'customer_id');
    }
}