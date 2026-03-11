# GrowEasy

## Quick Summary
GrowEasy is a web platform for agricultural analysis, providing tools for soil and weather analysis, AI-powered insights, and history tracking.

## Key Features
- **Landing Page**: Hero orb with 3-ring pulse animation, parallax mouse tracking, platform statistics, and CTA.
- **Authentication Page**: Login/Register with tab toggle and radial glow background.
- **Dashboard**: Sticky sidebar navigation, "Start Analyze" gradient biopunk card, stats grid, and latest analysis preview.
- **Analyze Page**: 5-step animated flow (GPS → Fetch API → Python ML → Gen AI → Done) with glowing progress bar, dot-pulse indicators, and real-time AI chat results via ScoreRing SVG.
- **History Page**: Accordion cards per analysis, expandable for soil/weather details, AI summary, and locked chat history with "🔒 Sesi chat ini telah berakhir." badge.

## Tech Stack
- **Frontend**: 
  - React 19.2.0
  - Vite 7.3.1 (build tool)
  - ES Lint
  - CSS with custom fonts (Syne, DM Mono, Lora) and color scheme (black, teal green, amber)
  - Glowing and pulse animations
- **Backend Integration**: 
  - Designed to connect to GPS, Soil API, Weather API, Python ML endpoint, and Gen AI endpoint

## Configuration
- Create a `.env` file in the `GrowEasyFE` directory (if not present) with:
  ```
  VITE_API_URL=http://localhost:8080
  ```
  Adjust the URL to point to your backend server.

## How to Run the Application
1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   cd GrowEasyFE
   npm install
   ```
3. **Start the development server**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```
5. **Preview the production build**:
   ```bash
   npm run preview
   ```
