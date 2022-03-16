import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

export interface CEPMODEL {
    cep: string; //"72235-621"
    bairro: string; //"Ceilândia Sul (Ceilândia)"
    logradouro: string; //"QNP 26 Conjunto U"
    localidade: string; //"Brasília"
    uf: string; //DF
    complemento: string; //""
}

@Injectable({
    providedIn: 'root'
})
export class CepService {
    headers = new HttpHeaders();
    header = this.headers;

    private httpClient: HttpClient;
    constructor(private httpBackend: HttpBackend) {
        this.httpClient = new HttpClient(httpBackend);
    }

    getCep(cep: string): Observable<CEPMODEL> {
        return this.httpClient.get<CEPMODEL>(`//viacep.com.br/ws/${cep}/json/`);
    }

}
