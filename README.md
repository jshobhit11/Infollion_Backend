# Infollion Backend Task: Weather Proxy API

This project is a Node.js-based proxy server designed to fetch weather data from the OpenWeatherMap API. The server includes features such as rate limiting, caching, and token-based authentication. It also has a simple frontend to display weather information for a given city.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [API Endpoints](#api-endpoints)
  - [Frontend Usage](#frontend-usage)
- [Rate Limiting](#rate-limiting)
- [Caching](#caching)
- [Logging](#logging)
- [Error Handling](#error-handling)
- [Security](#security)

## Features

- **Proxy Server**: Acts as a middleman between the frontend and the OpenWeatherMap API, ensuring that the frontend never directly interacts with external services.
- **Rate Limiting**: Protects the API from abuse by limiting the number of requests a user can make within a specified time window.
- **Caching**: Stores API responses temporarily to reduce redundant requests to the OpenWeatherMap API and improve response times.
- **Authentication**: Secures the API with token-based authentication, allowing only authorized users to access the data.
- **Logging**: Provides detailed logs of incoming requests, including IP addresses, request methods, URLs, and rate limit statuses.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for handling HTTP requests and middleware.
- **Axios**: Promise-based HTTP client for making requests to the OpenWeatherMap API.
- **Express-Rate-Limit**: Middleware to implement rate limiting.
- **Node-Cache**: In-memory caching library to store API responses.
- **Morgan**: HTTP request logger middleware.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Toastify.js**: Library for displaying toast notifications in the frontend.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or above)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/infollion-backend-task.git
   cd infollion-backend-task
2. **Install dependencies:**
  ```bash
   npm install
  ```
## Configuration

Create a .env file in the root directory and add the following environment variables:



`PORT=3000`

`TARGET_API_URL=https://api.openweathermap.org/data/2.5/weather`

`CACHE_DURATION=300`

`RATE_LIMIT_MAX=5`

`RATE_LIMIT_WINDOW=1`

`API_KEY=your_openweathermap_api_key`

`AUTH_TOKEN=your_custom_auth_token`

`PORT: The port on which the server will run (default is 3000).`

`TARGET_API_URL: The base URL for the OpenWeatherMap API.`

`CACHE_DURATION: Duration (in seconds) to cache the weather data.`

`RATE_LIMIT_MAX: Maximum number of requests per window per IP.`

`RATE_LIMIT_WINDOW: Window duration (in minutes) for rate limiting.`

`API_KEY: Your OpenWeatherMap API key.`

`AUTH_TOKEN: Custom token for authenticating API requests.`

**Usage**

Starting the Server
To start the server, run:


```
node index
```
The server will start on the port specified in the .env file (default: 3000).

## API Endpoints
`GET` 

**/api/proxy?city={city}:** Fetches weather data for the specified city.

**Headers:** Authorization: Bearer {AUTH_TOKEN}

**Query Parameters:**
city: The name of the city for which to fetch weather data.

**Response:**

`200 OK:` Weather data in JSON format.

`400 Bad Request:` Missing city parameter.

`401 Unauthorized:` Invalid or missing authentication token.

`429 Too Many Requests:` Rate limit exceeded.

`500 Internal Server Error:` Error fetching data from the external API.

## Frontend Usage
- Open the index.html file in your browser.
- Enter the name of the city in the input field and click "Get Weather."
- The weather information will be displayed below the form.

## Rate Limiting
The rate limiting is implemented using express-rate-limit. 

By default, a maximum of 5 requests per minute per IP address is allowed. 

This can be configured using the RATE_LIMIT_MAX and RATE_LIMIT_WINDOW environment variables.

If the rate limit is exceeded, a 429 Too Many Requests response will be returned, and the event will be logged.

## Caching
Responses from the OpenWeatherMap API are cached using node-cache. 

The default cache duration is 300 seconds (5 minutes), configurable via the CACHE_DURATION environment variable.

Cached responses are served to reduce redundant API requests and improve response times.

## Logging
**Logging is handled by morgan.**

The logs include the request timestamp, IP address, method, URL, status code, response time, content length, and rate limit status.

Logs are printed to the console and can be configured further as needed.

## Error Handling
`400 Bad Request:` Returned if the city query parameter is missing.

`401 Unauthorized:` Returned if the authentication token is missing or invalid.

`429 Too Many Requests:`  Returned if the rate limit is exceeded.

`500 Internal Server Error:` Returned if there is an issue fetching data from the external API.

Errors are logged to the console for debugging purposes.

## Security
**Authentication:** The API is secured with a simple token-based authentication.

 Ensure the `AUTH_TOKEN` is kept secret and secure.

**Rate Limiting:** Protects the API from abuse by limiting the number of requests allowed per IP.

## Screenshots
**Status Code 200**

![Successful Search](https://i.imgur.com/bCNlnuY.png)

**Status Code 500**

![Status Code 500](https://i.imgur.com/hSQofN4.png)

**Status Code 429**

![Status Code 429](https://i.imgur.com/g0AVCce.png)
