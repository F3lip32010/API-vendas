import 'reflect-metadata';
import 'dotenv/config';
import 'module-alias/register';
import express, { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/typeorm';
import uploadConfig from '@config/upload';
import rateLimiter from '@shared/http/middlewares/rateLimiter';

const app = express();

app.use(cors());
app.use(express.json());

app.use(rateLimiter);

app.use(pagination);

app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(errors());

const errorHandler: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        });
        return; // Apenas retorna void
    }

    console.error(error);

    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
};

app.use(errorHandler);

// Inicialização do servidor
const PORT = 3333;
app.listen(PORT, err => {
    if (err) {
        console.log('\x1b[31m%s\x1b[0m', `Error starting server: ${err}`);
    } else {
        const serverMessage = `Server started on port ${PORT}`;
        console.log('\x1b[32m%s\x1b[0m', serverMessage);
    }
});
