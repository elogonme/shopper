import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { HomeComponent } from './home/home.component';
import { NewComponent } from './new/new.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { ItemDialogComponent } from './item-dialog/item-dialog.component';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { ItemsService } from './services/items.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { StorageServiceModule } from 'ngx-webstorage-service';
import { UserComponent } from './user/user.component';
import { UserService } from './services/user.service';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';

const dbConfig: DBConfig = {
  name: 'itemsDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'items',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'unit', keypath: 'unit', options: { unique: false } },
        { name: 'quantity', keypath: 'quantity', options: { unique: false } },
        { name: 'category', keypath: 'category', options: { unique: false } },
        { name: 'shopId', keypath: 'shopId', options: { unique: false } },
        { name: 'status', keypath: 'status', options: { unique: false } },
        { name: 'user', keypath: 'user', options: { unique: false } },
        { name: 'userId', keypath: 'userId', options: { unique: false } },
      ],
    },
  ],
};

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    HomeComponent,
    NewComponent,
    ItemlistComponent,
    ItemDialogComponent,
    UserComponent,
    DeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatTableModule,
    MatCheckboxModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    StorageServiceModule,
    NgxIndexedDBModule.forRoot(dbConfig),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [
    ItemsService,
    UserService,
    { provide: MatDialogRef, useValue: {} },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
