function createAttractionCard(attraction) {
  return `
      <div class="card">
        <h3>${attraction.name}</h3>
        <p>${attraction.description}</p>
        <p><strong>Adresse :</strong> ${attraction.address}</p>
        <p><strong>Horaires d'ouverture :</strong> ${Object.entries(
          attraction.opening_hours
        )
          .map(([day, hours]) => `${day}: ${hours}`)
          .join(", ")}</p>
        <p><strong>Prix :</strong> ${attraction.price}</p>
        <a href="${attraction.website}" target="_blank">Site web</a>
      </div>
    `;
}

// Charger les données JSON et générer les cartes
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    const attractionCards = document.getElementById("attraction-cards");
    data.attractions.forEach((attraction) => {
      attractionCards.innerHTML += createAttractionCard(attraction);
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des attractions:", error)
  );

// Fonction pour créer une carte d'attraction simple
function createAttractionCard(attraction) {
  // Déterminer si l'attraction est ouverte
  const today = new Date();
  const dayNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const currentDay = dayNames[today.getDay()];
  const currentTime = today.getHours() + ":" + today.getMinutes();
  let isOpen = false;

  const hoursToday = attraction.opening_hours[currentDay];
  if (hoursToday !== "Fermé") {
    const [open, close] = hoursToday.split(" - ");
    if (currentTime >= open && currentTime <= close) {
      isOpen = true;
    }
  }

  return `
      <div class="card" data-attraction='${JSON.stringify(attraction)}'>
        <img src="${attraction.image}" alt="${
    attraction.name
  }" style="width:100%; height:50px; object-fit: cover;">
        <h3>${attraction.name}</h3>
        <p>${
          isOpen
            ? '<span style="color: green;">Ouvert</span>'
            : '<span style="color: red;">Fermé</span>'
        }</p>
      </div>
    `;
}

// Fonction pour afficher la modale avec les détails de l'attraction
function showModal(attraction) {
  document.getElementById("modal-title").innerText = attraction.name;
  document.getElementById("modal-image").src = attraction.image;
  document.getElementById("modal-image").alt = attraction.name;
  document.getElementById("modal-description").innerText =
    attraction.description;
  document.getElementById("modal-address").innerText = attraction.address;
  document.getElementById("modal-price").innerText = attraction.price;
  document.getElementById("modal-website").href = attraction.website;

  // Afficher les horaires d'ouverture
  const hoursList = document.getElementById("modal-hours");
  hoursList.innerHTML = "";
  for (const [day, hours] of Object.entries(attraction.opening_hours)) {
    const listItem = document.createElement("li");
    listItem.innerText = `${capitalizeFirstLetter(day)}: ${hours}`;
    hoursList.appendChild(listItem);
  }

  // Afficher la modale
  document.getElementById("modal").style.display = "block";
}

// Fonction pour capitaliser la première lettre
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Charger les données JSON et générer les cartes
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    const attractionCards = document.getElementById("attraction-cards");
    data.attractions.forEach((attraction) => {
      attractionCards.innerHTML += createAttractionCard(attraction);
    });

    // Ajouter les écouteurs d'événements pour ouvrir la modale
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const attraction = JSON.parse(card.getAttribute("data-attraction"));
        showModal(attraction);
      });
    });
  })
  .catch((error) =>
    console.error("Erreur lors du chargement des attractions:", error)
  );

// Gérer la fermeture de la modale
document.querySelector(".close-button").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  // Gérer la fermeture de la modale
  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
  });

  // Fermer la modale en cliquant en dehors du contenu
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("modal");
    // Vérifier si l'élément cliqué est le modal (arrière-plan)
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
