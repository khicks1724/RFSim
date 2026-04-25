const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const { config } = require("./config");
const { query } = require("./db");

const app = express();

app.use(helmet());
app.use(cors({ origin: config.appOrigin, credentials: true }));
app.use(express.json({ limit: "5mb" }));

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

function authRequired(request, response, next) {
  const authorization = request.headers.authorization ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    request.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    response.status(401).json({ error: "Invalid token." });
  }
}

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12),
  fullName: z.string().min(1).max(120)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const projectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  state: z.any().optional().default({})
});

const snapshotSchema = z.object({
  label: z.string().min(1).max(120),
  state: z.any().optional()
});

app.get("/api/health", async (_request, response) => {
  try {
    await query("select 1");
    response.json({ ok: true, database: "reachable" });
  } catch (error) {
    response.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/auth/register", async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password, fullName } = parsed.data;

  try {
    const existing = await query("select id from app_user where email = $1", [email.toLowerCase()]);
    if (existing.rowCount > 0) {
      response.status(409).json({ error: "An account with that email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      "insert into app_user (email, password_hash, full_name) values ($1, $2, $3) returning id, email, full_name",
      [email.toLowerCase(), passwordHash, fullName]
    );
    const user = result.rows[0];
    response.status(201).json({
      token: signToken(user),
      user: { id: user.id, email: user.email, fullName: user.full_name }
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const result = await query(
      "select id, email, full_name, password_hash from app_user where email = $1",
      [email.toLowerCase()]
    );
    if (result.rowCount === 0) {
      response.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const user = result.rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      response.status(401).json({ error: "Invalid email or password." });
      return;
    }

    response.json({
      token: signToken(user),
      user: { id: user.id, email: user.email, fullName: user.full_name }
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, email, full_name from app_user where id = $1",
      [request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "User not found." });
      return;
    }
    const user = result.rows[0];
    response.json({ user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/projects", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, name, description, updated_at from project where owner_user_id = $1 order by updated_at desc",
      [request.user.sub]
    );
    response.json({ projects: result.rows });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", authRequired, async (request, response) => {
  const parsed = projectSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, description, state } = parsed.data;
  try {
    const result = await query(
      "insert into project (owner_user_id, name, description, latest_state_json) values ($1, $2, $3, $4::jsonb) returning id, name, description, latest_state_json, updated_at",
      [request.user.sub, name, description, JSON.stringify(state)]
    );
    response.status(201).json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, name, description, latest_state_json, updated_at from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/projects/:projectId", authRequired, async (request, response) => {
  const parsed = projectSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updates = [];
  const values = [request.params.projectId, request.user.sub];
  let index = values.length;

  if (parsed.data.name !== undefined) {
    index += 1;
    updates.push(`name = $${index}`);
    values.push(parsed.data.name);
  }
  if (parsed.data.description !== undefined) {
    index += 1;
    updates.push(`description = $${index}`);
    values.push(parsed.data.description);
  }
  if (parsed.data.state !== undefined) {
    index += 1;
    updates.push(`latest_state_json = $${index}::jsonb`);
    values.push(JSON.stringify(parsed.data.state));
  }

  updates.push("updated_at = now()");

  try {
    const result = await query(
      `update project set ${updates.join(", ")} where id = $1 and owner_user_id = $2 returning id, name, description, latest_state_json, updated_at`,
      values
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const result = await query(
      "delete from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects/:projectId/duplicate", authRequired, async (request, response) => {
  try {
    const sourceResult = await query(
      "select id, name, description, latest_state_json from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (sourceResult.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }

    const source = sourceResult.rows[0];
    const duplicateResult = await query(
      "insert into project (owner_user_id, name, description, latest_state_json) values ($1, $2, $3, $4::jsonb) returning id, name, description, latest_state_json, updated_at",
      [request.user.sub, `${source.name} Copy`, source.description, JSON.stringify(source.latest_state_json)]
    );
    response.status(201).json({ project: duplicateResult.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:projectId/snapshots", authRequired, async (request, response) => {
  try {
    const result = await query(
      `select snapshot.id, snapshot.label, snapshot.created_at
       from project_snapshot snapshot
       inner join project on project.id = snapshot.project_id
       where snapshot.project_id = $1 and project.owner_user_id = $2
       order by snapshot.created_at desc`,
      [request.params.projectId, request.user.sub]
    );
    response.json({ snapshots: result.rows });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects/:projectId/snapshots", authRequired, async (request, response) => {
  const parsed = snapshotSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const projectResult = await query(
      "select latest_state_json from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (projectResult.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }

    const snapshotState = parsed.data.state ?? projectResult.rows[0].latest_state_json;
    const result = await query(
      "insert into project_snapshot (project_id, label, state_json) values ($1, $2, $3::jsonb) returning id, label, created_at",
      [request.params.projectId, parsed.data.label, JSON.stringify(snapshotState)]
    );
    response.status(201).json({ snapshot: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`EW Sim backend listening on port ${config.port}`);
});