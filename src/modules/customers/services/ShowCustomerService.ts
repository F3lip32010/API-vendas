import { getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import CustomersRepository from "../typeorm/repositories/CustomersRepository";
import AppError from "@shared/errors/AppError";

class ShowCustomerService {
  public async execute({ id }: { id: string }): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    
    const customer = await customersRepository.findById(id); // Método personalizado
    
    if (!customer) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    return customer;
  }
}

export default ShowCustomerService;