import { Router, Request, Response } from "express";
import { WeatherService } from "services/weather";
import { IndegoService } from '../services/indego';
import { PostgreSqlService } from "services/postgresql";
import moment from 'moment';
import * as _ from 'lodash';

const router = Router();

const indegoService = new IndegoService();
const weatherService = new WeatherService();
const postgreSqlService = new PostgreSqlService();

router.get("/fetch", async (req: Request, res: Response) => {
  const { at } = req.query as any
  const dateAt = at && new Date(at);
  const timeAt = moment(dateAt).utc().toString();
  try {
    const stationRes = await indegoService.getStations();
    if (stationRes.status === 200) {
      const data = await postgreSqlService.recordStations(
        timeAt,
        JSON.stringify(stationRes.data.features),
      );
      res.status(stationRes.status).json({
        at: timeAt,
        stations: data,
      });
    } else {
      res.status(stationRes.status).json(stationRes.data);
    }
  } catch(err) {
    res.status(500).json(err)
  }
});

router.get("/", async (req: Request, res: Response) => {
  const { at } = req.query as any;
  if (!at) {
    res.status(404).send();
    return;
  }
  const timeAt = moment.utc(new Date(at)).toString();
  try {
    const data = await postgreSqlService.getStationsNearestTime(timeAt);

    if (!data.rows.length) {
      res.status(404).send();
      return;
    }

    const weatherRes = await weatherService.getWeatherOfPhiladelphia();

    if (weatherRes.status === 200) {
      res.status(weatherRes.status).json({
        at,
        stations: JSON.parse(data.rows[0].data),
        weather: weatherRes.data
      });
    } else {
      res.status(weatherRes.status).json(weatherRes.data);
    }
  } catch(err) {
    res.status(500).json(err)
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const data = await postgreSqlService.getAll();
    res.status(200).json(data);
  } catch(err) {
    res.status(500).json(err)
  }
});

router.get("/:kioskId", async (req: Request, res: Response) => {
  const { at , to, frequency = 'hourly'} = req.query as any;
  if (!at) {
    res.status(404).send();
    return;
  }
  const timeAt = moment(new Date(at)).utc().format('yyyy-MM-DD');
  const timeTo = to && moment(new Date(to)).format('yyyy-MM-DD');
  const kioskId = req.params.kioskId;
  try {
    let request;
    if (!timeTo) {
      request = postgreSqlService.getStationsNearestTime(timeAt);
    } else {
      if (frequency === 'hourly') {
        request = postgreSqlService.getStationsBetweenTime(timeAt, timeTo);
      } else {
        request = postgreSqlService.getStationsBetweenTimeDaily(timeAt, timeTo);
      }
    }
    const weatherReq = weatherService.getWeatherOfPhiladelphia();
    const [ stationsRes, weatherRes ] = await Promise.all([
      request,
      weatherReq
    ])

    if (!stationsRes.rows.length) {
      res.status(404).send();
      return;
    }

    const _stations = _.map(stationsRes.rows, ({ data }) => {
      const _data = JSON.parse(data);
      const kiosk = _.find(_data, ({ properties: { id }}) => (id == kioskId));
      return kiosk;
    })
    if (weatherRes.status === 200) {
      res.status(weatherRes.status).json({
        station: _stations,
        weather: weatherRes.data
      });
    } else {
      res.status(weatherRes.status).json(weatherRes.data);
    }
  } catch(err) {
    res.status(500).json(err)
  }
});

export default router;