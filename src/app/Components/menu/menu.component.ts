import { Ingredient } from "./../../Interfaces/ingredient";
import { Basket } from "./../../Interfaces/basket";
import { TotemServiceService } from "./../../Services/totem-service.service";
import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { MatHorizontalStepper, MatStep } from "@angular/material/stepper";
import { MatCheckbox } from "@angular/material/checkbox";
import { SwalComponent } from "@sweetalert2/ngx-sweetalert2";
import swal from "sweetalert2";
import { Lightbox, LightboxConfig } from "ngx-lightbox";

import {
  MatDialogConfig,
  MatDialog,
  MatSelectionListChange,
  MatListOption,
  MatRadioChange
} from "@angular/material";
import { PaymentComponent } from "../payment/payment.component";
import { CdkStep } from "@angular/cdk/stepper";
import { Router } from "@angular/router";
import { UserIdleService } from "angular-user-idle";
import { timer } from "rxjs";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  lastUpdate = "02/02/2020";
  y = new Date();
  year = this.y.getFullYear();
  menu;
  subscriber;
  selectedBadge;
  resturant;
  counter;
  paymentEnabled = false;
  defaultImage = "../../../assets/placeholder.png";
  additionMsg = "";
  mealAlbum: Array<any> = [];
  basket: Basket = {
    mealName: "",
    mealNumber: 0,
    ingredients: [],
    empNumber: "",
    isTakeAway: false
  };
  selectedCount = {
    additionals: 0,
    firstMeal: 0,
    meal: 0,
    sauce: 0,
    last: 0,
    bread: 0,
    extraAdditions: 0
  };
  picServer = "http://10.186.116.56/mcdonalds/pics/";
  selectedProd;
  additionals = {
    numberOfAdditions: 0,
    numOfFirstMeal: 0,
    numOfMeal: 0,
    numOfSauce: 0,
    numOfBread: 0,
    numOfExtraAdditionals: 0,
    favorites: [],
    additions: [],
    firstMeal: [],
    lastMeal: [],
    souces: [],
    extraAdditions: [],
    isMeal: [],
    isBread: []
  };
  isTakeAway = false;

  constructor(
    private spinner: NgxSpinnerService,
    private totem: TotemServiceService,
    private zone: NgZone,
    private dialog: MatDialog,
    private router: Router,
    private userIdle: UserIdleService,
    private _lightbox: Lightbox,
    private _lightboxConfig: LightboxConfig
  ) {
    this._lightboxConfig.positionFromTop = 500;
  }

  ngOnInit() {
    this.spinner.show().then(async () => {
      this.subscriber = this.totem.resSub.subscribe(async rest => {
        this.resturant = rest;
        await this.getMenu(rest.resid).then((data: Array<any>) => {
          this.menu = data;

          console.log("data menu", data);
          data.forEach((meal, i) => {
            const obj = {
              src: this.picServer + meal.pic,
              caption: meal.Description
            };
            this.mealAlbum.push(obj);
          });
          console.log("album ----> ", this.mealAlbum);
          this.spinner.hide();
        });
      });
    });
    this.userIdle.onTimerStart().subscribe(count => {
      console.log(count);
      this.counter = count;
      if (count == 1) {
        swal
          .fire({
            title: `חוזר למסך ראשי`,
            icon: "info",
            timer: 6000,
            timerProgressBar: true,
            confirmButtonText: "ביטול"
          })
          .then(res => {
            this.dialog.closeAll();
            console.log(res.dismiss);
            if (res.dismiss) {
              this.userIdle.resetTimer();
              return;
            }
          });
      }
    });
    this.userIdle.onTimeout().subscribe(() => {
      console.log("time out");
      this.userIdle.stopWatching();
      this.router.navigateByUrl("/rest");
    });
  }

  countDown(count) {}
  getMenu(id) {
    return new Promise((res, rej) => {
      this.spinner.show().then(async () => {
        await this.totem.getMenu(id).then(m => {
          this.spinner.hide();
          console.log(this.additionals);
          res(m);
        });
      });
    });
  }
  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  enableAdditionals(
    stepper: MatHorizontalStepper,
    id,
    name,
    numAdditions,
    numOfFirstMeal,
    numOfMeal,
    numOfSauce,
    numOfBread,
    numOfExtra,
    additionMessage
  ) {
    if (this.selectedProd == id) {
      stepper.steps.first.completed = true;
      stepper.next();
      return;
    }
    this.additionMsg = additionMessage;
    this.basket.ingredients = [];
    console.log("numextra ", numOfExtra);
    this.selectedProd = id;
    this.basket.mealName = name;
    this.basket.mealNumber = this.selectedProd;
    this.additionals.numberOfAdditions = numAdditions;
    this.additionals.numOfFirstMeal = numOfFirstMeal;
    this.additionals.numOfMeal = numOfMeal;
    this.additionals.numOfSauce = numOfSauce;
    this.additionals.numOfBread = numOfBread;
    this.additionals.numOfExtraAdditionals = numOfExtra;
    this.getAdditions();
    stepper.steps.first.completed = true;
    stepper.next();
    console.log(stepper);
  }

  enablePayment(stepper: MatHorizontalStepper) {
    if (this.additionals.additions.length > 1) {
      if (
        this.selectedCount.additionals != this.additionals.numberOfAdditions
      ) {
        swal.fire(
          "שים לב",
          `יש לבחור ${this.additionals.numberOfAdditions} תוספות`,
          "error"
        );
        return;
      }
    }
    if (this.additionals.souces.length > 1) {
      if (this.selectedCount.sauce != this.additionals.numOfSauce) {
        swal.fire(
          "שים לב",
          `יש לבחור ${this.additionals.numOfSauce} רטבים`,
          "error"
        );
        return;
      }
    }
    if (this.additionals.extraAdditions.length > 1) {
      if (
        this.selectedCount.extraAdditions !=
        this.additionals.numOfExtraAdditionals
      ) {
        swal.fire(
          "שים לב",
          `יש לבחור ${this.additionals.numOfExtraAdditionals} תוספות בצד`,
          "error"
        );
        return;
      }
    }
    if (this.additionals.firstMeal.length > 1) {
      if (this.selectedCount.firstMeal != this.additionals.numOfFirstMeal) {
        swal.fire(
          "שים לב",
          `יש לבחור ${this.additionals.numOfFirstMeal} מנה ראשונה`,
          "error"
        );
        return;
      }
    }
    if (this.additionals.isMeal.length > 1) {
      if (this.selectedCount.meal != this.additionals.numOfMeal) {
        swal.fire(
          "שים לב",
          `יש לבחור ${this.additionals.numOfMeal} מנה עיקרית`,
          "error"
        );
        return;
      }
    }
    stepper.steps.map((s: MatStep) => {
      console.log(s);
      s.completed = true;
    });

    stepper.next();
  }

  async getAdditions() {
    this.additionals.additions = [];
    this.additionals.souces = [];
    this.additionals.favorites = [];
    this.selectedCount.additionals = 0;

    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
    await this.totem
      .getAdditionals(this.selectedProd)
      .then((data: Array<any>) => {
        console.log("additions: ", data);
        this.additionals.additions = data.filter(item => {
          return (
            item.IsFavorite == null &&
            item.IsSauce != 1 &&
            item.IsMeal != 1 &&
            item.IsFirstMeal != 1 &&
            item.isBread != 1 &&
            item.extraAddition != 1 &&
            item.IsAvaliable == 1
          );
        });
        this.additionals.souces = data.filter(item => {
          return item.IsSauce !== null;
        });
        this.additionals.favorites = data.filter(item => {
          return (
            item.IsFavorite == 1 && item.isBread != 1 && item.IsAvaliable == 1
          );
        });
        this.additionals.firstMeal = data.filter(item => {
          return item.IsFirstMeal == 1;
        });
        this.additionals.isMeal = data.filter(item => {
          return item.IsMeal == 1;
        });
        this.additionals.isBread = data.filter(item => {
          return item.isBread == 1;
        });
        this.additionals.extraAdditions = data.filter(item => {
          return (
            item.IsFavorite == null &&
            item.IsSauce != 1 &&
            item.IsMeal != 1 &&
            item.IsFirstMeal != 1 &&
            item.isBread != 1 &&
            item.IsAvaliable == 1 &&
            item.extraAddition == 1
          );
        });
      });
    console.log("this.additions", this.additionals);
  }

  updateSelectedCount(count: number) {
    // additionals limit
    this.selectedCount.additionals = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }
  updateSelectedCountSauce(count: number) {
    // additionals limit
    this.selectedCount.sauce = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }
  updateSelectedCountMeal(count: number) {
    // additionals limit
    this.selectedCount.meal = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }
  updateSelectedCountFirstMeal(count: number) {
    // additionals limit
    this.selectedCount.firstMeal = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }
  updateSelectedCountBread(count: number) {
    // additionals limit
    this.selectedCount.bread = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }
  updateSelectedCountExtra(count: number) {
    // additionals limit
    this.selectedCount.extraAdditions = count;
    // swal.fire("הודעה",`מותר ${this.additionals.numberOfAdditions} תוספות`,"info");
  }

  changed(e, payStep: MatStep) {
    console.log("e.previouslySelectedIndex  ", e.previouslySelectedIndex);
    // if(e.selectedIndex == 2){
    //   this.enablePayment(e);

    // }
    if (e.previouslySelectedIndex == 1 && e.selectedIndex != 2) {
      // this.additionals.additions = [];
      // this.additionals.favorites = [];
      // this.additionals.souces = [];
    }
    if (e.previouslySelectedIndex == 2 && e.selectedIndex != 1) {
    }
    if (e.previouslySelectedIndex == 2) {
      console.log("payStep ", payStep);
      payStep.completed = false;
    }
  }
  openDialog(badge) {
    this.selectedBadge = badge;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "600px";
    dialogConfig.height = "600px";
    dialogConfig.data = {
      badge: this.selectedBadge,
      basket: this.basket,
      restLocal: this.resturant
    };
    dialogConfig.disableClose = false;

    this.dialog.open(PaymentComponent, dialogConfig);
  }

  updateBasket(e: MatSelectionListChange) {
    console.log(e);
    let insert = true;
    const obj: Ingredient = {
      number: e.option.value,
      name: e.option._text.nativeElement.outerText,
      additions: []
    };
    console.log("selected obj ", obj);

    this.basket.ingredients.forEach((item, i) => {
      console.log("item i ", item, i);
      if (obj.number == item.number) {
        console.log("deleting ", item.number, " on ", i);
        this.basket.ingredients.splice(i, 1);
        console.log("==> ", this.basket.ingredients);
        insert = false;
      }
    });
    insert == true ? this.basket.ingredients.push(obj) : "";
    console.log("==> ", this.basket.ingredients);
    // console.log("update basket", e.option.value);
    // console.log("update basket", e.option._text.nativeElement.outerText);
    insert = true;
  }

  reloadWindow() {
    // this.spinner.show().then(() => {
    //   location.reload();
    // });
    this.router.navigateByUrl("rest");
  }

  doo(e: MatListOption) {
    console.log(e.selected);
  }

  open(src) {
    console.log("image source:---> ", src);
    this._lightbox.open(this.mealAlbum, src);
  }

  setTA(e: MatRadioChange) {
    console.log(e);
    switch (e.value) {
      case "1":
        this.basket.isTakeAway = false;
        break;
      case "2":
        this.basket.isTakeAway = true;
        break;
    }
    console.log("isTakeAway ", this.basket.isTakeAway);
  }
}
