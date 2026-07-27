import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const root = path.resolve("out");
const port = Number(process.env.PORT ?? 3000);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff2", "font/woff2"],
  [".zip", "application/zip"],
]);

async function regularFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveRequest(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded.replace(/^\/+/, "");
  const direct = path.resolve(root, relative);

  if (direct !== root && !direct.startsWith(`${root}${path.sep}`)) {
    return undefined;
  }

  if (await regularFile(direct)) {
    return direct;
  }

  const indexFile = path.join(direct, "index.html");
  if (await regularFile(indexFile)) {
    return indexFile;
  }

  return undefined;
}

function sendFile(request, response, filePath, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": contentTypes.get(path.extname(filePath)) ?? "application/octet-stream",
    "Cache-Control": "no-store",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = createReadStream(filePath);
  stream.on("error", () => response.destroy());
  stream.pipe(response);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  try {
    const pathname = new URL(request.url ?? "/", "http://127.0.0.1").pathname;
    const filePath = await resolveRequest(pathname);
    if (filePath) {
      sendFile(request, response, filePath);
      return;
    }

    const notFound = path.join(root, "404.html");
    if (await regularFile(notFound)) {
      sendFile(request, response, notFound, 404);
      return;
    }
  } catch {
    // Fall through to the minimal response for malformed URLs.
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.listen(port, "127.0.0.1");

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
