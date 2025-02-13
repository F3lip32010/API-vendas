/* Serviço de Listagem de Usuários */

import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';

class ListUserService {
    public async execute(): Promise<User[]> {
        const usersRepository = getCustomRepository(UsersRepository);

        // Adicionado await para resolver a Promise corretamente
        const users = await usersRepository.find();

        return users;
    }
}

export default ListUserService;