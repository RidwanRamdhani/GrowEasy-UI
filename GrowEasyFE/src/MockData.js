export const HISTORY = [
  {
    id: "H001", date: "2025-11-14", location: "Bogor, West Java",
    cropScore: 82, riskLevel: "Low", soilPH: 6.4, moisture: 68,
    rainfall: "1240 mm/yr", temp: "26°C", nitrogen: 78, phosphorus: 52, potassium: 61,
    recommendation: "Rice, Cassava, Corn",
    aiSummary: "Land conditions strongly support food crop cultivation. Soil nitrogen is optimal and rainfall is consistent year-round. The slightly acidic pH of 6.4 is ideal for rice and corn. Maintain organic mulch to preserve moisture during dry spells.",
    chat: [
      { role: "user", content: "What should I watch out for next planting season?" },
      { role: "ai",   content: "Focus on drainage management during peak rainy season (Jan–Feb). The 68% soil moisture is ideal — maintain it with organic mulch and avoid over-irrigation." },
    ],
  },
  {
    id: "H002", date: "2025-09-03", location: "Bogor, West Java",
    cropScore: 61, riskLevel: "Medium", soilPH: 5.8, moisture: 42,
    rainfall: "980 mm/yr", temp: "28°C", nitrogen: 55, phosphorus: 38, potassium: 47,
    recommendation: "Cassava, Sweet Potato",
    aiSummary: "Soil moisture is below optimal. Moderate drought risk detected. A drip irrigation system is recommended. Cassava and sweet potato are the most resilient choices given current conditions.",
    chat: [
      { role: "user", content: "Is cassava a good fit here?" },
      { role: "ai",   content: "Yes — cassava is highly drought-tolerant and pH 5.8 is still acceptable. Ensure a minimum planting distance of 80 cm for optimal yield." },
    ],
  },
];

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));