import express from "express";
import {
  createInventory,
  deleteInventory,
  getInventories,
  getInventoryById,
  updateInventory,
} from "../controllers/inventory.controller";
import validateUserToken from "../middlewars/validateUserToken";
import { validateUserIsStaffOrAdmin } from "../middlewars/validateUserIsStaffOrAdmin";
import { validateUserIsAdmin } from "../middlewars/validateUserIsAdmin";

const inventoryRouter = express.Router();

inventoryRouter.get(
  "/",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  getInventories
);

inventoryRouter.get(
  "/:id",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  getInventoryById
);

inventoryRouter.post(
  "/",
  validateUserToken,
  validateUserIsStaffOrAdmin,
  createInventory
);

inventoryRouter.put(
  "/:id",
  validateUserToken,
  validateUserIsAdmin,
  updateInventory
);
inventoryRouter.delete(
  "/:id",
  validateUserToken,
  validateUserIsAdmin,
  deleteInventory
);

export default inventoryRouter;
