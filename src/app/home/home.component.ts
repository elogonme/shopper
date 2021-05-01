import { Component, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from '../services/items.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ItemsDatasource } from '../model/items.datasource';

import { Observable } from 'rxjs';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  tabs$: Observable<string[]>; // ['New Item', 'Shopping List'];
  selected = new FormControl(0);
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

  constructor(private itemsService: ItemsService) {}

  async ngOnInit() {
    this.tabs$ = await this.itemsService.getShops();
    this.selected.setValue(1);
    this.tabGroup.selectedIndex = 1;
    console.log('getting shops');
  }
}
