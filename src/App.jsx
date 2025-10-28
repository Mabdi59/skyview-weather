import { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !API_KEY;
const DEMO_DELAY_MS = 1000;

// Weather condition to gradient mapping
const weatherGradients = {
  Clear: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
  Clouds: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
  Rain: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800',
  Drizzle: 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700',
  Thunderstorm: 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900',
  Snow: 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300',
  Mist: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
  Smoke: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
  Haze: 'bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400',
  Dust: 'bg-gradient-to-br from-yellow-600 via-yellow-700 to-yellow-800',
  Fog: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500',
  Sand: 'bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700',
  Ash: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700',
  Squall: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800',
  Tornado: 'bg-gradient-to-br from-slate-800 via-slate-900 to-black',
};

const defaultGradient = 'bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600';

// Helper function to convert city names to title case
const toTitleCase = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setFadeIn(false);

    try {
      // Demo mode with sample data when no API key is provided
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, DEMO_DELAY_MS));
        
        // Different weather conditions based on city name for demo
        const cityLower = city.toLowerCase();
        let weatherCondition = 'Clear';
        let description = 'clear sky';
        let icon = '01d';
        let temp = 22;
        
        if (cityLower.includes('rain') || cityLower.includes('seattle')) {
          weatherCondition = 'Rain';
          description = 'light rain';
          icon = '10d';
          temp = 15;
        } else if (cityLower.includes('cloud') || cityLower.includes('london')) {
          weatherCondition = 'Clouds';
          description = 'overcast clouds';
          icon = '04d';
          temp = 18;
        } else if (cityLower.includes('snow') || cityLower.includes('moscow')) {
          weatherCondition = 'Snow';
          description = 'light snow';
          icon = '13d';
          temp = -2;
        } else if (cityLower.includes('storm') || cityLower.includes('thunder')) {
          weatherCondition = 'Thunderstorm';
          description = 'thunderstorm with rain';
          icon = '11d';
          temp = 16;
        }
        
        // Sample weather data for demo purposes
        const demoData = {
          name: toTitleCase(city),
          sys: { country: 'DEMO' },
          weather: [
            { 
              main: weatherCondition, 
              description: description,
              icon: icon
            }
          ],
          main: {
            temp: temp,
            feels_like: temp - 2,
            humidity: 65,
            pressure: 1013,
            temp_min: temp - 4,
            temp_max: temp + 3
          },
          wind: {
            speed: 3.5
          }
        };
        setWeather(demoData);
        setFadeIn(true);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please set VITE_OPENWEATHER_API_KEY in .env file');
        } else {
          throw new Error('Failed to fetch weather data');
        }
      }

      const data = await response.json();
      setWeather(data);
      setFadeIn(true);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentGradient = () => {
    if (!weather || !weather.weather || !weather.weather[0]) {
      return defaultGradient;
    }
    const condition = weather.weather[0].main;
    return weatherGradients[condition] || defaultGradient;
  };

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 ${getCurrentGradient()}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
              SkyView Weather
            </h1>
            <p className="text-white text-lg opacity-90">
              Get real-time weather updates for any city
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={fetchWeather} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 shadow-lg"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-white text-cyan-600 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 bg-opacity-90 text-white px-6 py-4 rounded-2xl mb-6 text-center shadow-lg">
              {error}
            </div>
          )}

          {/* Weather Data */}
          {weather && (
            <div
              className={`bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl transition-opacity duration-1000 ${
                fadeIn ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* City Name and Weather Icon */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow">
                  {weather.name}, {weather.sys.country}
                </h2>
                {weather.weather && weather.weather[0] && (
                  <div className="flex items-center justify-center">
                    <img
                      src={getWeatherIcon(weather.weather[0].icon)}
                      alt={weather.weather[0].description}
                      className="w-32 h-32 drop-shadow-lg"
                    />
                  </div>
                )}
              </div>

              {/* Temperature */}
              <div className="text-center mb-8">
                <div className="text-7xl font-bold text-white drop-shadow-lg mb-2">
                  {Math.round(weather.main.temp)}°C
                </div>
                {weather.weather && weather.weather[0] && (
                  <div className="text-2xl text-white capitalize drop-shadow">
                    {weather.weather[0].description}
                  </div>
                )}
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Feels Like</div>
                  <div className="text-white text-2xl font-bold">
                    {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Humidity</div>
                  <div className="text-white text-2xl font-bold">
                    {weather.main.humidity}%
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Wind Speed</div>
                  <div className="text-white text-2xl font-bold">
                    {Math.round(weather.wind.speed * 3.6)} km/h
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Pressure</div>
                  <div className="text-white text-2xl font-bold">
                    {weather.main.pressure} hPa
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Min Temp</div>
                  <div className="text-white text-2xl font-bold">
                    {Math.round(weather.main.temp_min)}°C
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-white text-sm opacity-90 mb-1">Max Temp</div>
                  <div className="text-white text-2xl font-bold">
                    {Math.round(weather.main.temp_max)}°C
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Initial State - No Data */}
          {!weather && !error && !loading && (
            <div className="text-center text-white text-xl opacity-80">
              Search for a city to see the weather
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
