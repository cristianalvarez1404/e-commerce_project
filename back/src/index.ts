import express, { Request, Response } from "express";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/products.routes";
import inventoryRouter from "./routes/inventory.routes";
import cardRouter from "./routes/card.routes";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/inventory", inventoryRouter);
app.use("/card", cardRouter);

app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({ message: "Hello world" });
});

app.use("*", (req: Request, res: Response): Response => {
  return res.status(400).json({ message: "error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
