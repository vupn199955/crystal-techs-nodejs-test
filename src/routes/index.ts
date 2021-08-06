import { Router } from "express";
import stations from "./stations";

const router = Router();

router.use("/stations", stations);

export default router;