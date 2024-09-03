const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: process.env.CACHE_DURATION || 300 }); // Cache duration in seconds

app.use(cors());

morgan.token("remote-addr", function (req) {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
});

morgan.token("date", function () {
  return new Date().toISOString();
});

morgan.token("rate-limit", function (req) {
  if (req.rateLimit) {
    return `Remaining: ${req.rateLimit.remaining}/${req.rateLimit.limit}`;
  }
  return "N/A";
});

app.use(
  morgan(
    ":date - :remote-addr - :method :url :status :response-time ms - :res[content-length] - :rate-limit"
  )
);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 1) * 60 * 1000, // Window time in milliseconds
  max: process.env.RATE_LIMIT_MAX || 5, // Maximum number of requests per window per IP
  message: "Too many requests, please try again later.",
  statusCode: 429,
  handler: (req, res, next) => {
    res
      .status(429)
      .json({ message: "Too many requests, please try again later." });
  },
  onLimitReached: (req, res, options) => {
    console.log(
      `Rate limit exceeded by ${
        req.headers["x-forwarded-for"] || req.connection.remoteAddress
      }`
    );
  },
});

app.use(limiter);

// Authentication middleware
const authenticate = (req, res, next) => {
  const authToken = req.headers["authorization"];

  if (authToken && authToken === `Bearer ${process.env.AUTH_TOKEN}`) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Apply authentication to the proxy route
app.use("/api/proxy", authenticate);

// Proxy route
app.get("/api/proxy", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ message: "City parameter is required" });
  }

  const apiUrl = `${process.env.TARGET_API_URL}?q=${city}&appid=${process.env.API_KEY}`;
  const cacheKey = apiUrl;

  // Check if the response is cached
  if (cache.has(cacheKey)) {
    console.log("Serving from cache");
    return res.json(cache.get(cacheKey));
  }

  try {
    // Make a request to the target API
    const response = await axios.get(apiUrl);
    const data = response.data;

    // Cache the response
    cache.set(cacheKey, data);

    // Return the API response
    res.json(data);
  } catch (error) {
    console.error("Error fetching from the external API:", error);
    res.status(500).json({ message: "Error fetching from the external API" });
  }
});

app.listen(port, () => {
  console.log(`API Proxy Server is running on port ${port}`);
});
