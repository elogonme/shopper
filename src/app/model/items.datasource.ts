
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Item} from './item';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ItemsService} from '../services/items.service';
import {catchError, finalize} from 'rxjs/operators';

export class ItemsDatasource implements DataSource<Item> {

  private itemsSubject = new BehaviorSubject<Item[]>([]);
  public itemsList$ = this.itemsSubject.asObservable();
  private pageLength$ = new Observable<number>();

  constructor(private itemsService: ItemsService) {
  }
  loadItems(shopId: string = 'all',
            filter: string = '',
            sortDirection: string = 'asc',
            pageIndex: number = 0,
            pageSize: number = 1000,
            ): Observable<number> {

  this.itemsService.itemsList$
  .subscribe(items => {

    if (shopId !== 'Shopping List') {
      items = Object.values(items).filter(itemFilter => itemFilter.shopId === shopId).sort((l1, l2) => l1.id - l2.id);
    } else {
      items = Object.values(items).sort((l1, l2) => l1.id - l2.id);
    }

    if (filter) {
      items = items.filter(item => item.shopId.trim().toLowerCase().search(filter.toLowerCase()) >= 0);
    }

    items.sort((a, b) => a.shopId.localeCompare(b.shopId)); // sort data by shopId ascending by default

    if (sortDirection === 'desc') {
      items = items.reverse();
    }

    this.pageLength$ = of(items.length);

    const initialPos = pageIndex * pageSize;

    const itemsPage = items.slice(initialPos, initialPos + pageSize);

    this.itemsSubject.next(itemsPage);
    });
  return this.pageLength$;
  }

  connect(collectionViewer: CollectionViewer): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.itemsSubject.complete();
  }
}
