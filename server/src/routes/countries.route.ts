import {Datastore} from '../Datastore';
import {Request, Response} from 'express'

export function getCountriesRouteHandler(datastore: Datastore) {
    return (req: Request, res: Response) => {
        res.json(datastore.getCountries());
    };
}