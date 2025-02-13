import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

const FORGOT_PASSWORD_ROUTE = '/forgot';

passwordRouter.post(
    FORGOT_PASSWORD_ROUTE,
    celebrate({
        [Segments.BODY]: {
            email: Joi.string().email().required(),
        },
    }),
    async (req, res, next) => {
        try {
            await forgotPasswordController.create(req, res);
        } catch (error) {
            next(error); // Garante que erros sejam capturados pelo middleware de erro global
        }
    }
);

export default passwordRouter;
