import { UserModel } from "../model/user.js";
import { validatePartialUser, validateUser } from "../schemas/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  // Cerrar sesión (eliminar token)
  static async logout(req, res) {
    res.clearCookie("login_token");
    return res.status(200).json({
      message: "Logout successfully",
    });
  }

  // Obtener usuario por email (login)
  static async getUserByEmail(req, res) {
    try {
      const result = validatePartialUser(req.body);
      if (!result.success) {
        return res
          .status(400)
          .json({ errors: JSON.parse(result.error.message) });
      }
      const user = await UserModel.getUserByEmail(result.data.email);

      if (!user) {
        return res.status(404).json({ errors: { email: "User not found." } });
      }

      const isValid = bcrypt.compareSync(result.data.password, user.password);

      if (!isValid) {
        return res
          .status(400)
          .json({ errors: { password: "Invalid password." } });
      }

      const token = jwt.sign(
        { username: user.username, createdDate: user.createdDate },
        process.env.JWT_TOKEN,
        { expiresIn: "1h" }
      );
      res.cookie("login_token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 3600000, 
      });

      return res.status(200).json({
        message: "User authenticated successfully",
        user: {
          username: user.username,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      return res.status(500).json({
        message: "An error occurred while finding the user",
        error: error.message,
      });
    }
  }

  // Registrar un nuevo usuario
  static async registerUser(req, res) {
    try {
      const result = validateUser(req.body);

      if (!result.success) {
        return res
          .status(400)
          .json({ error: JSON.parse(result.error.message) });
      }

      const hashedPassword = bcrypt.hashSync(
        result.data.password,
        parseInt(process.env.PASSWORD_SALT)
      );

      try {
        const user = await UserModel.registerUser({
          username: result.data.username,
          email: result.data.email,
          password: hashedPassword,
          createdDate: result.data.createdDate,
        });

        if (!user) {
          return res.status(404).json({
            message: "It was not possible to register the user",
          });
        }

        res.status(200).json({
          message: "User registered successfully",
          user: {
            username: result.data.username,
            email: result.data.email,
          },
        });
      } catch (mongoError) {
        if (mongoError.code === 11000) {
          if (mongoError.keyPattern.email) {
            return res.status(400).json({
              message: "El correo electrónico ya está en uso",
            });
          }
          if (mongoError.keyPattern.username) {
            return res.status(400).json({
              message: "El nombre de usuario ya está en uso",
            });
          }
        }

        return res.status(500).json({
          message: "An error occurred while registering the user",
          error: mongoError.message,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while creating the user",
        error: error.message,
      });
    }
  }
}
