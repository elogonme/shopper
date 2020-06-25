import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
// key that is used to access the data in local storageconst STORAGE_KEY = 'local_todolist';
@Injectable()
export class DBStorageService {
  anotherTodolist = [];

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }

  public storeOnLocalStorage(taskTitle: string) {
    // get array of tasks from local storage
    const currentTodoList = this.storage.get('ITEMS') || [];
    // push new task to array
    currentTodoList.push({
      title: taskTitle,
      isChecked: false
    });
    // insert updated array to local storage
    this.storage.set('ITEMS', currentTodoList);
    console.log(this.storage.get('ITEMS') || 'LocaL storage is empty');

  }
}
