const mongoose = require("mongoose");


const seriesApiResponseSchema = mongoose.Schema({
  externals: Object,
  genres: Array,
  id: Number,
  image: Object,
  language: String,
  name: String,
  network: Object,
  officialSite: String,
  premiered: String,
  rating: Object,
  runtime: Number,
  schedule: Object,
  status: String,
  summary: String,
  type: String,
  updated: Number,
  url: String,
  webChannel: Object,
  weight: Number,
  links: Object
})

module.exports = mongoose.model("SeriesApiResponse", seriesApiResponseSchema);