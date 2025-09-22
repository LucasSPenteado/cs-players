//import Express
import "dotenv/config";
import express from "express";
import router from "./routes.js";
import { errorHandler } from "./middleware/error-handling-middleware.js";

const app = express();

app.use(express.json());

//import routes
app.use(router);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
