import mongoose from "mongoose";

const FilmSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },

    tmdbID: { type: Number, required: true },

    rating: { type: Number, min: 0, max: 10 },
    notes: { type: String, maxlength: 1000 },

    watched: { type: Boolean, default: false },
    watchedAt: { type: Date },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

// hər user eyni filmi 1 dəfə əlavə etsin
FilmSchema.index({ tmdbID: 1, createdBy: 1 }, { unique: true });

const Film = mongoose.model("film", FilmSchema);
export default Film;
