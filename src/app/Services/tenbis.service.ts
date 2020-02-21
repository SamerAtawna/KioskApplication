import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TenbisService {
  apiLink = "http://10.109.195.234:5000";
  constructor(public http: HttpClient) {}

  charge(params): Promise<any> {
    let dt = JSON.stringify(params);
    return new Promise((res, rej) => {
      this.http
        .get(`${this.apiLink}/chargetenbis?params=${dt}`)
        .subscribe((response: Response) => {
          console.log(response);
        res(response);
        });
    });
  }
}
