import express from "express";
import { searchFilmsTMDB, addFilm } from "../controllers/film.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
const router = express.Router();
//search
router.get("/search", searchFilmsTMDB);
// create
router.post("/addfilm", verifyToken, addFilm);
// read

// update

// delete
export default router;
