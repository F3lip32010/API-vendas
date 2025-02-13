import { Request, Response } from "express";
import CreateSessionsService from "../services/CreateSessionsService";
import AppError from "@shared/errors/AppError";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { email, password } = request.body;
      const createSession = new CreateSessionsService();
      
      const user = await createSession.execute({ email, password });
      
      return response.json(user);
      
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: 'error', // ← Definido aqui
            message: error.message // ← Mensagem do service
        });
      }
      
      // Caso seja um erro não tratado
      console.error(error); // Registrar o erro para análise
      return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
      });
    }
  }
}