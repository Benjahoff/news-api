import { Router } from "express";
import NewsController from "../controllers/news.js";
import limiter from "../middlewares/rateLimiter.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Noticias
 *   description: Endpoints relacionados con la gestión de noticias.
 */

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Obtener todas las noticias con paginación y ordenación
 *     tags:
 *       - Noticias
 *     description: Retorna una lista de noticias con paginación y permite ordenar por fecha o prioridad.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página actual (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Cantidad de noticias por página (por defecto 10)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Campo para ordenar las noticias (por defecto 'publishedAt')
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *         description: Orden de las noticias ('asc' para ascendente, 'desc' para descendente, por defecto 'desc')
 *     responses:
 *       200:
 *         description: Lista de noticias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       author:
 *                         type: string
 *                       title:
 *                         type: string
 *                       subtitle:
 *                         type: string
 *                       category:
 *                         type: string
 *                       urlToImage:
 *                         type: string
 *                       publishedAt:
 *                         type: string
 *                         format: date-time
 *                       content:
 *                         type: string
 *                 totalNews:
 *                   type: integer
 *                   description: Número total de noticias
 *                 totalPages:
 *                   type: integer
 *                   description: Número total de páginas
 *                 currentPage:
 *                   type: integer
 *                   description: Página actual
 *       400:
 *         description: Error en los parámetros de la solicitud.
 */
router.get("/", limiter, NewsController.getAll);

/**
 * @swagger
 * /news:
 *   post:
 *     summary: Guardar una nueva noticia
 *     tags:
 *       - Noticias
 *     description: Permite agregar una nueva noticia.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: Autor de la noticia.
 *                 example: "Juan Pérez"
 *               title:
 *                 type: string
 *                 description: Título de la noticia.
 *                 example: "El impacto del cambio climático"
 *               subtitle:
 *                 type: string
 *                 description: Subtítulo de la noticia.
 *                 example: "Un análisis detallado del fenómeno"
 *               category:
 *                 type: string
 *                 description: Categoría de la noticia.
 *                 example: "Ciencia"
 *               urlToImage:
 *                 type: string
 *                 description: URL de la imagen asociada a la noticia.
 *                 example: "https://example.com/image.jpg"
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de publicación.
 *                 example: "2024-01-01T12:00:00Z"
 *               content:
 *                 type: string
 *                 description: Contenido completo de la noticia.
 *                 example: "El cambio climático está afectando..."
 *     responses:
 *       201:
 *         description: Noticia creada con éxito.
 *       400:
 *         description: Error en los datos enviados.
 */
router.post("/", authenticateToken, NewsController.saveNews);

/**
 * @swagger
 * /news/{id}:
 *   put:
 *     summary: Actualizar una noticia por ID
 *     tags:
 *       - Noticias
 *     description: Actualiza una noticia existente con la información proporcionada.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la noticia a actualizar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *                 description: Autor de la noticia.
 *               title:
 *                 type: string
 *                 description: Título de la noticia.
 *               subtitle:
 *                 type: string
 *                 description: Subtítulo de la noticia.
 *               category:
 *                 type: string
 *                 description: Categoría de la noticia.
 *               urlToImage:
 *                 type: string
 *                 description: URL de la imagen asociada a la noticia.
 *               content:
 *                 type: string
 *                 description: Contenido de la noticia.
 *     responses:
 *       200:
 *         description: Noticia actualizada correctamente.
 *       404:
 *         description: Noticia no encontrada.
 */
router.put("/:id", authenticateToken, NewsController.updateNews);

/**
 * @swagger
 * /news/{id}:
 *   delete:
 *     summary: Eliminar una noticia por ID
 *     tags:
 *       - Noticias
 *     description: Elimina una noticia específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la noticia a eliminar
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Noticia eliminada correctamente.
 *       404:
 *         description: Noticia no encontrada.
 */
router.delete("/:id", authenticateToken, NewsController.deleteNews);

export default router;
