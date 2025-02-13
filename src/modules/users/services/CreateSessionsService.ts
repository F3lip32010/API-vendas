import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import User from "../typeorm/entities/User";
import UsersRepository from "../typeorm/repositories/UsersRepository";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from '@config/auth';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

class CreateSessionsService {
    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const usersRepository = getCustomRepository(UsersRepository);
        const user = await usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401); // Lança o erro
        }

        const passwordConfirmed = await compare(password, user.password)

        if (!passwordConfirmed) {
            throw new AppError('Incorrect email/password combination.', 401); // Lança o erro
        }   

        const token = sign({}, authConfig.jwt.secret, {
            subject: user.name,
            expiresIn: authConfig.jwt.expiresIn,
        });

        return {
            user,
            token,
        };
    } 
}

export default CreateSessionsService;