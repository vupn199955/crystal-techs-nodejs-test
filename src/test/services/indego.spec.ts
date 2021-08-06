import sinon from 'sinon';
import { IndegoService } from '../../services/indego';
import axios from 'axios';
import { expect } from "chai";

describe("IndegoService", function () {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it("get stations success", async () => {
    const indegoService = new IndegoService();
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 200,
      data: 'test'
    }))
    const result = await indegoService.getStations();
    expect(result).property('status', 200);
    expect(result).property('data', 'test')
  });

  it("get stations fail", async () => {
    const indegoService = new IndegoService();
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 500,
      data: 'fail'
    }))
    const result = await indegoService.getStations();
    expect(result).property('status', 500);
    expect(result).property('error', 'fail')
  });
});