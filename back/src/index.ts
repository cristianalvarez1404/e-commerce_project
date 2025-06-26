import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({ message: "Hello world" });
});

app.use("*", (req: Request, res: Response): Response => {
  return res.status(400).json({ message: "error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
