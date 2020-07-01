import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, finalize, tap} from 'rxjs/operators';
import { Item } from '../model/item';

@Injectable()
export class ItemsService {

  private shopsListSubject = new BehaviorSubject<string[]>([]);
  private itemsListSubject = new BehaviorSubject<Item[]>([]);
  private itemsLengthSubject = new BehaviorSubject<number>(0);

  shopsList$ = this.shopsListSubject.asObservable();
  itemsList$ = this.itemsListSubject.asObservable();
  shops: string[] = ['New Item', 'Shopping List'];

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  public itemsLength$ = this.itemsLengthSubject.asObservable();
  private serverUrl = 'http://shopperserver-env.eba-ycg2eh3f.eu-west-1.elasticbeanstalk.com';
  // private serverUrl = '';

  constructor(private http: HttpClient) {
  }

  initItems() {
    this.loadingSubject.next(true);
    return this.http.get(this.serverUrl + '/items')
      .pipe(
        tap(() => console.log('HTTP request executed - items')),
        catchError(() => of([])),
        finalize(() => {
          this.loadingSubject.next(false); })
      )
      .subscribe(res => {
        const items = res;
        this.itemsListSubject.next(Object.values(items));
        console.log('List of items retrieved from Server', Object.values(items).length);
        this.itemsLengthSubject.next(Object.values(items).length);
        const shops = this.shops.concat([...new Set(Object.values(items).map(a => a.shopId).sort())]) ;
        this.shopsListSubject.next(shops); // Retrieve list of shops from items list;
      });
  }

  clearItemsArray() {
    this.itemsListSubject.next([]);
    this.itemsLengthSubject.next(0);
  }

  getShops(): Observable<string[]>{
    return this.shopsList$;
  }

  addItem(item: Item) {
    return this.http.post(this.serverUrl + '/items', item);
  }

  updateItem(id: number, changes: Partial<Item>) {
    return this.http.put(this.serverUrl + `/items/${id}`, changes);
  }

  deleteItem(item: Item) {
    return this.http.delete(this.serverUrl + `/items/${item.id}`);
  }

  deleteChecked() {
    return this.http.post(this.serverUrl + 'items/delete', '');
  }

  doneItem(item: Item) {
    let status = '';
    if (item.status === 'DONE') {
      status = 'OPEN';
    } else { status = 'DONE';
  }
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const body = new HttpParams().set('status', status);
    return this.http.patch(this.serverUrl + `/items/${item.id}/status`, body, { headers } );
  }

  clearList() {
    return this.http.post(this.serverUrl + 'items/deleteall', '');
  }

}
