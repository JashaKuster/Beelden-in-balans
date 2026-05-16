const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const BEELDEN_DIR = path.join(ROOT, "beelden");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"]);

const toWebPath = (filePath) => filePath.split(path.sep).join("/");

const readSculptures = () => {
  if (!fs.existsSync(BEELDEN_DIR)) {
    return [];
  }

  const folders = fs
    .readdirSync(BEELDEN_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "nl"));

  return folders
    .map((folderName) => {
      const folderPath = path.join(BEELDEN_DIR, folderName);
      const images = fs
        .readdirSync(folderPath, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((fileName) => imageExtensions.has(path.extname(fileName).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, "nl"))
        .map((fileName) => toWebPath(path.join("/beelden", folderName, fileName)));

      if (!images.length) {
        return null;
      }

      return {
        id: folderName,
        title: folderName
          .replace(/[-_]+/g, " ")
          .trim()
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        images,
      };
    })
    .filter(Boolean);
};

const writeJson = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Niet gevonden");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (requestUrl.pathname === "/api/sculptures") {
    writeJson(res, 200, { sculptures: readSculptures() });
    return;
  }

  let safePath = decodeURIComponent(requestUrl.pathname);
  if (safePath === "/") {
    safePath = "/index.html";
  }

  const normalizedPath = path.normalize(safePath).replace(/^([.][.][/\\])+/, "");
  const absolutePath = path.join(ROOT, normalizedPath);

  if (!absolutePath.startsWith(ROOT)) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Ongeldig pad");
    return;
  }

  serveFile(res, absolutePath);
});

server.listen(PORT, () => {
  console.log(`Server gestart op http://localhost:${PORT}`);
});
