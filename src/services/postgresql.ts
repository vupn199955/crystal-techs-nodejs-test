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
      createTime timestamp without time zone,
      data text)`
    )
  }

  getAll() {
    return this.pool.query(`SELECT * FROM ${STATIONS_TABLE}`)
  }

  recordStations(time: string, stationJsonString: string): Promise<any> {
    return this.pool.query(`INSERT INTO ${STATIONS_TABLE}(id, createTime, data) VALUES(DEFAULT, $1, $2) RETURNING *`, [time, stationJsonString])
  }

  getStationsNearestTime(time: string) {
    return this.pool.query(`SELECT data FROM ${STATIONS_TABLE} ORDER BY createTime >= $1::timestamp LIMIT 1`, [time])
  }

  getStationsBetweenTime(timeAt: string, timeTo: string) {
    return this.pool.query(`SELECT data FROM ${STATIONS_TABLE} WHERE createTime BETWEEN $1 AND $2 ORDER BY createTime`, [timeAt, timeTo])
  }

  getStationsBetweenTimeDaily(timeAt: string, timeTo: string) {
    const query = `
      SELECT * FROM 
      (
        SELECT temp.month, temp.day, max(EXTRACT(HOUR FROM temp.createTime)) FROM
        (
          SELECT *, EXTRACT(DAY FROM createTime) as day, EXTRACT(MONTH FROM createTime) as month
          FROM ${STATIONS_TABLE}
          WHERE EXTRACT(HOUR FROM createTime) <= 16
        ) temp
        GROUP BY temp.day, temp.month
      ) temp_1
      LEFT JOIN ${STATIONS_TABLE}
      ON temp_1.month = EXTRACT(MONTH FROM ${STATIONS_TABLE}.createTime)
      and temp_1.day = EXTRACT(DAY FROM ${STATIONS_TABLE}.createTime)
      and temp_1.max = EXTRACT(HOUR FROM ${STATIONS_TABLE}.createTime)
      WHERE ${STATIONS_TABLE}.createTime BETWEEN $1 AND $2 ORDER BY createTime
    `
    return this.pool.query(query, [timeAt, timeTo])
  }
}