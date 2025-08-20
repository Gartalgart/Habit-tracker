/* eslint-disable no-undef */
// --- Imports de modules (ESM) -----------------------------------------------
// @fastify/cors : middleware CORS pour autoriser des requêtes cross-origin
import cors from "@fastify/cors";
// fs/promises : API fichiers en mode Promises (readFile, writeFile, etc.)
import fs from "fs/promises";
// @fastify/formbody : parse les corps de requête application/x-www-form-urlencoded
import formbody from "@fastify/formbody";
// path / url : utilitaires Node pour manipuler chemins et URL de modules ESM
import path from "path";
import { fileURLToPath } from "url";
// Fastify : serveur HTTP rapide et minimaliste
import Fastify from "fastify";
// @fastify/static : sert des fichiers statiques (CSS, JS, images…)
import fastifyStatic from "@fastify/static";

// --- Instanciation du serveur Fastify ---------------------------------------
const fastify = Fastify({
  // logger: true permet d'avoir des logs HTTP et des erreurs détaillées en console
  logger: true,
});

// --- Middlewares / plugins globaux ------------------------------------------
// Active CORS pour toutes les origines (utile en dev ou si front séparé)
await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
});

// __filename / __dirname n’existent pas en ESM → on les reconstitue
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Parse les formulaires (POST) encodés en x-www-form-urlencoded (ex: <form method="POST">)
fastify.register(formbody);

// Sert le dossier "frontend" en statique sous le préfixe /public
// → /public/style.css, /public/index.js, /public/src/newHabits.js, etc.
fastify.register(fastifyStatic, {
  root: path.join(_dirname, "../frontend"), // dossier source
  prefix: "/public/", // URL publique
});

// Chemin du fichier JSON persistant côté serveur (base “fichier”)
const habitsPath = path.join(process.cwd(), "habits.json");

// --- Routes HTTP -------------------------------------------------------------

// GET / → sert une page HTML “SSR” minimale construite ici même
fastify.get("/", async (request, reply) => {
  try {
    // Lit le JSON, parse et récupère la liste d’habitudes
    const fileRaw = await fs.readFile(habitsPath, "utf-8");
    const actualHabits = JSON.parse(fileRaw).habits;

    // Construit et renvoie une page HTML avec la liste
    reply.type("text/html") // Content-Type: text/html
      .send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Habits</title>
      <!-- CSS local servi par fastify-static -->
      <link rel="stylesheet" href="/public/style.css">
      <!-- Font Awesome depuis CDN (icônes) -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

    </head>
    <body>
      <div>
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
        <div class="circle circle-4"></div>
        <div class="circle circle-5"></div>
        <div class="circle circle-6"></div>
        <h1>Habit to make today !</h1>
        <h1 id="login">LOGIN</h1>
        <div class="habitsContainer">
          ${actualHabits
            .map(
              (habit) => `
            <div class="habit-btn" data-id="${habit.id}">
              <i class="fa-solid fa-xmark"></i>
              <p class="habitTitle">${habit.title}</p>
            </div>`
            )
            .join("")}
        </div>

        <div class="optionContainer">
          <button class="add-btn">Add new habit</button>
          <button class="history-btn">See history</button>
        </div>
      </div>

      <!-- Script front principal en ES Modules -->
      <script type="module" src="/public/index.js"></script>
    </body>
  </html>
`);
  } catch (error) {
    // En cas d’erreur (fichier manquant, JSON invalide, etc.), on renvoie une page simple
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

// Petitesse route de test API (utile pour vérifier que le serveur répond)
fastify.get("/api/ping", async () => {
  return { message: "pong" };
});

// POST / → création d’une nouvelle habitude depuis un <form method="POST">
fastify.post("/", async (request, reply) => {
  try {
    // Récupère le champ "title" envoyé par le formulaire
    const { title } = request.body;

    // Lit le fichier JSON existant (ou initialise si besoin)
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const habits = data.habits ?? [];

    // Calcule un nouvel ID auto-incrémenté
    const newHabit = {
      id: (habits[habits.length - 1]?.id ?? 0) + 1,
      title,
      dayDone: {}, // structure prévue pour marquer des journées faites plus tard
    };

    // Ajoute et sauvegarde
    habits.push(newHabit);
    await fs.writeFile(habitsPath, JSON.stringify({ habits }, null, 2));

    // Log serveur (debug)
    console.log(`Received new habit: ${JSON.stringify(newHabit)}`);

    // Redirige vers la page d’accueil pour voir la liste mise à jour
    reply.redirect("/");
  } catch (error) {
    // En cas d’erreur serveur
    console.error("Error creating item:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// DELETE /habits/:id → suppression d’une habitude par identifiant
fastify.delete("/habits/:id", async (request, reply) => {
  try {
    // Récupère l’ID depuis l’URL et le convertit en nombre
    const id = Number(request.params.id);

    // Charge le JSON actuel
    const data = JSON.parse(await fs.readFile(habitsPath, "utf-8"));
    const before = data.habits.length;

    // Filtre tout sauf l’ID ciblé
    data.habits = data.habits.filter((h) => h.id !== id);

    // Si aucune suppression n’a eu lieu, l’ID n’existait pas → 404
    if (data.habits.length === before) {
      return reply.code(404).send({ error: "Habit not found" });
    }

    // Sauvegarde la nouvelle liste sans l’élément supprimé
    await fs.writeFile(habitsPath, JSON.stringify(data, null, 2));

    // 204 No Content : succès sans corps de réponse
    return reply.code(204).send();
  } catch (error) {
    // Log côté serveur + 500
    request.log.error(error);
    return reply.code(500).send({ error: "Internal Server Error" });
  }
});

// --- Démarrage du serveur ----------------------------------------------------
// Écoute sur le port 3000
try {
  // Astuce: si tu veux accéder depuis un autre appareil du réseau local,
  // utilise { port: 3000, host: "0.0.0.0" }
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  // Quitte le process si le serveur ne démarre pas
  process.exit(1);
}
