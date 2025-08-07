/* eslint-disable no-undef */
import cors from "@fastify/cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

fastify.register(fastifyStatic, {
  root: path.join(_dirname, "../frontend"), // <-- dossier contenant style.css
  prefix: "/public/", // accessible via /public/style.css
});

const habitsPath = path.join(process.cwd(), "habits.json");

// Test si le serveur fonctionne
fastify.get("/", async (request, reply) => {
  try {
    const habits = JSON.parse(await fs.readFile(habitsPath, "utf-8")).habits;
    reply.type("text/html").send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Habits</title>
      <link rel="stylesheet" href="/public/style.css" />
    </head>
    <body>
      <div>
        <h1>Habit to make today !</h1>
        <div class="habitsContainer">
          ${habits
            .map(
              (habit) =>
                `<button class="habit-btn" class="green">${habit.title}</button>`
            )
            .join("")}
        </div>
        <div class="optionContainer">
          <button class="add-btn">Add new habit</button>
          <button class="history-btn">See history</button>
        </div>
      </div>
        <script type="module" src="/public/index.js"></script>
    </body>
  </html>
`);
  } catch (error) {
    reply.type("text/html").send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Habits</title>
      <link rel="stylesheet" href="/public/style.css" />
    </head>
    <body>
      <div>
        <h1>Habits task tracker</h1>
        <div>
            <h2>Error: ${error}</h2>
        </div>
      </div>
    </body>
  </html>
`);
  }
});

fastify.get("/api/ping", async (request, reply) => {
  return { message: "pong" };
});

fastify.post("/habits", async (request, reply) => {
  try {
    const newHabit = JSON.parse(
      await fs.writeFile(habitsPath, "utf-8")
    ).newHabit;
    console.log(`Received new habit: ${newHabit}`);
    reply
      .status(201)
      .send({ message: "Item created successfully", data: newHabit });
  } catch (error) {
    console.error("Error creating item:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  // eslint-disable-next-line no-undef
  process.exit(1);
}
