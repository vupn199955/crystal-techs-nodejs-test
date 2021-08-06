import axios from 'axios'

export class HttpService {
  private baseUrl: string;
  private config: any;
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.config = {
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  async get(endpoint: string, params?: any) {
    try {
      const request = await axios.get(endpoint, {
        params,
        ...this.config
      });
      if (request.status === 200) {
        return {
          status: 200,
          data: request.data
        }
      }
      return {
        status: request.status,
        error: request.data
      }
    } catch(err) {
      return {
        status: 500,
        error: err
      }
    }
  }
}