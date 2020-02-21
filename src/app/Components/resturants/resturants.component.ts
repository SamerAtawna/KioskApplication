import { IdleService } from "./../../Services/idle.service";
import { TimeService } from "./../../Services/time.service";
import { TotemServiceService } from "./../../Services/totem-service.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import swal from "sweetalert2";
import { startWith } from "rxjs/operators";
import { interval, Observable, Subscription } from "rxjs";
import { UserIdleService } from "angular-user-idle";

@Component({
  selector: "app-resturants",
  templateUrl: "./resturants.component.html",
  styleUrls: ["./resturants.component.scss"]
})
export class ResturantsComponent implements OnInit {
  picServer = "http://10.186.116.56/mcdonalds/pics/";
  resturants;
  message;
  source = interval(10000);
  lastUpdate = "02/02/2020";
  y = new Date();
  year = this.y.getFullYear();

  subscriber: Subscription;
  constructor(
    private totem: TotemServiceService,
    private router: Router,
    public spinner: NgxSpinnerService,
    public time: TimeService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit() {
    this.getRest();
    console.log("yearr ", this.year);
  }
  getRest() {
    console.log("getting rest");
    this.spinner.show().then(async () => {
      this.subscriber = this.source.pipe(startWith(0)).subscribe(s => {
        this.totem.getResturants().then(res => {
          console.log(res);
          this.resturants = res;
          this.spinner.hide();
        });
      });
    });
  }
  goMenu(id) {
    const startHour = this.time.getHour(id.StartTime);
    const endHour = this.time.getHour(id.EndTime);
    const startMinute = this.time.getMinute(id.StartTime);
    const endMinute = this.time.getMinute(id.EndTime);
    console.log(startHour, startMinute, endHour, endMinute);
    const now = new Date();
    const currDay = now.getDay();
    const currHour = now.getHours();
    const currMinute = now.getMinutes();
    console.log(
      startHour,
      startMinute,
      endHour,
      endMinute,
      currHour,
      currMinute
    );

    const opened =
      currDay >= 0 &&
      currDay <= 4 &&
      currHour >= startHour &&
      currHour <= endHour;
    if (opened) {
      if (currMinute < startMinute) {
        swal.fire(
          "המסעדה סגורה",
          `שעות פתיחה ${this.time.addZero(startHour)}:${this.time.addZero(
            startMinute
          )} - ${this.time.addZero(endHour)}:${this.time.addZero(endMinute)}`,
          "error"
        );
        return;
      }
      this.subscriber.unsubscribe(); // Unsubscribe and proceed to menu
      console.log("--unsubscribed--");
    } else {
      swal.fire(
        "המסעדה סגורה",
        `שעות פתיחה ${this.time.addZero(startHour)}:${this.time.addZero(
          startMinute
        )} - ${this.time.addZero(endHour)}:${this.time.addZero(endMinute)}`,
        "error"
      );
      return;
    }

    console.log("selected id", id);

    setTimeout(() => {
      this.totem.setResId(id);
    }, 0);
    this.userIdle.startWatching();


    this.router.navigateByUrl("/menu");
  }

  ionViewWillLeave() {}
}
