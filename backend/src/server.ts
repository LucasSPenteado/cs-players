import "dotenv/config";
import express from "express";
import router from "./routes.js";
import { errorHandler } from "./middleware/error-handling-middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());

//import routes
app.use(router);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
