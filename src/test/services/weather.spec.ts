import sinon from 'sinon';
import { WeatherService } from '../../services/weather';
import axios from 'axios';
import { expect } from "chai";

describe("WeatherService", function () {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it("get Weather success", async () => {
    const weatherService = new WeatherService();
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 200,
      data: 'test'
    }))
    const result = await weatherService.getWeatherOfPhiladelphia();
    expect(result).property('status', 200);
    expect(result).property('data', 'test')
  });

  it("get Weather fail", async () => {
    const weatherService = new WeatherService();
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 500,
      data: 'fail'
    }))
    const result = await weatherService.getWeatherOfPhiladelphia();
    expect(result).property('status', 500);
    expect(result).property('error', 'fail')
  });
});