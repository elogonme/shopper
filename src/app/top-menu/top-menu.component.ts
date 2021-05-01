import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../services/items.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Observable, Observer, fromEvent, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Item } from '../model/item';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css'],
})
export class TopMenuComponent implements OnInit {
  constructor(
    private itemsService: ItemsService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: NgxIndexedDBService
  ) {}

  loggedIn$: Observable<number>;

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  async bulkSave(items: Item[]) {
    this.itemsService.addBulkItems(items).subscribe(
      (result) => {
        console.log('add service returned', result);
        this.dbService.clear('items').subscribe((successDeleted) => {
          console.log('success? ', successDeleted);
        });
      },
      (err) => {
        console.log('error saving local data');
      }
    );
  }

  ngOnInit(): void {
    this.loggedIn$ = this.itemsService.itemsLength$;
    this.createOnline$().subscribe((isOnline) => {
      if (isOnline) {
        this.dbService.count('items').subscribe((itemCount) => {
          console.log('item count: ', itemCount);
          if (itemCount) {
            const subscription = this.dbService
              .getAll('items')
              .subscribe(async (items) => {
                await this.bulkSave(items as Item[]);
                // .then(() => {
                //   this.dbService.clear('items').subscribe((successDeleted) => {
                //     console.log('success? ', successDeleted);
                //   });
              });
            // .catch((err) => {
            //   console.log('unable to save data from IndexDB');
            // });
          }
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('authJwtToken');
    this.itemsService.clearItemsArray();
    this.router.navigateByUrl('/login');
  }

  clearList() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DeleteDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm === 'yes') {
        this.itemsService.clearList().subscribe();
        this.itemsService.initItems();
      }
    });
    this.router.navigateByUrl('/home');
  }
}
