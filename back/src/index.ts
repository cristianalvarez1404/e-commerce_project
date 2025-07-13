import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/products.routes";
import inventoryRouter from "./routes/inventory.routes";
import cardRouter from "./routes/card.routes";
import { dbConnection } from "./db/db";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ErrorCustomised } from "./errors/Error";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/carts", cardRouter);

app.use(
  "*",
  (err: any, req: Request, res: Response, next: NextFunction): Response => {
    if (err instanceof ErrorCustomised) {
      return res.status(err.getStatusHTTP()).json({ message: err.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  dbConnection();
});
