import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { Item } from '../model/item';
import { ItemsService } from '../services/items.service';
import { merge, Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ItemsDatasource } from '../model/items.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { delay, startWith, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ItemDialogComponent } from '../item-dialog/item-dialog.component';

@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.css'],
})
export class ItemlistComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private itemsService: ItemsService, private dialog: MatDialog) {}

  displayedColumns: string[] = [
    'done',
    'description',
    'quantity',
    'unit',
    'shopId',
    'delete',
  ];
  dataSource = new ItemsDatasource(this.itemsService);
  private subscription: Subscription;
  actionLoading$ = new BehaviorSubject<boolean>(false);
  loading$ = merge(this.itemsService.loading$, this.actionLoading$);
  pageLength: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() shopId: string;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updateTable();
  }

  editItem(item: Item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = item;

    const dialogRef = this.dialog.open(ItemDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((changes) => {
      if (!changes) {
        console.log('not changed');
      } else {
        this.actionLoading$.next(true);
        this.itemsService.updateItem(item.id, changes).subscribe(() => {
          this.itemsService.initItems();
          this.updateTable();
          console.log(`Item with ID "${item.id}" updated`);
        });
      }
    });
  }

  deleteItem(item: Item) {
    this.actionLoading$.next(true);
    this.itemsService.deleteItem(item).subscribe(
      () => {},
      (err) => console.log(err),
      () => {
        this.itemsService.initItems();
        this.updateTable();
        console.log(`Item with ID "${item.id}" deleted`);
      }
    );
  }

  doneItem(item: Item) {
    this.actionLoading$.next(true);
    this.itemsService.doneItem(item).subscribe(
      () => {},
      (err) => console.log(err),
      () => {
        this.itemsService.initItems();
        this.updateTable();
        console.log(`Item with ID "${item.id}" status changed`);
      }
    );
  }

  deleteChecked() {
    this.actionLoading$.next(true);
    this.itemsService.deleteChecked().subscribe(
      () => {},
      (err) => {
        this.actionLoading$.next(false);
        console.log(err);
      },
      () => {
        this.itemsService.initItems();
        this.updateTable();
      }
    );
  }

  updateTable() {
    this.dataSource = new ItemsDatasource(this.itemsService);
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    const length$ = this.dataSource.loadItems(
      this.shopId,
      '',
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
    this.subscription = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        // tslint:disable-next-line: deprecation
        startWith(null),
        delay(0),
        // Find length/number of Items in page table for paginator
        tap(() => {
          if (this.shopId !== 'Shopping List') {
            length$.subscribe((pages) => (this.pageLength = pages));
          } else {
            this.itemsService.itemsLength$.subscribe(
              (length) => (this.pageLength = length)
            );
          }
        })
      )
      .subscribe(() =>
        this.dataSource.loadItems(
          this.shopId,
          '',
          this.sort.direction,
          this.paginator.pageIndex,
          this.paginator.pageSize
        )
      );
  }

  ngOnDestroy(): void {
    //  this.subscription.unsubscribe();
  }
}
