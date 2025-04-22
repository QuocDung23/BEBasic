import express from "express";
import mongoose from "mongoose";

// MongoDB connection
mongoose
  .connect("mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
});

// Create a model from the schema
const movieCollection = mongoose.model("Movie", movieSchema);

const app = express();
app.use(express.json());

// Create a new movie
app.post("/movies", async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const result = await movieCollection.create({ title, genre, rating });
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Read all movies
app.get("/movies", async (req, res) => {
  try {
    const findAll = await movieCollection.find(req.query);
    res.status(200).send(findAll);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
// Count the numbers of movie
app.get("/movies/count", async (req, res) => {
  const { id } = req.query;
  const countMov = await movieCollection.countDocuments({ id });

  try {
    res.status(200).send({ id, totalMovies: countMov });
  } catch (err) {
    res.status(400).send("Erro:" + err.message);
  }
});
// Read movie by id
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const findByID = await movieCollection.findById(id);
    if (!findByID) {
      res.status(404).send("Movie not found");
    } else {
      res.status(200).send(findByID);
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// Read Movie by genre
app.get("/movies/:genre", async (req, res) => {
  const { genre } = req.params;
  try {
    const findGenre = await movieCollection.findOne({ genre });
    if (!findGenre) {
      res.status(404).send("Movie not found");
    } else {
      res.status(200).send(findGenre);
    }
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

// Find movie have max rating\
app.get("/movies/highest-rating", async (req, res) => {
  try {
    const topMovie = await movieCollection.findOne().sort({ rating: -1 });
    if (!topMovie) {
      return res.status(404).send("No movies found");
    }
    res.status(200).send(topMovie);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid movie ID");
    }
    const findByID = await movieCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { title, genre, rating } }
    );
    if (findByID.matchedCount === 0) {
      res.status(404).send("Movie not found");
    } else {
      res.status(200).send("Movie updated successfully");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Delete a movie
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid movie ID");
    }
    const deleteMovie = await movieCollection.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (deleteMovie.deletedCount === 0) {
      res.status(404).send("Movie not found");
    } else {
      res.status(200).send("Movie deleted successfully");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
