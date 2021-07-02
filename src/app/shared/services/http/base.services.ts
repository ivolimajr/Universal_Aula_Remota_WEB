import { HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { throwError } from "rxjs";
import { environment } from "src/environments/environment";

export abstract class BaseServices {
  protected UrlService: string = environment.apiUrl;

  protected ObterHeaderJson() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
  protected extractData(response: any) {
    return response.status || response;
  }
  protected serviceError(response: Response | any) {
    let customError: string[] = [];
    let customResponse = { error: { errors: [] } }

    if (response instanceof HttpErrorResponse) {

      if (response.statusText === "Unknown Error") {
        customError.push("Ocorreu um erro desconhecido");
        response.error.errors = customError;
      }
      if (response.statusText === "Bad Request") {
        customError.push("Valores Inválidos");
        response.error.errors = customError;
      }
    }
    if (response.status === 400) {
      customError.push("Valores Invalidos");

      // Erros do tipo 500 não possuem uma lista de erros
      // A lista de erros do HttpErrorResponse é readonly                
      customResponse.error.errors = customError;
      return throwError(customResponse);
    }
    if (response.status === 404) {
      customError.push("Nenhum resultado encontrado");

      // Erros do tipo 500 não possuem uma lista de erros
      // A lista de erros do HttpErrorResponse é readonly                
      customResponse.error.errors = customError;
      return throwError(customResponse);
    }
    if (response.status === 500) {
      customError.push("Ocorreu um erro no processamento, tente novamente mais tarde ou contate o nosso suporte.");

      // Erros do tipo 500 não possuem uma lista de erros
      // A lista de erros do HttpErrorResponse é readonly                
      customResponse.error.errors = customError;
      return throwError(customResponse);
    }

    console.error(response.error);
    return throwError(response);
  }
}