const INDEGO_API_BASE_URL = process.env.INDEGO_API_BASE_URL || '';
const ENDPOINTS = {
  STATIONS: 'stations/json/'
}
import { HttpService } from './http';

export class IndegoService {
  httpService: HttpService;
  constructor() {
    this.httpService = new HttpService(INDEGO_API_BASE_URL);
  }

  async getStations() {
    try {
      return this.httpService.get(ENDPOINTS.STATIONS)
    } catch(err) {
      return Promise.reject(err);
    }
  }
}