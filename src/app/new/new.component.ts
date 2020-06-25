import {Component, OnInit} from '@angular/core';
import {Item} from '../model/item';
import {ItemsService} from '../services/items.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CATEGORIES} from '../model/categories';
import { of } from 'rxjs/internal/observable/of';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { startWith, first } from 'rxjs/operators';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {
  form: FormGroup;
  item = new Item();
  categories = CATEGORIES;
  lastShopId = '';
  lastCategory = '';
  options: string[];
  loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private itemsService: ItemsService,
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder) {

    this.form = fb.group( {
      description: [this.item.description, [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(1),
        Validators.maxLength(20), Validators.required]],
      unit: [this.item.unit, [Validators.pattern('[a-zA-Z ]*'), Validators.minLength(1),
        Validators.maxLength(5)]],
      quantity: [this.item.quantity, [Validators.pattern('[0-9]*'), Validators.minLength(1),
        Validators.maxLength(5), Validators.required]],
      category: [this.item.category, [Validators.pattern('[a-zA-Z ]*'),
        Validators.minLength(1), Validators.maxLength(20)]],
      shopId: [this.item.shopId, [Validators.minLength(1), Validators.maxLength(20),
        Validators.required]],
    });
  }

  filteredOptions$: Observable<string[]>;
  itemSaved = 'hidden';

  ngOnInit(): void {
    this.itemsService.shopsList$.subscribe(shopsList => this.options = [...shopsList]);
    this.options = this.options.splice(2);
  }

  save(){
    this.loading$.next(true);
    this.itemsService.addItem(this.form.value).subscribe(
      result => console.log('add service returned', result),
      (err) => console.log(err),
      () => { this.itemSaved = 'visible';
              this.itemsService.initItems();
              setTimeout(() => {this.itemSaved = 'hidden'; }, 2000);
              this.loading$.next(false);
      }
    );
    this.lastShopId = this.form.value.shopId;
    this.lastCategory = this.form.value.category;
    this.form.setValue({description: '', unit: 'pcs', quantity: 1, category: this.lastCategory, shopId: this.lastShopId});
    this.router.navigateByUrl('/home');

  }

  filterShops() {
    this.form.valueChanges
    .subscribe(changes => {
      const shopSearch = changes.shopId;
      if (shopSearch) {
        const filteredOptions = this.options.filter(shopFilter => shopFilter.trim().toLowerCase().search(shopSearch.toLowerCase()) >= 0);
        this.filteredOptions$ = of(filteredOptions);
      } else { this.filteredOptions$ = of(this.options); }
    });
  }
}
