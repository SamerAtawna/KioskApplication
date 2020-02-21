import { Router } from '@angular/router';
import { Injectable } from "@angular/core";
import { UserIdleService } from "angular-user-idle";

@Injectable({
  providedIn: "root"
})
export class IdleService {
  constructor(private userIdle: UserIdleService, private router: Router) {}

  startWatching() {
    console.log("startWatching()");
    this.userIdle.startWatching();
  }

  onTimerStart() {
    this.userIdle.onTimerStart().subscribe(count => console.log(count));
  }

  onTimeOut() {
    this.userIdle.onTimeout().subscribe(() => console.log("Time is up!"));
  }

  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }
}
