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
- ✨ **Smooth Animations**: Fade-in effect when weather data loads
- 📱 **Fully Responsive**: Works beautifully on desktop, tablet, and mobile devices
- 🎯 **Modern UI**: Glass-morphism effects with backdrop blur
- ⚡ **Fast & Lightweight**: Built with Vite for optimal performance

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
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
cp .env.example .env
```

5. Add your API key to the `.env` file:
```
VITE_OPENWEATHER_API_KEY=your_api_key_here
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
├── public/              # Static assets
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
