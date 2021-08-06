import sinon from 'sinon';
import { HttpService } from '../../services/http';
import axios from 'axios';
import { expect } from "chai";

describe("HttpService", function () {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  })

  afterEach(() => {
    // completely restore all fakes created through the sandbox
    sandbox.restore();
  });

  it("get success", async () => {
    const httpService = new HttpService('test');
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 200,
      data: 'test'
    }))
    const result = await httpService.get('test-url');
    expect(result).property('status', 200);
    expect(result).property('data', 'test')
  });

  it("get fail", async () => {
    const httpService = new HttpService('test');
    sandbox.stub(axios, 'get').returns(Promise.resolve({
      status: 500,
      data: 'fail'
    }))
    const result = await httpService.get('test-url');
    expect(result).property('status', 500);
    expect(result).property('error', 'fail')
  });
});