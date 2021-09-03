import {Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    //set a chave para codificar e descodificar
    private salt = environment.privateStorageKey;

    /**
     * inserir no localstorage um JSON do data criptografado
     *
     * @param key
     * @param data
     * @return void
     */
    public setValueFromLocalStorage(key: string, data: any): void {
        localStorage.setItem(key, this.encrypt(JSON.stringify(data)));
        // localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     *  retorna do localstorage o data criptografado em forma de
     *  objeto buscando pela chave
     *
     * @param key
     * @return retorna um JSON descriptografadoobjeto descriptografado
     */
    public getValueFromLocalStorage(key: string): any {
        const resultStorage = localStorage.getItem(key);
        if (!resultStorage) {
            return null;
        }
        return JSON.parse(this.decrypt(resultStorage));
        // return JSON.parse(resultStorage);
    }

    /**
     * remove do localstorage a chave indicada
     *
     * @param key
     * @return void
     */
    public removeFromStorage(key: string): void {
        localStorage.removeItem(key);
    }

    /**
     * Encripta o valor passado por parametro
     *
     * @param value
     * @private
     */
    private encrypt(value: string): string {
        return CryptoJS.AES.encrypt(value, this.salt.trim()).toString();
    }

    /**
     * decripa o valor passado por parametro
     *
     * @param textToDecrypt
     * @private
     */
    private decrypt(textToDecrypt: string) {
        return CryptoJS.AES.decrypt(textToDecrypt, this.salt.trim()).toString(CryptoJS.enc.Utf8);
    }
}
