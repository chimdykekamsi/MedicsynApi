import dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection";
import router from "./services";
import config from "./config";
import http from "http";

const app = express();
const server = http.createServer(app);


const port = config.PORT;
const app_url = `${config.APP_URL}${port}`;


var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  setHeaders: function (res: Response, path: string, stat: any) {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  },
};

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "MedicSyn API Documentation",
    version: "1.0.0",
    description: "API documentation for Medicsyn Medical Adherence",
  },
  servers: [
    {
      url: app_url,
      description: "Development server",
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: [
    "./src/services/**/index.ts",
  ],
};
const swaggerSpec = swaggerJSDoc(options);


app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.disable("x-powered-by");

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);

server.listen(port, () => {
  console.log(`listening on port ${port}`);
  connect();
});