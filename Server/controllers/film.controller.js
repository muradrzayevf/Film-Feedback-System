import Film from "../models/film.model.js";

export const searchFilmsTMDB = async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res
      .status(400)
      .json({ message: "Query parameter 'q' is required." });
  }
  if (q.length < 3) {
    return res.status(400).json({
      message: "Query parameter 'q' must be at least 3 characters long.",
    });
  }
  const TMDB_API_KEY = process.env.TMDB_API_KEY;
  const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
    q
  )}`;
  if (!TMDB_API_KEY) {
    return res.status(500).json({ message: "TMDB API key is not configured." });
  }
  const r = await fetch(tmdbUrl);
  if (!r.ok) {
    return res.status(500).json({ message: "Error fetching data from TMDB." });
  }
  const data = await r.json();

  const results = (data.results || []).slice(0, 15).map((film) => ({
    tmdbID: film.id,
    title: film.title,
    release_date: film.release_date,
  }));
  return res.status(200).json(results);
};
export const addFilm = async (req, res) => {
  try {
    const { tmdbID, rating, notes, watchedAt, watched } = req.body;
    const createdby = req.user.id;
    const existingFilm = await Film.findOne({ tmdbID, createdby });
    if (existingFilm) {
      return res
        .status(400)
        .json({ message: "Film with this TMDB ID already exists." });
    }
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      return res
        .status(500)
        .json({ message: "TMDB API key is not configured." });
    }
    const url = `https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ message: "Invalid TMDB ID." });
    }
    const filmData = await response.json();

    const newFilm = await Film.create({
      title: filmData.title,
      tmdbID: filmData.id,
      rating,
      notes,
      watched,
      watchedAt,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Film added successfully", film: newFilm });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding film", error: error.message });
  }
};
export const getUserFilms = async (req, res) => {
  try {
    const userId = req.user.id;
    const films = await Film.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(films);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching films", error: error.message });
  }
};
