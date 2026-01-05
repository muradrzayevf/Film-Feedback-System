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
  const tmdbUrl = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
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
    title: film.title || film.name,
    media_type: film.media_type,
    release_date: film.release_date || film.first_air_date,
    rating: film.vote_average,
    overview: film.overview,
  }));
  return res.status(200).json(results);
};
export const addFilm = async (req, res) => {
  try {
    const { tmdbID, media_type, rating, notes, watchedAt, watched } = req.body;
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
    const url =
      media_type === "tv"
        ? `https://api.themoviedb.org/3/tv/${tmdbID}?api_key=${TMDB_API_KEY}`
        : `https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(400).json({ message: "Invalid TMDB ID." });
    }
    const filmData = await response.json();
    let runtime = 0;
    if (media_type === "movie") {
      runtime = filmData.runtime || 0;
    } else if (media_type === "tv") {
      runtime =
        filmData.episode_run_time && filmData.episode_run_time.length > 0
          ? filmData.episode_run_time[0]
          : 0;
      const epp = filmData.number_of_episodes || 1;
      runtime = runtime * epp;
    }
    const newFilm = await Film.create({
      title: filmData.title,
      tmdbID: filmData.id,

      rating,
      notes,
      watched,
      watchedAt,
      runtime: runtime,
      media_type: media_type,
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
