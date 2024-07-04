import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  country: string;
  city: string;
  dateTime: Date;
  lon: number;
  lat: number;
  icon: string;
  day: string;
  timezone: string;  // New field for timezone
}

class WeatherApp {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.OPENWEATHERMAP_API_KEY || '';
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  }

  async getWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      const data = response.data;
      const localTime = new Date(data.dt * 1000 + data.timezone * 1000);
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        country: data.sys.country,
        city: data.name,
        dateTime: localTime,
        lon: data.coord.lon,
        lat: data.coord.lat,
        icon: this.getWeatherIcon(data.weather[0].id),
        day: this.getDayName(localTime),
        timezone: this.getTimezone(data.timezone)
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  getWeatherIcon(conditionId: number): string {
    if (conditionId >= 200 && conditionId < 300) {
      return '⛈️';  // Thunderstorm
    } else if (conditionId >= 300 && conditionId < 500) {
      return '🌧️';  // Drizzle
    } else if (conditionId >= 500 && conditionId < 600) {
      return '🌧️';  // Rain
    } else if (conditionId >= 600 && conditionId < 700) {
      return '❄️';  // Snow
    } else if (conditionId >= 700 && conditionId < 800) {
      return '🌫️';  // Atmosphere (fog, mist, etc.)
    } else if (conditionId === 800) {
      return '☀️';  // Clear sky
    } else if (conditionId > 800 && conditionId < 900) {
      return '☁️';  // Clouds
    } else {
      return '🌡️';  // Default/unknown
    }
  }

  getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  getTimezone(offset: number): string {
    const hours = Math.abs(Math.floor(offset / 3600));
    const minutes = Math.abs(Math.floor((offset % 3600) / 60));
    const sign = offset >= 0 ? '+' : '-';
    return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  displayWeather(weather: WeatherData): void {
    console.log(`Weather for ${weather.city}, ${weather.country}:`);
    console.log(`Day: ${weather.day}`);
    console.log(`Local Time: ${weather.dateTime.toLocaleString()} (${weather.timezone})`);
    console.log(`Coordinates: ${weather.lat}°N, ${weather.lon}°E`);
    console.log(`${weather.temperature}°C - ${weather.description} ${weather.icon} `);
    console.log(`Humidity: ${weather.humidity}%`);
    console.log(`Wind Speed: ${weather.windSpeed} m/s`);
  }
}

async function run() {
  const weatherApp = new WeatherApp();

  try {
    const city = process.argv[2] || 'London';
    const weatherData = await weatherApp.getWeather(city);
    weatherApp.displayWeather(weatherData);
  } catch (error) {
    console.error('Failed to get weather data:', error);
  }
}

run();