/* eslint-disable no-undef */
import cors from "@fastify/cors";
import fs from "fs/promises";
import formbody from "@fastify/formbody";
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

fastify.register(formbody);

fastify.register(fastifyStatic, {
  root: path.join(_dirname, "../frontend"), // <-- dossier contenant style.css
  prefix: "/public/", // accessible via /public/style.css
});

const habitsPath = path.join(process.cwd(), "habits.json");

// Test si le serveur fonctionne
fastify.get("/", async (request, reply) => {
  try {
    const actualHabits = JSON.parse(
      await fs.readFile(habitsPath, "utf-8")
    ).habits;

    reply.type("text/html").send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Habits</title>
      <link rel="stylesheet" href="/public/style.css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body>
      <div>
        <h1>Habit to make today !</h1>
        <div class="habitsContainer">
        ${actualHabits
          .map(
            (habit) =>
              `
            <div class="habit-btn">
                <i class="fa-solid fa-xmark"></i>
                <p class="habitTitle">${habit.title}</p>
            </div>
            `
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

fastify.get("/api/ping", async () => {
  return { message: "pong" };
});

fastify.post("/", async (request, reply) => {
  try {
    const { title } = request.body;
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const habits = data.habits ?? [];

    const newHabit = {
      id: (habits[habits.length - 1]?.id ?? 0) + 1,
      title,
      dayDone: {},
    };

    habits.push(newHabit);

    await fs.writeFile(habitsPath, JSON.stringify({ habits }, null, 2));
    console.log(`Received new habit: ${newHabit}`);
    reply.redirect("/");
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
