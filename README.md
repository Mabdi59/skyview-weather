# SkyView Weather ☀️🌧️

A modern, responsive weather web application built with React, Vite, and TailwindCSS. SkyView Weather provides real-time weather information for any city worldwide, featuring dynamic gradient backgrounds that change based on weather conditions and smooth fade-in animations.

![SkyView Weather](https://github.com/user-attachments/assets/3697a332-5c5f-4907-be2b-0c0a2b6d5ea7)

## ✨ Features

- 🔍 **City Search**: Search for weather information in any city worldwide
- 🌡️ **Comprehensive Weather Data**: 
  - Current temperature with "feels like" temperature
  - Humidity percentage
  - Wind speed (converted to km/h)
  - Atmospheric pressure
  - Min/Max temperatures
  - Weather condition descriptions and icons
- 🎨 **Dynamic Backgrounds**: Background gradient changes based on weather conditions:
  - Clear skies → Blue gradient
  - Cloudy → Gray gradient
  - Rain/Drizzle → Dark slate gradient
  - Snow → Light blue gradient
  - Thunderstorm → Very dark gradient
  - And many more!
- ✨ **Smooth Animations**: Framer Motion enter/exit transitions for the weather card and a subtle icon scale/fade
- 🔁 **Loading Indicator**: Lightweight Tailwind spinner displayed during fetches
- 🌓 **Light/Dark Theme Toggle**: Persistent theme via localStorage using Tailwind's `dark` class
- 📍 **Use My Location**: Fetch by geolocation (with friendly error messages); optional auto-prompt via env flag
- 📱 **Fully Responsive**: Works beautifully on desktop, tablet, and mobile devices
- 🎯 **Modern UI**: Glass-morphism effects with backdrop blur
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (or yarn/pnpm)
- OpenWeatherMap API key (free tier available)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mabdi59/skyview-weather.git
cd skyview-weather
```

2. Install dependencies:
```bash
npm install
```

3. Get your free API key:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

4. Create a `.env` file in the root directory:
```bash
# macOS/Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

5. Add your API key to the `.env` file and optional flags:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
# VITE_DEMO_MODE=true          # Use canned data without an API key
# VITE_ENABLE_GEO=true         # Auto-request geolocation on load
```

### Running the Application

**Development mode:**
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

**Production build:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## 🛠️ Tech Stack

- **React 18.3** - UI library
- **Vite 6.0** - Build tool and dev server
- **TailwindCSS 3.4** - Utility-first CSS framework
- **Framer Motion** - Lightweight animations
- **OpenWeatherMap API** - Weather data source
- **ESLint** - Code linting

## 📂 Project Structure

```
skyview-weather/
├── src/
│   ├── App.jsx          # Main application component
│   ├── App.css          # Component-specific styles
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind directives
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
├── postcss.config.js    # PostCSS configuration
├── eslint.config.js     # ESLint configuration
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## 🎨 Weather Conditions & Gradients

The app dynamically changes background gradients based on weather conditions:

| Weather Condition | Gradient Colors |
|------------------|-----------------|
| Clear | Blue (400-600) |
| Clouds | Gray (400-600) |
| Rain | Slate (600-800) |
| Drizzle | Slate (500-700) |
| Thunderstorm | Slate (700-900) |
| Snow | Blue (100-300) |
| Mist/Fog | Gray (300-500) |
| Haze | Orange (200-400) |
| Dust/Sand | Yellow (500-800) |
| Default | Cyan (400-600) |

## 🌐 API Usage

The app uses the OpenWeatherMap Current Weather Data API:
- Endpoint: `https://api.openweathermap.org/data/2.5/weather`
- Units: Metric (Celsius, km/h)
- Data includes: Temperature, humidity, wind speed, pressure, weather conditions

### Geolocation
- Click the 📍 button to fetch weather for your current location (works on localhost and HTTPS).
- Optional: set `VITE_ENABLE_GEO=true` to auto-request location on load.
- Notes: Browsers require secure origin (HTTPS) for geolocation in production; GitHub Pages is HTTPS by default.

### Deployment (GitHub Pages)
- A workflow at `.github/workflows/deploy.yml` builds and deploys `dist/` on pushes to `main`.
- Vite `base` is set to `/skyview-weather/` in `vite.config.js` so assets resolve correctly on Pages.
- After the first successful run, ensure repository Settings → Pages → Source = GitHub Actions. The site will be available at:
  - `https://<your-username>.github.io/skyview-weather/`
  - If you fork/rename, update `base` accordingly in `vite.config.js`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Mabdi59**
- GitHub: [@Mabdi59](https://github.com/Mabdi59)

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons from OpenWeatherMap
- Built with modern web technologies
