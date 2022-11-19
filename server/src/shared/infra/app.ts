import 'reflect-metadata';
import 'express-async-errors';
import '@shared/container';
import cors from 'cors';
import express, { Request, Response, NextFunction, json } from 'express';
import basicAuth from 'express-basic-auth';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';

import { AppError } from '@errors/AppError';
import { customCss } from '@utils/swaggerCss';

import { routes } from './routes';
import swaggerFile from './swagger.json';

export const app = express();

app.use(json());
app.use(
  '/api-docs',
  basicAuth({
    users:
      process.env.NODE_ENV === 'dev'
        ? { admin: 'admin' }
        : { admin: process.env.SWAGGER_PASSWORD },
    challenge: true,
  }),
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    customCss,
    customSiteTitle: 'Flow API',
    swaggerOptions: {
      docExpansion: 'none',
    },
  }),
);

app.use(cors());

app.use(routes);

app.use(
  (err: Error, _request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    console.log('🚀 ~ file: app.ts ~ line 20 ~ err', err);

    return response.status(500).json({
      status: 'error',
      message: `Internal server error:\n ${err.message}`,
    });
  },
);

export const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
