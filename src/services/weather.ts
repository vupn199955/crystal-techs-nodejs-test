const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL || '';
const ENDPOINTS = {
  WEATHER: 'weather'
}
import { HttpService } from './http';

export class WeatherService {
  httpService: HttpService;
  constructor() {
    this.httpService = new HttpService(WEATHER_API_BASE_URL);
  }

  async getWeatherOfPhiladelphia() {
    try {
      const data = await this.httpService.get(ENDPOINTS.WEATHER, {
        appid: WEATHER_API_KEY,
        q: 'Philadelphia'
      })
      return data;
    } catch(err) {
      return Promise.reject(err);
    }
  }
}