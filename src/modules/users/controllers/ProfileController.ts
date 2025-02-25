import { Request, Response } from "express";
import AppError from "@shared/errors/AppError";
import ShowProfileService from "../services/ShowProfileService";
import UpdateProfileSerivce from "../services/UpdateProfileService";
import { instanceToInstance } from 'class-transformer';

export default class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const showProfile = new ShowProfileService();
        const user_id = request.user.id;

        const user = await showProfile.execute({ user_id });

        return response.json(instanceToInstance(user));
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, old_password } = request.body;

        const updateProfile = new UpdateProfileSerivce();
    
        try {
            const user = await updateProfile.execute({
                user_id,
                name,
                email,
                password,
                old_password
            });
    
            return response.json(instanceToInstance(user));
        } catch (error) {
            if (error instanceof AppError) {
                return response.status(400).json({ message: error.message });
            }
    
            return response.status(500).json({ message: "Internal server error" });
        }
    }
}