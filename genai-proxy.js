const http = require("http");

const PORT = 8787;
const REMOTE_URL = "https://api.genai.mil/v1/chat/completions";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Api-Key",
  "Access-Control-Max-Age": "86400",
};

function writeJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    ...CORS_HEADERS,
  });
  response.end(JSON.stringify(payload));
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, CORS_HEADERS);
    response.end();
    return;
  }

  if (request.method !== "POST" || request.url !== "/v1/chat/completions") {
    writeJson(response, 404, { error: { message: "Not found." } });
    return;
  }

  let body = "";
  request.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1024 * 1024) {
      request.destroy();
    }
  });

  request.on("end", async () => {
    const authorization = request.headers.authorization;
    const xApiKey = request.headers["x-api-key"];
    if (!authorization && !xApiKey) {
      writeJson(response, 401, {
        error: {
          message: "Missing Authorization or X-Api-Key header.",
        },
      });
      return;
    }

    // Derive the bare key from whichever header was sent
    const bareKey = xApiKey ?? authorization.replace(/^Bearer\s+/i, "");

    try {
      const upstream = await fetch(REMOTE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${bareKey}`,
          "X-Api-Key": bareKey,
        },
        body,
      });

      const text = await upstream.text();
      response.writeHead(upstream.status, {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        ...CORS_HEADERS,
      });
      response.end(text);
    } catch (error) {
      writeJson(response, 502, {
        error: {
          message: error instanceof Error ? error.message : "Proxy request failed.",
        },
      });
    }
  });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`GenAI proxy listening on http://127.0.0.1:${PORT}`);
});