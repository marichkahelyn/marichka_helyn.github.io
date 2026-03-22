async function loadTours() {
  const container = document.getElementById("tour-list");
  if (!container) return;

  try {
    const response = await fetch("tours.json");
    const tours = await response.json();

    container.innerHTML = "";
    let i = 0;
    while (i < 15) {
      const tour = tours[i];
      const card = document.createElement("article");
      card.className = "tour-card";
      card.id = `tour-${tour.id}`;
      card.innerHTML = `
                <div class="card-img" style="background-image: url('${tour.img}')"></div>
                <div class="card-info">
                    <h3>${tour.title}</h3>
                    <p class="price">$${tour.price}</p>
                    <button class="buy-btn" onclick="bookTour('${tour.id}')">Забронювати тур</button>
                </div>
            `;
      container.appendChild(card);
      i++;
    }
  } catch (error) {
    console.error("Помилка завантаження JSON:", error);
  }
}

async function bookTour(tourId) {
  const response = await fetch("tours.json");
  const tours = await response.json();
  const selectedTour = tours.find((t) => String(t.id) === String(tourId));

  if (!selectedTour) return;

  const card = document.getElementById(`tour-${tourId}`);
  if (card) {
    card.style.transform = "scale(1.05)";
    card.style.boxShadow = "0 0 20px #ffd700";
    card.style.borderColor = "#ffd700";
  }

  let bookings = JSON.parse(localStorage.getItem("myBookings")) || [];
  if (bookings.some((b) => String(b.id) === String(tourId))) {
    alert("Цей тур вже є у ваших бронюваннях!");
    return;
  }

  bookings.push(selectedTour);
  localStorage.setItem("myBookings", JSON.stringify(bookings));
  alert(`Тур до міста ${selectedTour.title} додано!`);
}

function displayBookings() {
  return;
  const container = document.getElementById("booking-list");
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem("myBookings")) || [];

  if (saved.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: white; opacity: 0.6; margin-top: 50px;">Ви ще не обрали жодного туру...</p>';
    return;
  }

  container.innerHTML = "";
  saved.forEach((item) => {
    const div = document.createElement("div");
    div.className = "booking-card";
    div.innerHTML = `
            <div class="booking-header">
                <span class="status-done">Підтверджено</span>
                <span class="order-id">ID: ${item.id}</span>
            </div>
            <div class="booking-body">
                <h3>${item.title}</h3>
                <p><strong>Дата вильоту:</strong> ${item.departure || "Уточнюється"}</p>
                <p><strong>Готель:</strong> ${item.hotel || "Стандарт 4*"}</p>
                <p><strong>Оплата:</strong> $${item.price}</p>
            </div>
            <button class="remove-btn" onclick="removeBooking('${item.id}')" style="color: #ff4b2b; cursor: pointer; background: none; border: none; margin-top: 10px; font-weight: bold;">Видалити</button>
        `;
    container.appendChild(div);
  });
}

function removeBooking(id) {
  let bookings = JSON.parse(localStorage.getItem("myBookings")) || [];
  bookings = bookings.filter((b) => String(b.id) !== String(id));
  localStorage.setItem("myBookings", JSON.stringify(bookings));
  displayBookings();
}

function initMap() {
  const mapContainer = document.getElementById("tour-map");
  if (!mapContainer) return;

  const map = L.map('tour-map').setView([50.0, 10.0], 4);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const points = [
    {
      name: "Лондон, Велика Британія",
      lat: 51.5074, lng: -0.1278,
      img: "images/London.webp",
      info: "Столиця Великої Британії: Біг-Бен та затишні паби."
    },
    {
      name: "Париж, Франція",
      lat: 48.8566, lng: 2.3522,
      img: "images/Paris.webp",
      info: "Місто вогнів: Ейфелева вежа та Лувр."
    },
    {
      name: "Берлін, Німеччина",
      lat: 52.5200, lng: 13.4050,
      img: "images/Berlin.webp",
      info: "Бранденбурзькі ворота та сучасний ритм."
    },
    {
      name: "Рим, Італія",
      lat: 41.9028, lng: 12.4964,
      img: "images/Rome.webp",
      info: "Вічне місто: величний Колізей."
    }
  ];

 
  points.forEach(point => {
    const customIcon = L.divIcon({
      className: 'map-marker',
      iconSize: [15, 15]
    });

    const marker = L.marker([point.lat, point.lng], { icon: customIcon }).addTo(map);

    const tooltip = document.getElementById("map-tooltip");
    const title = document.getElementById("tooltip-title");
    const desc = document.getElementById("tooltip-desc");
    const img = document.getElementById("tooltip-img");

    marker.on('mouseover', function () {
      tooltip.style.display = "block";
      title.innerText = point.name;
      desc.innerText = point.info;
      if (img) {
        img.src = point.img;
        img.style.display = "block";
      }
    });

    marker.on('click', function () {
      map.flyTo([point.lat, point.lng], 6);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTours();
  initMap();
  displayBookings();
});
