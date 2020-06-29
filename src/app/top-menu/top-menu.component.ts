import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemsService } from '../services/items.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  constructor(private itemsService: ItemsService,
              private dialog: MatDialog,
              private router: Router, private route: ActivatedRoute) { }

  loggedIn$: Observable<number>;

  ngOnInit(): void {
    this.loggedIn$ = this.itemsService.itemsLength$;
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

    dialogRef.afterClosed().subscribe(confirm => { if (confirm === 'yes') {
      this.itemsService.clearList().subscribe();
      this.itemsService.initItems();
    }
  });
    this.router.navigateByUrl('/home');
  }
}
