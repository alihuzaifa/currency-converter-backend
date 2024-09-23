import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { currencyDocumentation, currencySchemas } from "./documentation.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Swagger documentation setup
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Currency Converter API",
    version: "1.0.0",
    description: "API for converting currencies using FreeCurrencyAPI",
  },
  servers: [
    {
      url: "http://localhost:5000",
    },
  ],
  paths: { ...currencyDocumentation },
  components: {
    schemas: { ...currencySchemas },
  },
};

// Options for the swagger docs
const swaggerOptions = {
  swaggerDefinition,
  apis: ["./swaggerDocumentation.ts"], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (_, res) => {
  res.send("Welcome to the Currency Converter API");
});

// Endpoint to get currencies
app.get("/api/currencies", async (_, res) => {
  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/currencies?apikey=${process.env.CURRENCY_API_KEY}`
    );
    const currencies = response.data.data; // Assuming the API response contains an array of currencies
    res.json(currencies);
  } catch (error) {
    res.status(500).json({ error: "Error fetching currencies" });
  }
});

// Conversion endpoint
app.post("/api/convert", async (req, res) => {
  const { from, to, amount } = req.body;

  try {
    const response = await axios.get(
      `https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.CURRENCY_API_KEY}&currencies=${from},${to}`
    );
    const rates = response.data.data;

    const result = (amount * rates[to]) / rates[from];

    res.status(200).json({
      from,
      to,
      amount,
      result,
      date: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: "Error converting currency" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
