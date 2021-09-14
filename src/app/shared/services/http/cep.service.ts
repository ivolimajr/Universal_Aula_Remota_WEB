import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {Endereco} from '../../models/endereco.model';
import {Observable} from 'rxjs';

export interface CEPMODEL {
    bairro: string; //"Ceilândia Sul (Ceilândia)"
    cep: string; //"72235-621"
    complemento: string; //""
    localidade: string; //"Brasília"
    logradouro: string; //"QNP 26 Conjunto U"
    uf: string; //DF
}

@Injectable({
    providedIn: 'root'
})
export class CepService {
    headers = new HttpHeaders();
    header = this.headers;

    private httpClient: HttpClient;
    private endereco = new Endereco();

    constructor(private httpBackend: HttpBackend) {
        this.httpClient = new HttpClient(httpBackend);
    }

    buscar(cep: string): Observable<CEPMODEL> {
        return this.httpClient.get<CEPMODEL>(`//viacep.com.br/ws/${cep}/json/`);
    }

}
