
import {Request, Response} from 'express';
import {ITEMS} from './db-data';
import {setTimeout} from 'timers';
import {Item} from "../src/app/model/item";

export function searchItems(req: Request, res: Response) {

    const queryParams = req.query;

    const shopId = queryParams.shopId;
    const filter = queryParams.filter || '';
    const sortOrder = queryParams.sortOrder;
    const pageNumber = parseInt(queryParams.pageNumber) || 0;
    const pageSize = parseInt(queryParams.pageSize);
    let items: any = [];

    if (shopId !== 'all') {
      items = Object.values(ITEMS).filter(item => item.shopId === shopId).sort((l1, l2) => l1.id - l2.id);
    } else {
      items = Object.values(ITEMS);
    }

    if (filter) {
       items = items.filter(item => item.shopId.trim().toLowerCase().search(filter.toLowerCase()) >= 0);
    }

    items.sort((a,b) => a.shopId.localeCompare(b.shopId)); // sort data by shopId ascending by default

    if (sortOrder === 'desc') {
       items = items.reverse();
    }

    const initialPos = pageNumber * pageSize;

    const itemsPage = items.slice(initialPos, initialPos + pageSize);

    setTimeout(() => {

        res.status(200).json({payload: itemsPage});
    }, 1000);

}

export function addItem(req: Request, res: Response) {

  const item = req.body;

  item.done = false;
  item.id = 5;


  console.log('database: ', ITEMS);

  console.log('Successfully added item to DB on server');

  console.log(item);

  res.status(200).json(item);
}
