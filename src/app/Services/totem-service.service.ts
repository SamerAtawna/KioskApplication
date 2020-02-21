import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject, interval } from "rxjs";
const apiLink = "http://10.109.195.234:5000";

@Injectable({
  providedIn: "root"
})
export class TotemServiceService {
  public resSub = new Subject<any>();
  public basketSubject = new Subject<any>();
  public selectedRes;


  constructor(private http: HttpClient) {}

  getResturants() {
    return new Promise((res, rej) => {
      this.http.get(`${apiLink}/getresturants`).subscribe(data => {
        res(data);
      });
    });
  }

  getMenu(restId) {
    return new Promise((res, rej) => {
      this.http.get(`${apiLink}/products?resid=${restId}`).subscribe(data => {
        res(data);
      });
    });
  }

  setResId(id) {
    console.log("id from setRes", id);
    this.selectedRes = id;
    this.resSub.next(id);
  }

  getAdditionals(id) {
    console.log("service get additon");
    return new Promise((res, rej) => {
      this.http.get(`${apiLink}/getaddition?prodid=${id}`).subscribe(d => {
        console.log(d);
        res(d);
      });
    });
  }
}
