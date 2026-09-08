/* =========================================
   HRIA SMART CITY - APP
   ========================================= */


/* =========================================
   1. DEMO DATA
   ========================================= */

const stations = {
  S1: {
    id: "S1",
    name: "Slănic Prahova",
    location: "Slănic Prahova",
    type: "Stație fizică IoT",
    lat: 45.231,
    lon: 25.945,
    temperature: 19.8,
    humidity: 67,
    pm25: 16.4,
    pm10: 28.2,
    status: "online",
    transmission: "MQTT"
  },

   S2: {
     id: "S2",
     name: "BEIA Consult International",
     location: "Strada Peroni 16, București",
     type: "Stație fizică IoT",
     lat: 48.39,
     lon: 26.10,
     temperature: 24.1,
     humidity: 54,
     pm25: 22.7,
     pm10: 37.9,
     status: "online",
     transmission: "MQTT"
   },

  V1: {
    id: "V1",
    name: "Stație virtuală",
    location: "Locație experimentală",
    type: "Stație virtuală AI",
    lat: 44.85,
    lon: 26.01,
    temperature: 21.9,
    humidity: 60,
    pm25: 19.5,
    pm10: 33.0,
    status: "estimated",
    transmission: "AI estimation"
  }
};


/* =========================================
   2. MAP INITIALIZATION
   ========================================= */

const map = L.map("map").setView(
  [44.85, 26.00],
  8
);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }
).addTo(map);


/* =========================================
   3. CUSTOM MARKERS
   ========================================= */

function createMarkerIcon(color) {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: ${color};
          border: 4px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
        "
      ></div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}


