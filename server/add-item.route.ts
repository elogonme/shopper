
import {Request, Response} from 'express';
import {ITEMS} from './db-data';
import {setTimeout} from 'timers';

export function addItem(req: Request, res: Response) {

  const item = req.body

  console.log('Successfully added item to DB on server');

  console.log(item);

  res.status(200).json(item);
}
