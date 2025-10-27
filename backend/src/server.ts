import "dotenv/config";
import express from "express";
import router from "./routes.js";
import { errorHandler } from "./middleware/error-handling-middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

//import routes
app.use(router);

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
