import { Request, Response } from 'express';
import ListCustomerService from '../services/ListCustomerService';
import ShowCustomerService from '../services/ShowCustomerService';
import CreateCustomerService from '../services/CreateCustomerService';
import UpdateCustomerSerivce from '../services/UpdateCustomerService';
import DeleteCustomerService from '../services/DeleteCustomerService';
import AppError from '@shared/errors/AppError';

export default class CustomersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const listCustomers = new ListCustomerService();

        const customers = await listCustomers.execute();

        return response.json(customers);
    }

    public async show(
        request: Request,
        response: Response
      ): Promise<Response> {
        try {
          const { id } = request.params;
      
          // Validação do ID (UUID)
          if (!id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/)) {
            throw new AppError("ID inválido.", 400);
          }
      
          const showCustomer = new ShowCustomerService();
          const customer = await showCustomer.execute({ id });
      
          return response.json(customer);
      
        } catch (error) {
          // Tratamento de erros
          if (error instanceof AppError) {
            return response.status(error.statusCode).json({ error: error.message });
          }
          return response.status(500).json({ error: "Erro ao buscar cliente" });
        }
      }

    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        try {
            const { name, email } = request.body;
            const createCustomer = new CreateCustomerService();
            const customer = await createCustomer.execute({ name, email });
            return response.json(customer);
        } catch (error) {
            // Verificação explícita do tipo
            if (error instanceof AppError) {
                return response
                    .status(error.statusCode)
                    .json({ error: error.message });
            } else if (error instanceof Error) {
                return response.status(400).json({ error: error.message });
            }
            return response.status(500).json({ error: 'Erro inesperado' });
        }
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email } = request.body;
        const { id } = request.params;

        const updateCustomer = new UpdateCustomerSerivce();

        const customer = await updateCustomer.execute({
            id,
            name,
            email,
        });

        return response.json(customer);
    }

    public async delete(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { id } = request.params;

        const deleteCustomer = new DeleteCustomerService();

        await deleteCustomer.execute({ id });

        return response.json([]);
    }
}
