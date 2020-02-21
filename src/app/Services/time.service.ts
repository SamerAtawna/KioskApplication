import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimeService {
  constructor() {}

  getHour(time: string) {
    return parseInt(time.slice(time.indexOf("T") + 1, time.indexOf("T") + 3));
  }
  getMinute(time: string) {
    return parseInt(time.slice(time.indexOf("T") + 4, time.indexOf("T") + 6));
  }
  addZero(num) {
    return num < 10 ? "0" + num : num;
  }
}
