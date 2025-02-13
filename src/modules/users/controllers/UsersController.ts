import { Request, Response } from "express";
import ListUserService from "../services/ListUserService";
import CreateUserService from "../services/CreateUserService";
import AppError from "@shared/errors/AppError";

export default class UsersController {
    public async index(request: Request, response: Response): Promise<Response> {
        const listUser = new ListUserService();

        console.log(request.user.id);

        const users = await listUser.execute();

        return response.json(users);
    }

    public async create(request: Request, response: Response): Promise<Response> {
        const { name, email, password } = request.body;
        const createUser = new CreateUserService();
    
        try {
            const user = await createUser.execute({
                name,
                email,
                password,
            });
    
            return response.json(user);
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(400).json({ message: error.message });
            }
    
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}