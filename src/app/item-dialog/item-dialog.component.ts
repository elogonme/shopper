import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Item} from '../model/item';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CATEGORIES} from '../model/categories';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.css']
})
export class ItemDialogComponent implements OnInit {

  form: FormGroup;
  item: Item;
  categories = CATEGORIES;

  constructor(
    private router: Router, private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) item: Item) {
    this.item = item;
    this.form = fb.group( {
        description: [item.description, [Validators.minLength(1),
          Validators.maxLength(20), Validators.required]],
        unit: [item.unit, [Validators.minLength(1),
          Validators.maxLength(5)]],
        quantity: [item.quantity, [Validators.pattern('[0-9]*'), Validators.minLength(1),
          Validators.maxLength(5), Validators.required]],
        category: [item.category],
        shopId: [item.shopId, [Validators.minLength(1), Validators.maxLength(20),
          Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  save(){
    const changes: Partial<Item> = {
      ...this.form.value
    };
    this.dialogRef.close(changes);
  }

  close(){
    this.dialogRef.close();
  }

}
