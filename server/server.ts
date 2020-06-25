
import * as express from 'express';
import {Application} from 'express';
import {getAllShops, getShopById} from './get-shops.route';
import {searchItems, addItem} from './REST-items.route';

const app: Application = express();

app.use(express.json());       // to support JSON-encoded bodies

app.route('/api/shops').get(getAllShops);

app.route('/api/shops/:id').get(getShopById);

app.route('/api/items').get(searchItems);

app.route('/api/items').post(addItem);

const httpServer: any = app.listen(9000, () => {
    console.log('HTTP REST API Server running at http://localhost:' + httpServer.address().port);
});




