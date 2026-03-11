export function formatCropName(name = "") {
  return name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}
export function deriveScore(probability = 0) {
  const cropScore = Math.round(probability * 100);
  const riskLevel = cropScore >= 70 ? "High" : cropScore >= 45 ? "Medium" : "Low";
  return { cropScore, riskLevel };
}
export function parseWeather(weatherData = {}) {
  try {
    const avg = arr => arr?.length ? arr.reduce((s, v) => s + (v ?? 0), 0) / arr.length : 0;
    return {
      temperature: +avg(weatherData?.daily?.temperature_2m_mean).toFixed(1),
      rainfall:    +avg(weatherData?.daily?.precipitation_sum).toFixed(1),
      humidity:    +avg(weatherData?.hourly?.relative_humidity_2m).toFixed(1),
    };
  } catch { return { temperature: 25, rainfall: 103, humidity: 71 }; }
}
export function parseSoil(soilData = {}) {
  try {
    const layers = soilData?.properties?.layers ?? [];
    const nLayer  = layers.find(l => l.name === "nitrogen");
    const phLayer = layers.find(l => l.name === "phh2o");
    const avg = (layer) => layer.depths.reduce((s, d) => s + (d.values?.mean ?? 0), 0) / layer.depths.length / layer.unit_measure.d_factor;
    return { nitrogen: +(avg(nLayer) * 1.3 * 30 * 0.1).toFixed(1), ph: +avg(phLayer).toFixed(1) };
  } catch { return { nitrogen: 51, ph: 6.5 }; }
}
export function parseTop3(top3 = {}) {
  return Object.entries(top3).sort((a, b) => b[1] - a[1]).map(([crop, prob]) => ({ name: formatCropName(crop), prob: Math.round(prob * 100) }));
}
export function parseAnalysis(analysis) {
  const predictions = analysis.predictions ?? {};
  const { cropScore, riskLevel } = deriveScore(predictions.probability ?? 0);
  const weather = parseWeather(analysis.weather_data);
  const soil    = parseSoil(analysis.soil_data);
  const top3    = parseTop3(predictions.top3 ?? {});
  return {
    id: analysis.id,
    date: analysis.created_at ? new Date(analysis.created_at).toISOString().split("T")[0] : "—",
    latitude: analysis.latitude, longitude: analysis.longitude,
    locationName: analysis.location_name || `${analysis.latitude?.toFixed(4)}, ${analysis.longitude?.toFixed(4)}`,
    cropScore, riskLevel,
    predictionClass: formatCropName(predictions.prediction_class ?? ""),
    probability: Math.round((predictions.probability ?? 0) * 100),
    top3, aiResponse: analysis.ai_response ?? "",
    temperature: weather.temperature, rainfall: weather.rainfall, humidity: weather.humidity,
    nitrogen: soil.nitrogen, ph: soil.ph,
  };
}
