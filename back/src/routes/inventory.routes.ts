import express from "express";
import { createInventory } from "../controllers/inventory.controller";
import validateUserToken from "../middlewars/validateUserToken";
import { validateUserIsStaffOrAdmin } from "../middlewars/validateUserIsStaffOrAdmin";

const inventoryRouter = express.Router();

inventoryRouter.post(
  "/",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  createInventory
);

export default inventoryRouter;
