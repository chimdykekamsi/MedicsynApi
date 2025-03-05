import dotenv from "dotenv";
dotenv.config();
import express, { Response } from "express";
// import swaggerJSDoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection";
import router from "./services";
import deserialize from "./middleware/deserialize";
import config from "./config";
import * as fs from 'fs'; //for reading the swagger json file
import * as path from 'path'; // for exposing the swagger json path

const app = express();

const port = config.PORT;

const app_url = `${config.APP_URL}${port}`;


// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "MedicSyn API Documentation",
//     version: "1.0.0",
//     description: "API documentation for Medicsyn Medical Adherence",
//   },
//   servers: [
//     {
//       url: app_url,
//       description: "Development server",
//     },
//   ],
// };
// const options = {
//   swaggerDefinition,
//   apis: [
//     "./src/routes/**/index.ts",
//   ],
// };
// const swaggerSpec = swaggerJSDoc(options);



//Reading the swagger.json file using JSON parse method
const swaggerDocs = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf-8')
);

var corOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  setHeaders: function (res: Response, path: string, stat: any) {
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  },
};





app.use(express.json());
app.use(cors(corOptions));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.disable("x-powered-by");

// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(deserialize);
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  connect();
  console.log("everything is woring correctly...");
});

