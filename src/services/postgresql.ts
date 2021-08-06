import { Pool } from 'pg'
const POSTGRESQL_URI = process.env.POSTGRESQL_URI || '';
const STATIONS_TABLE = 'Stations'

export class PostgreSqlService {
  pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: POSTGRESQL_URI,
      ssl: { rejectUnauthorized: false }
    })
    // this.pool.query(`DROP TABLE ${STATIONS_TABLE}`)
    this.pool.query(`CREATE TABLE IF NOT EXISTS ${STATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      createTime text,
      data text)`
    )
  }

  getAll() {
    return this.pool.query(`SELECT * FROM ${STATIONS_TABLE}`)
  }

  recordStations(time: number, stationJsonString: string): Promise<any> {
    return this.pool.query(`INSERT INTO ${STATIONS_TABLE}(id, createTime, data) VALUES(DEFAULT, $1, $2) RETURNING *`, [time, stationJsonString])
  }

  getStationsNearestTime(time: number) {
    return this.pool.query(`SELECT data FROM ${STATIONS_TABLE} ORDER BY createTime::int8 >= $1::int8 LIMIT 1`, [time])
  }

  getStationsBetweenTime(timeAt: string, timeTo: string) {
    return this.pool.query(`SELECT data FROM ${STATIONS_TABLE} WHERE createTime::int8 BETWEEN $1::int8 AND $2::int8 ORDER BY createTime::int8 >= $2::int8`, [timeAt, timeTo])
  }
}