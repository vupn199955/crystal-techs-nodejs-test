## API Documentation
Server test URL: https://test-nodejs-vp.herokuapp.com/
- /api/v1/stations/fetch?at={datetime}
    To create an record into database
    Query params:
    - at: Datetime, optional
- /api/v1/stations?at={datetime}
    Query params:
    - at: Datetime, optional
- Get Kiosk: /api/v1/stations/:kioskId?at={datetime}&to={datetime}
    Query params:
    - at: Datetime, required
    - to: Datetime, optional