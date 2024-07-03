# Weather Project

A simple TypeScript application that fetches and displays current weather information for a specified city using the OpenWeatherMap API.

## Features

- Fetch real-time weather data from OpenWeatherMap API
- Display temperature, weather description, humidity, and wind speed
- Show city and country information
- Command-line interface to check weather for different cities

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v12.0 or higher)
- npm (usually comes with Node.js)
- An OpenWeatherMap API key (sign up at [OpenWeatherMap](https://openweathermap.org/))

## Installation

1. Create a new directory for your project:
   mkdir weather-project
   cd weather-project
 
2. Initialize a new Node.js project:
   npm init -y

3. Install necessary dependencies:
   npm install typescript ts-node dotenv axios
   npm install @types/node --save-dev

4. Create a `tsconfig.json` file:
   npx tsc --init

5. Create a `.env` file in the root directory to store your API key:
   OPENWEATHERMAP_API_KEY=your_api_key_here

   ## Project Structure

- `index.ts`: Main TypeScript file containing the weather application logic
- `package.json`: Node.js project configuration file
- `tsconfig.json`: TypeScript compiler configuration
- `.env`: Environment file for storing the API key (not tracked in git)

## Code

Create a file named `index.ts` and add the following code:

```typescript
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
  day: string;  // New field for day of the week
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
      const dateTime = new Date(data.dt * 1000);
      return {
        temperature: data.main.temp,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        country: data.sys.country,
        city: data.name,
        dateTime: dateTime,
        lon: data.coord.lon,
        lat: data.coord.lat,
        icon: this.getWeatherIcon(data.weather[0].id),
        day: this.getDayName(dateTime)  // Get day name
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

  displayWeather(weather: WeatherData): void {
    console.log(`Weather for ${weather.city}, ${weather.country}:`);
    console.log(`Day: ${weather.day}`);
    console.log(`Date and Time: ${weather.dateTime.toLocaleString()}`);
    console.log(`Coordinates: ${weather.lat}°N, ${weather.lon}°E`);
    console.log(`Weather Description: ${weather.icon} ${weather.temperature}°C - ${weather.description}`);
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




```

## Usage

To run the weather application:

 ``` npx ts-node index.ts ```

This will display the weather for London (default city).
To check the weather for a specific city:

  ```npx ts-node index.ts "New York" ```

Replace "New York" with any city name of your choice.
Dependencies

axios: For making HTTP requests
dotenv: For loading environment variables
typescript: For TypeScript support
ts-node: For running TypeScript files directly

# Contributing
Contributions to this project are welcome. Please fork the repository and submit a pull request with your changes.

License
This project is open source and available under the MIT License.

# Contact
If you have any questions or feedback, please contact [Shola] at [huntershola007@gmail.com].





 
