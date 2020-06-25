import {Component, OnInit} from '@angular/core';
import {ItemsService} from './services/items.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shopper';
  constructor() {}

  ngOnInit() {
  }

}
