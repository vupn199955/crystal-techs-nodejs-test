"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var weather_1 = require("services/weather");
var indego_1 = require("../services/indego");
var postgresql_1 = require("services/postgresql");
var moment_1 = __importDefault(require("moment"));
var _ = __importStar(require("lodash"));
var router = express_1.Router();
var indegoService = new indego_1.IndegoService();
var weatherService = new weather_1.WeatherService();
var postgreSqlService = new postgresql_1.PostgreSqlService();
router.get("/fetch", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var at, dateAt, timeAt, stationRes, data, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                at = req.query.at;
                dateAt = at && new Date(at);
                timeAt = moment_1.default(dateAt).utc().toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, indegoService.getStations()];
            case 2:
                stationRes = _a.sent();
                if (!(stationRes.status === 200)) return [3 /*break*/, 4];
                return [4 /*yield*/, postgreSqlService.recordStations(timeAt, JSON.stringify(stationRes.data.features))];
            case 3:
                data = _a.sent();
                res.status(stationRes.status).json({
                    at: timeAt,
                    stations: data,
                });
                return [3 /*break*/, 5];
            case 4:
                res.status(stationRes.status).json(stationRes.data);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                err_1 = _a.sent();
                res.status(500).json(err_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var at, timeAt, data, weatherRes, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                at = req.query.at;
                if (!at) {
                    res.status(404).send();
                    return [2 /*return*/];
                }
                timeAt = moment_1.default.utc(new Date(at)).toString();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, postgreSqlService.getStationsNearestTime(timeAt)];
            case 2:
                data = _a.sent();
                if (!data.rows.length) {
                    res.status(404).send();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, weatherService.getWeatherOfPhiladelphia()];
            case 3:
                weatherRes = _a.sent();
                if (weatherRes.status === 200) {
                    res.status(weatherRes.status).json({
                        at: at,
                        stations: JSON.parse(data.rows[0].data),
                        weather: weatherRes.data
                    });
                }
                else {
                    res.status(weatherRes.status).json(weatherRes.data);
                }
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                res.status(500).json(err_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/all", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, postgreSqlService.getAll()];
            case 1:
                data = _a.sent();
                res.status(200).json(data);
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(500).json(err_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:kioskId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, at, to, _b, frequency, timeAt, timeTo, kioskId, request, weatherReq, _c, stationsRes, weatherRes, _stations, err_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.query, at = _a.at, to = _a.to, _b = _a.frequency, frequency = _b === void 0 ? 'hourly' : _b;
                if (!at) {
                    res.status(404).send();
                    return [2 /*return*/];
                }
                timeAt = moment_1.default(new Date(at)).utc().format('yyyy-MM-DD');
                timeTo = to && moment_1.default(new Date(to)).format('yyyy-MM-DD');
                kioskId = req.params.kioskId;
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                request = void 0;
                if (!timeTo) {
                    request = postgreSqlService.getStationsNearestTime(timeAt);
                }
                else {
                    if (frequency === 'hourly') {
                        request = postgreSqlService.getStationsBetweenTime(timeAt, timeTo);
                    }
                    else {
                        request = postgreSqlService.getStationsBetweenTimeDaily(timeAt, timeTo);
                    }
                }
                weatherReq = weatherService.getWeatherOfPhiladelphia();
                return [4 /*yield*/, Promise.all([
                        request,
                        weatherReq
                    ])];
            case 2:
                _c = _d.sent(), stationsRes = _c[0], weatherRes = _c[1];
                if (!stationsRes.rows.length) {
                    res.status(404).send();
                    return [2 /*return*/];
                }
                _stations = _.map(stationsRes.rows, function (_a) {
                    var data = _a.data;
                    var _data = JSON.parse(data);
                    var kiosk = _.find(_data, function (_a) {
                        var id = _a.properties.id;
                        return (id == kioskId);
                    });
                    return kiosk;
                });
                if (weatherRes.status === 200) {
                    res.status(weatherRes.status).json({
                        station: _stations,
                        weather: weatherRes.data
                    });
                }
                else {
                    res.status(weatherRes.status).json(weatherRes.data);
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _d.sent();
                res.status(500).json(err_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
