import { Component, OnInit } from '@angular/core';
import { Item } from '../model/item';
import { ItemsService } from '../services/items.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CATEGORIES } from '../model/categories';
import { of } from 'rxjs/internal/observable/of';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import { startWith, first } from 'rxjs/operators';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css'],
})
export class NewComponent implements OnInit {
  constructor(
    private itemsService: ItemsService,
    private dbService: NgxIndexedDBService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      description: [
        this.item.description,
        [
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.required,
        ],
      ],
      unit: [
        this.item.unit,
        [Validators.minLength(1), Validators.maxLength(5)],
      ],
      quantity: [
        this.item.quantity,
        [
          Validators.pattern('[0-9]*'),
          Validators.minLength(1),
          Validators.maxLength(5),
          Validators.required,
        ],
      ],
      category: [
        this.item.category,
        [
          Validators.pattern('[a-zA-Z ]*'),
          Validators.minLength(1),
          Validators.maxLength(20),
        ],
      ],
      shopId: [
        this.item.shopId,
        [
          Validators.minLength(1),
          Validators.maxLength(20),
          Validators.required,
        ],
      ],
    });
  }

  form: FormGroup;
  item = new Item();
  categories = CATEGORIES;
  lastShopId = '';
  lastCategory = '';
  options: string[];
  loading$ = new BehaviorSubject<boolean>(false);
  filteredOptions$: Observable<string[]>;
  itemSaved = 'hidden';
  itemSavedLocal = 'hidden';

  ngOnInit(): void {
    this.itemsService.shopsList$.subscribe(
      (shopsList) => (this.options = [...shopsList])
    );
    this.options = this.options.splice(2);
    this.form.get('category').setValue('Groceries');
    this.form.get('quantity').setValue('1');
    this.form.get('unit').setValue('pcs');
    this.form.get('shopId').setValue('');
  }

  save() {
    this.loading$.next(true);
    const newitem = this.form.value;
    this.itemsService.addItem(this.form.value).subscribe(
      (result) => console.log('add service returned', result),
      (err) => {
        console.log('server offline, saving to indexDB');
        this.dbService.add('items', newitem);
        this.loading$.next(false);
        this.itemSavedLocal = 'visible';
        this.itemsService.initItems();
        setTimeout(() => {
          this.itemSavedLocal = 'hidden';
        }, 4000);
      },
      () => {
        this.itemSaved = 'visible';
        this.itemsService.initItems();
        setTimeout(() => {
          this.itemSaved = 'hidden';
        }, 4000);
        this.loading$.next(false);
      }
    );
    this.lastShopId = this.form.value.shopId;
    this.lastCategory = this.form.value.category;
    this.form.setValue({
      description: '',
      unit: 'pcs',
      quantity: 1,
      category: this.lastCategory,
      shopId: this.lastShopId,
    });
    this.router.navigateByUrl('/home');
  }

  filterShops() {
    this.form.valueChanges.subscribe((changes) => {
      const shopSearch = changes.shopId;
      if (shopSearch) {
        const filteredOptions = this.options.filter(
          (shopFilter) =>
            shopFilter.trim().toLowerCase().search(shopSearch.toLowerCase()) >=
            0
        );
        this.filteredOptions$ = of(filteredOptions);
      } else {
        this.filteredOptions$ = of(this.options);
      }
    });
  }
}
