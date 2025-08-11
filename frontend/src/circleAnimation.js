export const circleAnimation = () => {
  document.querySelectorAll(".circle").forEach((circle) => {
    let isDragging = false;
    let offsetX, offsetY;

    //Quand on clique sur le circle.
    circle.addEventListener("mousedown", (e) => {
      isDragging = true;

      //Met en pause l'animation de base grâce à animationPlayState "runngi" par défaut au "paused".
      circle.style.animationPlayState = "paused";

      //Position du curseur relative au circle
      //getBoundingClientRect()
      // Ce que ça renvoie : un objet DOMRect avec x, y, top, right, bottom, left, width, height.
      // Référence : par rapport à la fenêtre (viewport).
      // top/left peuvent être négatifs (si l’élément est au-dessus/à gauche du viewport).
      // Les valeurs ne tiennent pas compte du scroll de la page directement, car elles sont déjà dans le repère du viewport (qui bouge avec le scroll).
      // Ce qui est mesuré : la boîte de bordure (border-box) de l’élément (padding + border, sans margin).
      // Transformations CSS : les valeurs incluent les transforms (scale, rotate, etc.). Donc un élément agrandi/rotaté aura un rectangle englobant différent.
      // Sous-pixels : renvoie des décimaux (peut ne pas s’aligner exactement sur des pixels).
      // Performance : appeler BCR peut forcer un recalcul de layout si le style vient de changer. Évite d’appeler ça en boucle sans nécessité.

      const rect = circle.getBoundingClientRect();
      //distance en px depuis le bord haut gauche visible de la fenêtre.
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      //Met le circle au dessu de tous les autres éléments.
      circle.style.zIndex = 1000;
    });

    //Lors du déplacment de la souris
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      const left = e.clientX - offsetX;
      const top = e.clientY - offsetY;

      circle.style.left = `${left}px`;
      circle.style.top = `${top}px`;
    });

    //Lors du relâchement du clic
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;

      //Reprendre l'animation de base
      circle.style.animationPlayState = "running";

      //Rétablir le z-index
      circle.style.zIndex = 0;
    });
  });
};
