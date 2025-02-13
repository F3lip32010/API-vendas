/* Middleware serve como verificação */

import AppError from "@shared/errors/AppError";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from '@config/auth';

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function isAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('JWT Token is missing.');
    }
    // Bearer sdf465g6dsfg46d54g6s45fgs645fg6s45fg
    const [, token] = authHeader.split(' ');

    try {
        const decodedToken = verify(token, authConfig.jwt.secret);

        console.log(decodedToken);

        const { sub } = decodedToken as ITokenPayload;

        request.user = {
            id: sub,
        }

        return next();
    } catch {
        throw new AppError('Invalid JWT Token.');
    }
}