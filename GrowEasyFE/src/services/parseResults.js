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
    const avg = (layer) => {
      if (!layer?.depths?.length) return null;
      const values = layer.depths.map(d => d.values?.mean);
      // Check if any value is null or undefined
      if (values.some(v => v === null || v === undefined)) return null;
      const sum = values.reduce((s, v) => s + v, 0);
      return sum / layer.depths.length / (layer.unit_measure?.d_factor || 1);
    };
    const nitrogenVal = nLayer ? +(avg(nLayer)).toFixed(1) : null;
    const phVal = phLayer ? +(avg(phLayer)).toFixed(1) : null;
    // Return "Not Available" if null or 0
    const nitrogen = (!nitrogenVal) ? "N/A" : nitrogenVal;
    const ph = (!phVal) ? "N/A" : phVal;
    return { nitrogen, ph };
  } catch { return { nitrogen: "N/A", ph: "N/A" }; }
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
