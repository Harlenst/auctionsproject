
import express, { Router } from 'express';

import {
    createArticle,
    getArticles,
    getArticle,
    updateArticle
} from '../controllers/articles';

import { authMiddleware } from '../middleware/authMiddleware';

const articleRouter: Router = express.Router();

// Consultas públicas.
articleRouter.get('/articles', getArticles);
articleRouter.get('/articles/:id', getArticle);

// Crear artículos requiere autenticación.
articleRouter.post('/articles', authMiddleware, createArticle);

// Actualizar artículos requiere autenticación.
articleRouter.put('/articles/:id', authMiddleware, updateArticle);

export default articleRouter;
