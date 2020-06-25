

import {Request, Response} from 'express';
import {SHOPS} from './db-data';



export function getAllShops(req: Request, res: Response) {

    res.status(200).json({payload: Object.values(SHOPS)});

}


export function getShopById(req: Request, res: Response) {

    const shopId = req.params.shopId;

    const shops: any = Object.values(SHOPS);

    const shop = shops.find(shop => shop.shopId == shopId);

    res.status(200).json(shop);
}
