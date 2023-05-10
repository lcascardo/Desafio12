import {Router} from "express";
import controller from "../controllers/mocking-products.js";

const router = Router();

router.get("/", controller.getMockingProducts);

export default router;