function createLabeledMarkerIcon(label, color) {
  return L.divIcon({
    className: "",
    html: `
      <div
        style="
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${color};
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-weight: 800;
          font-size: 11px;
        "
      >
        ${label}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
}


const physicalIconS1 = createLabeledMarkerIcon(
  "S1",
  "#27ae60"
);

const physicalIconS2 = createLabeledMarkerIcon(
  "S2",
  "#27ae60"
);

const virtualIcon = createLabeledMarkerIcon(
  "V1",
  "#2f80ed"
);


/* =========================================
   4. ADD MAP MARKERS
   ========================================= */

const markers = {};

Object.values(stations).forEach((station) => {

  let icon;

  if (station.id === "S1") {
    icon = physicalIconS1;
  } else if (station.id === "S2") {
    icon = physicalIconS2;
  } else {
    icon = virtualIcon;
  }

  const marker = L.marker(
    [station.lat, station.lon],
    { icon: icon }
  ).addTo(map);

  marker.bindPopup(`
    <strong>${station.id} – ${station.name}</strong>
    <br><br>
    ${station.location}
    <br>
    Temperatură: ${station.temperature} °C
    <br>
    PM2.5: ${station.pm25} µg/m³
    <br>
    PM10: ${station.pm10} µg/m³
  `);

  marker.on("click", () => {
    selectStation(station.id);
  });

  markers[station.id] = marker;
});


/* =========================================
   5. SELECT STATION
   ========================================= */

let selectedStation = "S1";

function selectStation(stationId) {

  selectedStation = stationId;

  const station = stations[stationId];

  document.getElementById(
    "selected-station-name"
  ).textContent =
    `${station.id} – ${station.name}`;

  document.getElementById(
    "temperature"
  ).textContent =
    station.temperature;

  document.getElementById(
    "humidity"
  ).textContent =
    station.humidity;

  document.getElementById(
    "pm25"
  ).textContent =
    station.pm25;

  document.getElementById(
    "pm10"
  ).textContent =
    station.pm10;

  document.getElementById(
    "station-location"
  ).textContent =
    station.location;

  document.getElementById(
    "station-type"
  ).textContent =
    station.type;

  document.getElementById(
    "last-update"
  ).textContent =
    new Date().toLocaleString("ro-RO");


  const statusElement =
    document.getElementById("station-status");

  if (station.id === "V1") {

    statusElement.textContent =
      "Estimat";

    statusElement.style.background =
      "#edf5ff";

    statusElement.style.color =
      "#2f80ed";

  } else {

    statusElement.textContent =
      "Online";

    statusElement.style.background =
      "#eaf8ef";

    statusElement.style.color =
      "#237446";
  }


  if (
    document.getElementById(
      "history-station"
    ) &&
    station.id !== "V1"
  ) {
    document.getElementById(
      "history-station"
    ).value = station.id;
  }

  updateHistoryChart();
}


/* =========================================
   6. STATION CARDS CLICK
   ========================================= */

document
  .querySelectorAll(
    ".station-overview-card"
  )
  .forEach((card) => {

    card.addEventListener(
      "click",
      () => {

        const stationId =
          card.dataset.station;

        selectStation(stationId);

        const station =
          stations[stationId];

        map.setView(
          [station.lat, station.lon],
          stationId === "V1"
            ? 9
            : 11
        );

        markers[
          stationId
        ].openPopup();

        window.scrollTo({
          top:
            document
              .getElementById(
                "overview"
              )
              .offsetTop - 80,
          behavior: "smooth"
        });
      }
    );

  });


/* =========================================
   7. HISTORY DATA GENERATION
   ========================================= */

function generateHistoryData(
  stationId,
  parameter,
  points
) {

  const station =
    stations[stationId];

  let baseValue =
    station[parameter];

  const values = [];

  for (
    let i = 0;
    i < points;
    i++
  ) {

    const variation =
      Math.sin(i / 3) * 2 +
      (Math.random() - 0.5) * 3;

    let value =
      baseValue + variation;

    if (
      parameter ===
      "humidity"
    ) {
      value =
        Math.max(
          20,
          Math.min(
            100,
            value
          )
        );
    }

    values.push(
      Number(
        value.toFixed(1)
      )
    );
  }

  return values;
}


/* =========================================
   8. CHART LABELS
   ========================================= */

function generate24HourLabels() {

  const labels = [];

  const now =
    new Date();

  for (
    let i = 23;
    i >= 0;
    i--
  ) {

    const date =
      new Date(
        now.getTime() -
        i * 60 * 60 * 1000
      );

    labels.push(
      date.toLocaleTimeString(
        "ro-RO",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      )
    );
  }

  return labels;
}


function generate7DayLabels() {

  const labels = [];

  const now =
    new Date();

  for (
    let i = 6;
    i >= 0;
    i--
  ) {

    const date =
      new Date(
        now.getTime() -
        i * 24 * 60 * 60 * 1000
      );

    labels.push(
      date.toLocaleDateString(
        "ro-RO",
        {
          day: "2-digit",
          month: "short"
        }
      )
    );
  }

  return labels;
}


/* =========================================
   9. HISTORY CHART
   ========================================= */

const historyCanvas =
  document.getElementById(
    "historyChart"
  );

let historyChart =
  new Chart(
    historyCanvas,
    {
      type: "line",

      data: {
        labels: [],
        datasets: [
          {
            label:
              "Date istorice",

            data: [],

            borderColor:
              "#0ea5a8",

            backgroundColor:
              "rgba(14,165,168,0.10)",

            borderWidth: 2,

            tension: 0.35,

            pointRadius: 2,

            fill: true
          }
        ]
      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        interaction: {
          intersect: false,
          mode: "index"
        },

        plugins: {

          legend: {
            display: false
          },

          tooltip: {
            enabled: true
          }

        },

        scales: {

          x: {

            grid: {
              display: false
            }

          },

          y: {

            beginAtZero:
              false,

            grid: {
              color:
                "rgba(0,0,0,0.05)"
            }

          }

        }

      }
    }
  );


/* =========================================
   10. HISTORY CHART UPDATE
   ========================================= */

function getParameterLabel(
  parameter
) {

  const labels = {
    pm25: "PM2.5",
    pm10: "PM10",
    temperature: "Temperatură",
    humidity: "Umiditate"
  };

  return labels[
    parameter
  ];
}


function updateHistoryChart() {

  const stationId =
    document.getElementById(
      "history-station"
    ).value;

  const parameter =
    document.getElementById(
      "history-parameter"
    ).value;

  const period =
    document.getElementById(
      "history-period"
    ).value;


  let labels;
  let data;


  if (period === "24") {

    labels =
      generate24HourLabels();

    data =
      generateHistoryData(
        stationId,
        parameter,
        24
      );

  } else {

    labels =
      generate7DayLabels();

    data =
      generateHistoryData(
        stationId,
        parameter,
        7
      );
  }


  historyChart.data.labels =
    labels;

  historyChart.data.datasets[0]
    .data =
    data;

  historyChart.data.datasets[0]
    .label =
    `${getParameterLabel(parameter)} – ${stations[stationId].name}`;

  historyChart.update();
}


/* =========================================
   11. HISTORY EVENTS
   ========================================= */

document
  .getElementById(
    "history-station"
  )
  .addEventListener(
    "change",
    updateHistoryChart
  );

document
  .getElementById(
    "history-parameter"
  )
  .addEventListener(
    "change",
    updateHistoryChart
  );

document
  .getElementById(
    "history-period"
  )
  .addEventListener(
    "change",
    updateHistoryChart
  );


/* =========================================
   12. PREDICTION CHART
   ========================================= */

const predictionCanvas =
  document.getElementById(
    "predictionChart"
  );


let predictionChart =
  new Chart(
    predictionCanvas,
    {

      type: "line",

      data: {

        labels: [],

        datasets: [

          {
            label:
              "Predicție AI",

            data: [],

            borderColor:
              "#2f80ed",

            backgroundColor:
              "rgba(47,128,237,0.12)",

            borderWidth: 2,

            tension: 0.4,

            pointRadius: 2,

            fill: true
          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio:
          false,

        plugins: {

          legend: {
            display: false
          }

        },

        scales: {

          x: {

            grid: {
              display: false
            }

          },

          y: {

            beginAtZero:
              false,

            grid: {
              color:
                "rgba(0,0,0,0.05)"
            }

          }

        }

      }

    }
  );


/* =========================================
   13. PREDICTION DATA
   ========================================= */

function generatePredictionData(
  stationId,
  parameter
) {

  const station =
    stations[stationId];

  let baseValue =
    station[parameter];

  const values = [];

  for (
    let i = 0;
    i < 24;
    i++
  ) {

    let trend;

    if (
      parameter ===
      "temperature"
    ) {

      trend =
        Math.sin(
          (i - 6) /
          24 *
          Math.PI *
          2
        ) * 4;

    } else {

      trend =
        Math.sin(
          i /
          5
        ) * 3;
    }

    const noise =
      (Math.random() - 0.5)
      * 1.8;

    const value =
      baseValue +
      trend +
      noise;

    values.push(
      Number(
        value.toFixed(1)
      )
    );

  }

  return values;
}


function generateFutureLabels() {

  const labels = [];

  const now =
    new Date();

  for (
    let i = 1;
    i <= 24;
    i++
  ) {

    const date =
      new Date(
        now.getTime() +
        i *
        60 *
        60 *
        1000
      );

    labels.push(
      date.toLocaleTimeString(
        "ro-RO",
        {
          hour:
            "2-digit",
          minute:
            "2-digit"
        }
      )
    );

  }

  return labels;
}


/* =========================================
   14. GENERATE PREDICTION
   ========================================= */

function generatePrediction() {

  const stationId =
    document.getElementById(
      "prediction-station"
    ).value;

  const parameter =
    document.getElementById(
      "prediction-parameter"
    ).value;

  const labels =
    generateFutureLabels();

  const data =
    generatePredictionData(
      stationId,
      parameter
    );


  predictionChart.data.labels =
    labels;

  predictionChart.data.datasets[0]
    .data =
    data;

  predictionChart.data.datasets[0]
    .label =
    `${getParameterLabel(parameter)} – ${stations[stationId].name}`;

  predictionChart.update();
}


document
  .getElementById(
    "generate-prediction"
  )
  .addEventListener(
    "click",
    generatePrediction
  );


/* =========================================
   15. CHATBOT
   ========================================= */

function addChatMessage(
  sender,
  text
) {

  const container =
    document.getElementById(
      "chat-messages"
    );

  const message =
    document.createElement(
      "div"
    );

  message.className =
    sender === "user"
      ? "message user-message"
      : "message assistant-message";

  message.innerHTML = `
    <strong>
      ${
        sender === "user"
          ? "Tu"
          : "Asistent"
      }
    </strong>
    <p>${text}</p>
  `;

  container.appendChild(
    message
  );

  container.scrollTop =
    container.scrollHeight;
}


/* =========================================
   16. SIMPLE ASSISTANT LOGIC
   ========================================= */

function getAssistantResponse(
  question
) {

  const q =
    question.toLowerCase();


  if (
    q.includes("compar") &&
    q.includes("pm2")
  ) {

    return `
      În acest moment,
      stația din Slănic înregistrează
      ${stations.S1.pm25} µg/m³ PM2.5,
      iar stația BEIA din București
      ${stations.S2.pm25} µg/m³.
      Valoarea mai ridicată este înregistrată
      în București.
    `;
  }


  if (
    q.includes("cel mai mare") &&
    q.includes("pm2")
  ) {

    const highest =
      stations.S1.pm25 >
      stations.S2.pm25
        ? stations.S1
        : stations.S2;

    return `
      Stația cu cea mai mare valoare
      PM2.5 este ${highest.name},
      cu ${highest.pm25} µg/m³.
    `;
  }


  if (
    q.includes("slănic") ||
    q.includes("slanic")
  ) {

    return `
      La stația din Slănic Prahova,
      temperatura este ${stations.S1.temperature} °C,
      umiditatea ${stations.S1.humidity}%,
      PM2.5 este ${stations.S1.pm25} µg/m³,
      iar PM10 este ${stations.S1.pm10} µg/m³.
    `;
  }


  if (
    q.includes("bucure") ||
    q.includes("beia")
  ) {

    return `
      La stația BEIA Consult International
      din București,
      temperatura este ${stations.S2.temperature} °C,
      umiditatea ${stations.S2.humidity}%,
      PM2.5 este ${stations.S2.pm25} µg/m³,
      iar PM10 este ${stations.S2.pm10} µg/m³.
    `;
  }


  if (
    q.includes("prognoz") ||
    q.includes("mâine") ||
    q.includes("maine")
  ) {

    return `
      Modul experimental estimează
      evoluția parametrilor pentru următoarele
      24 de ore pe baza datelor istorice.
      Poți genera o predicție din secțiunea
      „Predicții”.
    `;
  }


  if (
    q.includes("calitatea aerului")
  ) {

    return `
      Valorile curente indică
      PM2.5 de ${stations.S1.pm25} µg/m³
      în Slănic și ${stations.S2.pm25} µg/m³
      în București.
      Pentru această versiune demonstrativă,
      interpretarea este orientativă.
    `;
  }


  if (
    q.includes("temperatur")
  ) {

    return `
      Temperatura curentă este
      ${stations.S1.temperature} °C
      în Slănic și
      ${stations.S2.temperature} °C
      la stația BEIA din București.
    `;
  }


  return `
    În această versiune demonstrativă
    pot răspunde la întrebări despre
    temperatură, PM2.5, PM10,
    stațiile din Slănic și București
    și modulul experimental de predicție.
  `;
}


/* =========================================
   17. SEND CHAT MESSAGE
   ========================================= */

function sendMessage() {

  const input =
    document.getElementById(
      "chat-input"
    );

  const question =
    input.value.trim();

  if (!question) {
    return;
  }

  addChatMessage(
    "user",
    question
  );

  input.value = "";

  setTimeout(
    () => {

      const response =
        getAssistantResponse(
          question
        );

      addChatMessage(
        "assistant",
        response
      );

    },
    350
  );
}


document
  .getElementById(
    "send-message"
  )
  .addEventListener(
    "click",
    sendMessage
  );


document
  .getElementById(
    "chat-input"
  )
  .addEventListener(
    "keydown",
    (event) => {

      if (
        event.key ===
        "Enter"
      ) {
        sendMessage();
      }

    }
  );


/* =========================================
   18. QUICK QUESTIONS
   ========================================= */

document
  .querySelectorAll(
    ".quick-questions button"
  )
  .forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          const question =
            button.dataset.question;

          addChatMessage(
            "user",
            question
          );

          setTimeout(
            () => {

              addChatMessage(
                "assistant",
                getAssistantResponse(
                  question
                )
              );

            },
            300
          );

        }
      );

    }
  );


/* =========================================
   19. INITIALIZE PLATFORM
   ========================================= */

selectStation("S1");

updateHistoryChart();

generatePrediction();
