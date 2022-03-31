import express from 'express';
import {Datastore} from './Datastore';
import {Bug, Device, Tester, TesterDeviceMapping} from './intefaces';
import path from 'path';
import {getSearchRouteHandler} from './routes/search.routes';
import {getCountriesRouteHandler} from './routes/countries.route';
import {getDeviceRouteHandler} from './routes/devices.route';
import {loadCsv} from './load-csv';

const devices: Device[] = loadCsv(path.join(__dirname, '../data/devices.csv'));
const testers: Tester[] = loadCsv(path.join(__dirname, '../data/testers.csv'));
const bugs: Bug[] = loadCsv(path.join(__dirname, '../data/bugs.csv'));
const testerDevices: TesterDeviceMapping[] = loadCsv(path.join(__dirname, '../data/tester_device.csv'));
const datastore = new Datastore(devices, testers, bugs, testerDevices);

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static(path.join(__dirname, '../../client/dist/client')));

app.get('/api/v1/devices', getDeviceRouteHandler(datastore));
app.get('/api/v1/countries', getCountriesRouteHandler(datastore));
app.post('/api/v1/search', getSearchRouteHandler(datastore));

app.listen( port, () => {
    console.log(`server started at http://localhost:${ port }`);
});