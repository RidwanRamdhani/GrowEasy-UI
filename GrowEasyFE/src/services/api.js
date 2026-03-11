// ─────────────────────────────────────────────────────────────────────────────
// src/services/api.js
//
// All calls to GrowEasy Go backend (runs on :8080)
// Base: http://localhost:8080
//
// Public routes  (no token needed):
//   POST /api/auth/register
//   POST /api/auth/login
//
// Protected routes  (Bearer token required):
//   POST /api/weather        { latitude, longitude }
//   POST /api/soil           { latitude, longitude }
//   POST /api/predict        { latitude, longitude }  ← main flow
//   GET  /api/history
//   POST /api/chat           { message }
//   GET  /api/chat/history?all=true
//   POST /api/chat/reset
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

// Attach JWT from localStorage to every protected request
async function req(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (res.status === 401) {
    // Token expired or invalid — force logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth:logout"));
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const register = (name, email, password) =>
  req("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
// returns: { message: "User registered successfully" }

export const login = (email, password) =>
  req("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
// returns: { message, token, user: { id, email, name } }

// ── Analysis ──────────────────────────────────────────────────────────────────
// One-shot: weather + soil + ML + Gemini summary → saved to DB
// Returns: models.Analysis { id, latitude, longitude, location_name,
//          soil_data, weather_data, predictions, ai_response, created_at }
export const predict = (latitude, longitude) =>
  req("/api/predict", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude }),
  });

// History — returns { data: Analysis[], count: number }
export const getHistory = () => req("/api/history");

// ── Chat ──────────────────────────────────────────────────────────────────────
// Send a message; BE uses latest analysis as context via Gemini
// Returns: { response: "AI reply text" }
export const sendChat = (message) =>
  req("/api/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

// Get chat history for current session
// Pass all=true to get all sessions
// Returns: { data: ChatMessage[], count: number }
export const getChatHistory = (all = false) =>
  req(`/api/chat/history${all ? "?all=true" : ""}`);

// Reset chat session (clears context)
export const resetChat = () =>
  req("/api/chat/reset", { method: "POST" });
