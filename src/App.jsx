import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || !API_KEY;
const DEMO_DELAY_MS = 1000;
const GEO_AUTO = import.meta.env.VITE_ENABLE_GEO === 'true';

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
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const isDark = theme === 'dark';
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Utility: wrap geolocation in a Promise
  const getPosition = () => new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(err),
      { enableHighAccuracy: true, maximumAge: 600000, timeout: 10000 }
    );
  });

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');

    try {
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise((r) => setTimeout(r, DEMO_DELAY_MS));
        // Simple coordinate-based demo mapping
        let weatherCondition = 'Clear';
        let description = 'clear sky';
        let icon = '01d';
        let temp = 22;

        if (lat > 45) {
          weatherCondition = 'Snow';
          description = 'light snow';
          icon = '13d';
          temp = -1;
        } else if (lon > 0) {
          weatherCondition = 'Rain';
          description = 'light rain';
          icon = '10d';
          temp = 17;
        } else if (lon < 0) {
          weatherCondition = 'Clouds';
          description = 'broken clouds';
          icon = '04d';
          temp = 19;
        }

        const demoData = {
          name: 'Current Location',
          sys: { country: 'DEMO' },
          weather: [{ main: weatherCondition, description, icon }],
          main: {
            temp,
            feels_like: temp - 1,
            humidity: 60,
            pressure: 1012,
            temp_min: temp - 3,
            temp_max: temp + 2,
          },
          wind: { speed: 3.2 },
        };
        setWeather(demoData);
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
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
    } catch (err) {
      if (err && typeof err.code === 'number') {
        // GeolocationPositionError codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        if (err.code === 1) {
          setError('Location permission denied');
        } else if (err.code === 2) {
          setError('Unable to determine your location');
        } else if (err.code === 3) {
          setError('Location request timed out');
        } else {
          setError('Unable to get your location');
        }
      } else {
        setError(err.message || 'Failed to fetch weather data');
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUseMyLocation = async () => {
    try {
      const pos = await getPosition();
      const { latitude, longitude } = pos.coords;
      await fetchWeatherByCoords(latitude, longitude);
    } catch (e) {
      // Errors are handled inside fetchWeatherByCoords; capture unsupported browser error here
      if (e && e.message && e.message.includes('Geolocation')) {
        setError(e.message);
      }
    }
  };

  // Optional: auto-prompt for location on load when enabled
  useEffect(() => {
    if (!GEO_AUTO) return;
    if (weather || loading) return;
    handleUseMyLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GEO_AUTO]);

  const fetchWeather = async (e) => {
    e.preventDefault();
    
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

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
          {/* Top bar: Theme toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              type="button"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-md transition"
              aria-label="Toggle color theme"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span className="text-lg" role="img" aria-hidden>
                {theme === 'dark' ? '☀️' : '🌙'}
              </span>
              <span className="text-sm font-medium">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
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
          <form onSubmit={fetchWeather} className="mb-4">
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
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={loading}
                className="shrink-0 w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md shadow-lg transition disabled:opacity-50"
                title="Use my location"
                aria-label="Use my location"
              >
                📍
              </button>
            </div>
          </form>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-6 w-6 rounded-full border-2 border-white/70 border-t-transparent animate-spin"></div>
              <div className="text-white/90">Fetching weather...</div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 bg-opacity-90 text-white px-6 py-4 rounded-2xl mb-6 text-center shadow-lg">
              {error}
            </div>
          )}

          {/* Weather Data */}
          <AnimatePresence mode="wait">
          {weather && (
            <motion.div
              key={(weather?.name || '') + (weather?.weather?.[0]?.main || '')}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={
                'bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl'
              }
            >
              {/* City Name and Weather Icon */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-bold text-white mb-2 drop-shadow">
                  {weather.name}, {weather.sys.country}
                </h2>
                {weather.weather && weather.weather[0] && (
                  <div className="flex items-center justify-center">
                    <motion.img
                      src={getWeatherIcon(weather.weather[0].icon)}
                      alt={weather.weather[0].description}
                      className="w-32 h-32 drop-shadow-lg"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
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
            </motion.div>
          )}
          </AnimatePresence>

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
