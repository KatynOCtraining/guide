// script.js

document.addEventListener("DOMContentLoaded", () => {
  const attractionCardsContainer = document.getElementById("attraction-cards");
  const navButtons = document.querySelectorAll(".nav-btn");
  let attractionsData = [];

  // Fonction pour charger les données depuis data.json
  const loadAttractions = async () => {
    try {
      const response = await fetch("./data.json");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      const data = await response.json();
      console.log("Données chargées :", data); // Log des données

      // Vérifier si data.attractions est un tableau
      if (!Array.isArray(data.attractions)) {
        throw new TypeError(
          "Les données chargées ne contiennent pas un tableau d'attractions."
        );
      }

      attractionsData = data.attractions;
      displayAttractions(attractionsData);
    } catch (error) {
      console.error(error);
      attractionCardsContainer.innerHTML =
        "<p>Impossible de charger les attractions.</p>";
    }
  };

  // Fonction pour afficher les attractions
  const displayAttractions = (data) => {
    console.log("Affichage des attractions :", data); // Log des données à afficher

    attractionCardsContainer.innerHTML = ""; // Vider les cartes existantes

    if (data.length === 0) {
      attractionCardsContainer.innerHTML =
        "<p>Aucune attraction trouvée pour cette catégorie.</p>";
      return;
    }

    data.forEach((attraction) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-category", attraction.category); // Ajout de l'attribut de catégorie

      card.innerHTML = `
        <img src="${attraction.image}" alt="${attraction.name}" />
        <h3>${attraction.name}</h3>
        <p>${attraction.description}</p>
      `;

      // Ajouter un événement pour ouvrir la modale avec les détails
      card.addEventListener("click", () => openModal(attraction));

      attractionCardsContainer.appendChild(card);
    });
  };

  // Fonction pour ouvrir la modale avec les détails de l'attraction
  const openModal = (attraction) => {
    const modal = document.getElementById("modal");
    modal.style.display = "block";

    document.getElementById("modal-title").textContent = attraction.name;
    document.getElementById("modal-image").src = attraction.image;
    document.getElementById("modal-image").alt = attraction.name;
    document.getElementById("modal-description").textContent =
      attraction.description;
    document.getElementById("modal-address").textContent = attraction.address;
    document.getElementById("modal-price").textContent = attraction.price;
    document.getElementById("modal-website").href = attraction.website;

    // Remplir les horaires d'ouverture
    const hoursList = document.getElementById("modal-hours");
    hoursList.innerHTML = "";

    // Convertir l'objet opening_hours en tableau pour itération
    const openingHours = attraction.opening_hours;
    for (const [day, hours] of Object.entries(openingHours)) {
      const li = document.createElement("li");
      li.textContent = `${capitalizeFirstLetter(day)}: ${hours}`;
      hoursList.appendChild(li);
    }
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  };

  // Ajouter l'événement pour fermer la modale
  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", closeModal);

  // Fermer la modale en cliquant en dehors du contenu
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
      closeModal();
    }
  });

  // Fonction pour filtrer les attractions
  const filterAttractions = (category) => {
    if (category === "Tout voir") {
      displayAttractions(attractionsData);
    } else {
      const filteredData = attractionsData.filter(
        (attraction) => attraction.category === category
      );
      displayAttractions(filteredData);
    }

    // Gérer les classes actives
    navButtons.forEach((button) => {
      if (button.textContent.trim() === category) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  // Ajouter des écouteurs d'événements aux boutons de navigation
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.textContent.trim();
      filterAttractions(category);
    });
  });

  // Fonction pour capitaliser la première lettre (utilisée pour les jours)
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Charger les attractions au démarrage
  loadAttractions();
});
