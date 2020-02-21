import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultipassService {
  apiLink = 'http://10.109.195.234:5000';
  constructor(private http: HttpClient) {}

  chargeMultiPass(cardCode, posID, basket) {

    return new Promise((res, rej) => {
      this.http
        .get(`${this.apiLink}/soap?cardcode=${cardCode}&posid=${posID}&tenbisparams=${JSON.stringify(basket)}`)
        .subscribe(response => {
          res(response);
        });
    });
  }
}
