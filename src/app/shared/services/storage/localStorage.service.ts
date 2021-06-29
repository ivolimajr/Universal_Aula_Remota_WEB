import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageServices {

  public setAuthFromLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getAuthFromLocalStorage(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

  public removeFromStorage(key: string) {
    localStorage.removeItem(key);
  }


}