const currencyDocumentation = {
  "/api/currencies": {
    get: {
      tags: ["Currency"],
      summary: "Get list of available currencies",
      operationId: "getCurrencies",
      responses: {
        200: {
          description: "List of currencies",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
          },
        },
        500: {
          description: "Error fetching currencies",
        },
      },
    },
  },
  "/api/convert": {
    post: {
      tags: ["Currency"],
      summary: "Convert currency from one to another",
      operationId: "convertCurrency",
      requestBody: {
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/CurrencyConversionInput",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Conversion successful",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CurrencyConversionResponse",
              },
            },
          },
        },
        400: {
          description: "Invalid input",
        },
        500: {
          description: "Error converting currency",
        },
      },
    },
  },
};

const currencySchemas = {
  CurrencyConversionInput: {
    type: "object",
    properties: {
      from: {
        type: "string",
        example: "USD",
      },
      to: {
        type: "string",
        example: "EUR",
      },
      amount: {
        type: "number",
        example: 100,
      },
    },
    required: ["from", "to", "amount"],
  },
  CurrencyConversionResponse: {
    type: "object",
    properties: {
      from: {
        type: "string",
      },
      to: {
        type: "string",
      },
      amount: {
        type: "number",
      },
      result: {
        type: "number",
      },
      date: {
        type: "string",
        format: "date-time",
      },
    },
  },
};

export { currencyDocumentation, currencySchemas };
