import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from '../../../../environments/environment';
import { EdrivingCargoModel } from "../../models/EdrivingCargo/EdrivingCargo.model";


@Injectable({
    providedIn: 'root',
})
export class EdrivingCargoService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }

    headers: HttpHeaders = new HttpHeaders({
        "Content-Type": "application/json"
    });

    buscarCargo(): Observable<EdrivingCargoModel[]> {

        const url_api = environment.auth.url + '/EdrivingCargo';
        return this.http
            .get<EdrivingCargoModel[]>(
                url_api,
                { headers: this.headers }
            )
            .pipe(map(data => { console.log("No Servico"); console.log(data); return data; }
            ));
    }

    obterTodos(): Observable<EdrivingCargoModel[]> {
        return this.http
            .get<EdrivingCargoModel[]>(environment.auth.url + "/EdrivingCargo")
            .pipe(map(data => {
                console.log("AQUI")
                console.log(data);
                return data;
            }
            ));
    }

}