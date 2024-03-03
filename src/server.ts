import express from "express";
const app = express();
import databaseConnection from "./config/database.js";
import cors from "cors";
import userRouter from "./api/routes/user.route.js";
import createFluxRouter from "./api/routes/flux.route.js";
import { config } from "dotenv";
config();
app.use(express.json());
app.use(cors());

// console.log(process.env.URL);
//@ts-ignore
databaseConnection(process.env.URL);

app.use("/api", createFluxRouter);
app.use("/user", userRouter);
app.listen(process.env.PORT, () => {
  console.log(`server listening on ${process.env.PORT}`);
});
