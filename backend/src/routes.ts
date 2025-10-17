import { Router } from "express";
import { listAll } from "@/controller/players/list-all.js";
import { findOne } from "@/controller/players/find-one.js";
import { deletePlayer } from "./controller/players/delete-player.js";
import { updatePlayer } from "./controller/players/update-player.js";
import { createPlayer } from "./controller/players/create-player.js";
import { userCreateController } from "./controller/users/create-new-user.js";
import { authenticateToken } from "./middleware/authenticate-token.js";
import { loginUserController } from "./controller/users/login-user.js";
import { refreshTokenController } from "./controller/refresh-token-controller.js";
import { logoutUserController } from "./controller/users/logout-user.js";

const router = Router();

router.get("/api/players", authenticateToken, listAll);
router.get("/api/players/:id", findOne);
router.delete("/api/players/:id", deletePlayer);
router.put("/api/players/:id", updatePlayer);
router.post("/api/players", createPlayer);
router.post("/signup", userCreateController);
router.post("/login", loginUserController);
router.post("/authenticate", refreshTokenController);
router.post("/logout", logoutUserController);

export default router;
