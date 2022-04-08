import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    private salt = environment.privateStorageKey;

    public setValueFromLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, this.encrypt(JSON.stringify(data)));
    }

    public getValueFromLocalStorage(key: string, logResult: boolean = false): any {
        const resultStorage = localStorage.getItem(key);
        if (!resultStorage)
            return null;
        if(logResult)
            console.log(JSON.parse(this.decrypt(resultStorage)));
        return JSON.parse(this.decrypt(resultStorage));
    }

    public removeFromStorage(key: string): void {
        localStorage.removeItem(key);
    }

    private encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.salt.trim()).toString();
    }

    private decrypt(textToDecrypt: string): any {
        return CryptoJS.AES.decrypt(textToDecrypt, this.salt.trim()).toString(CryptoJS.enc.Utf8);
    }
}
