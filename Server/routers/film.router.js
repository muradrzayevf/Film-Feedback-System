import express from "express";
import {
  searchFilmsTMDB,
  addFilm,
  getUserFilms,
} from "../controllers/film.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
const router = express.Router();
//search
router.get("/search", searchFilmsTMDB);
// create
router.post("/addfilm", verifyToken, addFilm);
// read
router.get("/myfilms", verifyToken, getUserFilms);
// update

// delete
export default router;
