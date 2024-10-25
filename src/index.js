import express from "express";
import newsRouter from "./routes/news.js";
import userRouter from "./routes/user.js";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from "swagger-jsdoc";

connectDB();

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000', 
  'https://news-api-umber.vercel.app'
];
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Noticias',
      version: '1.0.0',
      description: 'API para gestionar noticias',
      contact: {
        name: 'Benjamin Hoffman',
      },
      servers: [
        {
          url: 'https://news-api-umber.vercel.app/',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(
  cors({
    origin: allowedOrigins
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/news", newsRouter);
app.use("/user", userRouter);

app.listen(4000, () => {
  console.log("Server running on port 4000");
});
