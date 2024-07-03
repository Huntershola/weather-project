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
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        country: data.sys.country,
        city: data.name
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  displayWeather(weather: WeatherData): void {
    console.log(`Weather for ${weather.city}, ${weather.country}:`);
    console.log(`Temperature: ${weather.temperature}°C`);
    console.log(`Description: ${weather.description}`);
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