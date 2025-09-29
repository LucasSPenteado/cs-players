import { Router } from "express";
import { listAll } from "@/controller/players/list-all.js";
import { findOne } from "@/controller/players/find-one.js";
import { deletePlayer } from "./controller/players/delete-player.js";
import { updatePlayer } from "./controller/players/update-player.js";
import { createPlayer } from "./controller/players/create-player.js";
import { userController } from "./controller/users/create-new-user.js";
import { authenticateToken } from "./middleware/authenticate-token.js";

const router = Router();

router.get("/api/players", authenticateToken, listAll);
router.get("/api/players/:id", findOne);
router.delete("/api/players/:id", deletePlayer);
router.put("/api/players/:id", updatePlayer);
router.post("/api/players", createPlayer);
router.post("/signup", userController);

export default router;
