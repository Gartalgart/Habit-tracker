import { newHabit } from "./src/newHabits.js";
import confetti from "./libs/confetti.mjs";

// On attend que tout le DOM (HTML) soit chargé avant d'exécuter le code.
// "DOMContentLoaded" = l'événement se déclenche une fois que le HTML est complètement interprété,
// sans attendre le chargement complet des images et autres ressources.
document.addEventListener("DOMContentLoaded", () => {
  const habitBtn = document.querySelectorAll(".habit-btn");
  const container = document.querySelector(".habitsContainer");
  const addHabitBtn = document.querySelector(".add-btn");

  // Parcours de chaque carte d'habitude (chaque élément .habit-btn)
  habitBtn.forEach((btn) => {
    const p = btn.querySelector(".habitTitle");

    // Détermine le titre de base :
    // - Si l'attribut data-title est présent → on l'utilise
    // - Sinon, on prend le texte contenu dans le <p> et on supprime les espaces autour (.trim())
    const baseTitle = p.dataset.title || p.textContent.trim();

    // Affichage initial :
    // - Ajoute ✔️ si la carte a déjà la classe .green
    // - Sinon, ajoute ❌
    p.textContent = `${baseTitle} ${
      btn.classList.contains("green") ? "✔️" : "❌"
    }`;

    // Ajoute un écouteur de clic sur la carte entière
    btn.addEventListener("click", (e) => {
      // Si le clic vient d'un élément ou parent avec la classe .fa-xmark (icône de suppression),
      // on arrête ici (return) pour ne pas déclencher le changement ✔️/❌
      if (e.target.closest(".fa-xmark")) return;

      // On "toggle" (= ajouter ou enlever) la classe .green sur la carte
      btn.classList.toggle("green");

      // On met à jour le texte du <p> avec ✔️ ou ❌ en fonction de l'état actuel
      p.textContent = `${baseTitle} ${
        btn.classList.contains("green") ? "✔️" : "❌"
      }`;
    });
  });

  // Écouteur sur le conteneur global (habitsContainer) → technique appelée "event delegation"
  // L'idée : on écoute les clics sur le parent, puis on vérifie si le clic vient d'une icône ❌.
  // Avantage : même si on ajoute une nouvelle habitude plus tard, cet écouteur fonctionnera.
  container.addEventListener("click", async (e) => {
    // On cherche si l'élément cliqué (e.target) ou un de ses parents a la classe .fa-xmark
    const closeIcon = e.target.closest(".fa-xmark");
    if (!closeIcon) return; // Si ce n'est pas un clic sur un ❌, on sort

    // Empêche la propagation du clic au parent .habit-btn
    // (sinon le clic sur ❌ déclencherait aussi le toggle ✔️/❌)
    e.stopPropagation();

    // Trouve la carte (.habit-btn) la plus proche de l'icône cliquée
    const card = closeIcon.closest(".habit-btn");

    // Récupère l'ID de l'habitude (data-id) et le transforme en nombre
    const id = Number(card?.dataset.id);
    if (!id) return; // Si pas d'ID, on ne fait rien

    try {
      // Envoie une requête DELETE au serveur pour supprimer l'habitude
      // `/habits/${id}` → URL avec l'ID de l'habitude
      const res = await fetch(`/habits/${id}`, { method: "DELETE" });

      // Si la suppression échoue (status ≠ 200 ou 204), on affiche un message d'erreur
      if (!res.ok && res.status !== 204) {
        const msg = await res.text();
        console.error("Delete failed:", msg);
        return;
      }

      // Si la suppression côté serveur réussit :
      // On supprime aussi la carte visuellement du DOM
      card.remove();
      console.log("Habit deleted:", id);

      if (container.children.length === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      // Si problème réseau ou autre erreur lors du fetch
      console.error("Network error during delete:", err);
    }
  });

  // Quand on clique sur "Add new habit", on exécute la fonction importée newHabit()
  addHabitBtn.addEventListener("click", () => {
    console.log("click");
    newHabit(); // Affiche le formulaire pour ajouter une nouvelle habitude
  });
});
