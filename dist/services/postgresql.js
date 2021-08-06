"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSqlService = void 0;
var pg_1 = require("pg");
var POSTGRESQL_URI = process.env.POSTGRESQL_URI || '';
var STATIONS_TABLE = 'Stations';
var PostgreSqlService = /** @class */ (function () {
    function PostgreSqlService() {
        this.pool = new pg_1.Pool({
            connectionString: POSTGRESQL_URI,
            ssl: { rejectUnauthorized: false }
        });
        // this.pool.query(`DROP TABLE ${STATIONS_TABLE}`)
        this.pool.query("CREATE TABLE IF NOT EXISTS " + STATIONS_TABLE + " (\n      id SERIAL PRIMARY KEY,\n      createTime timestamp without time zone,\n      data text)");
    }
    PostgreSqlService.prototype.getAll = function () {
        return this.pool.query("SELECT * FROM " + STATIONS_TABLE);
    };
    PostgreSqlService.prototype.recordStations = function (time, stationJsonString) {
        return this.pool.query("INSERT INTO " + STATIONS_TABLE + "(id, createTime, data) VALUES(DEFAULT, $1, $2) RETURNING *", [time, stationJsonString]);
    };
    PostgreSqlService.prototype.getStationsNearestTime = function (time) {
        return this.pool.query("SELECT data FROM " + STATIONS_TABLE + " ORDER BY createTime >= $1::timestamp LIMIT 1", [time]);
    };
    PostgreSqlService.prototype.getStationsBetweenTime = function (timeAt, timeTo) {
        return this.pool.query("SELECT data FROM " + STATIONS_TABLE + " WHERE createTime BETWEEN $1 AND $2 ORDER BY createTime", [timeAt, timeTo]);
    };
    PostgreSqlService.prototype.getStationsBetweenTimeDaily = function (timeAt, timeTo) {
        var query = "\n      SELECT * FROM \n      (\n        SELECT temp.month, temp.day, max(EXTRACT(HOUR FROM temp.createTime)) FROM\n        (\n          SELECT *, EXTRACT(DAY FROM createTime) as day, EXTRACT(MONTH FROM createTime) as month\n          FROM " + STATIONS_TABLE + "\n          WHERE EXTRACT(HOUR FROM createTime) <= 16\n        ) temp\n        GROUP BY temp.day, temp.month\n      ) temp_1\n      LEFT JOIN " + STATIONS_TABLE + "\n      ON temp_1.month = EXTRACT(MONTH FROM " + STATIONS_TABLE + ".createTime)\n      and temp_1.day = EXTRACT(DAY FROM " + STATIONS_TABLE + ".createTime)\n      and temp_1.max = EXTRACT(HOUR FROM " + STATIONS_TABLE + ".createTime)\n      WHERE " + STATIONS_TABLE + ".createTime BETWEEN $1 AND $2 ORDER BY createTime\n    ";
        return this.pool.query(query, [timeAt, timeTo]);
    };
    return PostgreSqlService;
}());
exports.PostgreSqlService = PostgreSqlService;
