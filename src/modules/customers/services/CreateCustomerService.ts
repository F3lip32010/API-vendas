import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';

class CreateCustomerService {
    public async execute({ name, email }: { name: string; email: string }): Promise<Customer> {
        const customersRepository = getCustomRepository(CustomersRepository);
        
        // Verifica email duplicado
        const emailExists = await customersRepository.findByEmail(email);
        if (emailExists) {
            throw new AppError('Email já está em uso.', 409); // Código 409 para conflito
        }

        // Cria e salva o cliente
        const customer = customersRepository.create({ name, email });
        await customersRepository.save(customer);
        
        return customer;
    }
}

export default CreateCustomerService;