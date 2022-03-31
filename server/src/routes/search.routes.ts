import {Datastore} from '../Datastore';
import {Request, Response} from 'express'

export function getSearchRouteHandler(datastore: Datastore) {
    return (req: Request, res: Response) => {
        res.json(datastore.search(req.body.countries || [], req.body.deviceIds || []));
    };
}