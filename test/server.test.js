const { describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");

const BASE = "http://localhost:3000";

function httpGet(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`${BASE}${urlPath}`, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
      res.on("error", reject);
    });
  });
}

function httpPost(urlPath) {
  return new Promise((resolve, reject) => {
    const req = http.request(`${BASE}${urlPath}`, { method: "POST", headers: { "Content-Type": "application/json" } }, (res) => {
      let body = "";
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, body }));
      res.on("error", reject);
    });
    req.end();
  });
}

let serverProcess;

describe("Chat server API", () => {
  before(async () => {
    serverProcess = require("child_process").spawn("node", ["server.js"], {
      cwd: process.cwd(),
      stdio: "pipe",
    });
    await new Promise((resolve) => {
      serverProcess.stdout.on("data", (data) => {
        if (data.toString().includes("running")) resolve();
      });
    });
  });

  after(() => {
    serverProcess.kill("SIGTERM");
  });

  it("serves the lobby page at /", async () => {
    const res = await httpGet("/");
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.includes("Experimental Garden"));
  });

  it("POST /api/rooms creates a room", async () => {
    const res = await httpPost("/api/rooms");
    assert.strictEqual(res.status, 200);
    const data = JSON.parse(res.body);
    assert.ok(data.inviteCode);
    assert.strictEqual(data.inviteCode.length, 6);
  });

  it("GET /api/rooms/:code/exists returns true for existing room", async () => {
    const createRes = await httpPost("/api/rooms");
    const { inviteCode } = JSON.parse(createRes.body);
    const res = await httpGet(`/api/rooms/${inviteCode}/exists`);
    const data = JSON.parse(res.body);
    assert.strictEqual(data.exists, true);
  });

  it("GET /api/rooms/:code/exists returns false for unknown room", async () => {
    const res = await httpGet("/api/rooms/zzzzzz/exists");
    const data = JSON.parse(res.body);
    assert.strictEqual(data.exists, false);
  });
});
