import { Component, OnInit } from '@angular/core';
import { ItemsService } from '../services/items.service';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {ItemsDatasource} from '../model/items.datasource';
import {Item} from '../model/item';
import {Subscription, Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  tabs$: Observable<string[]>; // ['New Item', 'Shopping List'];
  selected = new FormControl(0);

  constructor(private itemsService: ItemsService) {}

  ngOnInit() {
    this.selected.setValue(1);
    this.tabs$ = this.itemsService.getShops();
    console.log('getting shops');
  }
}

