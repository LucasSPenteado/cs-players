import { Router } from "express";
import { listAll } from "@/controller/list-all.js";
import { findOne } from "@/controller/find-one.js";
import { deletePlayer } from "./controller/delete-player.js";
import { updatePlayer } from "./controller/update-player.js";
import { createPlayer } from "./controller/create-player.js";
import { userController } from "./controller/create-new-user.js";

const router = Router();

router.get("/api/players", listAll);
router.get("/api/players/:id", findOne);
router.delete("/api/players/:id", deletePlayer);
router.put("/api/players/:id", updatePlayer);
router.post("/api/players", createPlayer);
router.post("/signup", userController);

export default router;
