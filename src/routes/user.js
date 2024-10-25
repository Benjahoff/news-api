import { Router } from "express";
import { UserController } from "../controllers/user.js";
import limiter from "../middlewares/rateLimiter.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints relacionados con la gestión de usuarios.
 */

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags:
 *       - Usuarios
 *     description: Crea un nuevo usuario en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nombre de usuario.
 *                 example: "benjaminhoffman"
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "benjamin@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "mypassword123"
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Error en los datos enviados o el correo/nombre de usuario ya está en uso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El correo electrónico ya está en uso"
 *       404:
 *         description: No fue posible registrar el usuario.
 *       500:
 *         description: Error en el servidor.
 */
router.post("/register", limiter, UserController.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags:
 *       - Usuarios
 *     description: Inicia sesión con el correo y la contraseña del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario.
 *                 example: "test@example.com"
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario.
 *                 example: "pass1234"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticación.
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Error en los datos enviados.
 */
router.post("/login", limiter, UserController.getUserByEmail);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Cerrar sesión
 *     tags:
 *       - Usuarios
 *     description: Elimina el token de autenticación y cierra la sesión del usuario.
 *     responses:
 *       200:
 *         description: Logout exitoso.
 */
router.get("/logout", UserController.logout);

export default router;
