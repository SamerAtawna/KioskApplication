import { Router } from '@angular/router';
import { MultipassService } from './../../Services/multipass.service';
import { TotemServiceService } from './../../Services/totem-service.service';
import { TenbisService } from './../../Services/tenbis.service';
import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MAT_DIALOG_DATA, MatRadioChange, MatDialog } from '@angular/material';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('bb', { static: false }) blueInput: ElementRef;
  @ViewChild('gb', { static: false }) greenInput: ElementRef;
  timer = null;
  badge;
  tenBisParams = {
    isGuest: false,
    guestType: 'none',
    sumToDebit: 39,
    pos: 0,
    resid: 0,
    wwid: '',
    basket: Object,
    resLocalId: 0,
    isTakeAway: false
  };
  multiPass = {
    posId: 0,
    cardCode: ''
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tenbis: TenbisService,
    private totem: TotemServiceService,
    private spinner: NgxSpinnerService,
    private multipass: MultipassService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log("new data", this.data);
    console.log('sel');
    this.badge = this.data.badge;
    this.tenBisParams.basket = this.data.basket;
    this.tenBisParams.resid = this.totem.selectedRes.TenBisID;
    this.tenBisParams.resLocalId = this.data.restLocal.resid;
    this.multiPass.posId = this.data.restLocal.MultiPassID;
  }

  onBlurBB(event) {
    console.log(event);
    this.blueInput.nativeElement.focus();
  }

  onBlurGB(event) {
    console.log(event);
    this.greenInput.nativeElement.focus();
  }

  processPayment(elem: HTMLInputElement) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log('w.value processPayment');
      this.pay(elem);
    }, 1000);
  }

  async pay(w: HTMLInputElement) {
    console.log('w.value ', w.value);
    this.tenBisParams.wwid = w.value;

    switch (this.badge) {
      case 'BB':
        if (w.value.indexOf('?') > -1 || w.value.length > 8) {
          swal.fire('שגיאה', 'מספר לא תקין', 'error');
          this.blueInput.nativeElement.value = '';
          return;
        }
        this.spinner.show().then(async () => {
          await this.tenbis.charge(this.tenBisParams).then(response => {
            if (response.Success == false) {
              swal.fire('שגיאה', `${response.Errors[0].ErrorDesc}`, 'error');
              w.value = '';
            } else if (response.Success == true) {
              swal.fire({
                title: 'ההזמנה נקלטה בתאבון !',
                text: 'נא להמתין להדפסת הקבלה',
                icon: 'success',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false,
                onClose: () => {
                  this.router.navigateByUrl('/rest');
                }
              }).then(() => {
                this.dialog.closeAll();
                this.router.navigateByUrl('/rest');
              });
            }
            this.spinner.hide();
          });
        });

        break;
      case 'GB':
        if (w.value.indexOf('%') > -1) {
          w.value = w.value.slice(4, w.value.length - 4);
        }
        if (w.value.replace(/[^0-9]/g, '').length < 10) {
          swal.fire('שגיאה', 'מספר לא תקין*', 'error');
          this.greenInput.nativeElement.value = '';
          return;
        }
        if (w.value.length < 10) {
          swal.fire('שגיאה', 'מספר לא תקין*', 'error');
          this.greenInput.nativeElement.value = '';
          return;
        }
        console.log('card number', w.value);

        this.multiPass.cardCode = w.value;
        this.tenBisParams.wwid = w.value;
        console.log(this.multiPass);
        this.spinner.show().then(async () => {
          await this.multipass
            .chargeMultiPass(
              this.multiPass.cardCode,
              this.multiPass.posId,
              this.tenBisParams
            )
            .then(response => {
              if (response[0].ResultId[0] != '0') {
                swal.fire('שגיאה', `${response[0].ErrorMessage[0]}`, 'error');
                w.value = '';
              } else if (response[0].ResultId[0] == '0') {
                swal.fire({
                  title: 'ההזמנה נקלטה בתאבון !',
                  text: 'נא להמתין להדפסת הקבלה',
                  icon: 'success',
                  timer: 3000,
                  timerProgressBar: true,
                  showConfirmButton: false,
                  onClose: () => {
                    this.router.navigateByUrl('/rest');
                  }
                }).then(() => {
                  this.dialog.closeAll();
                  this.router.navigateByUrl('/rest');
                });
              }
              console.log(response);
              this.spinner.hide();
            });
        });
        break;
    }
    console.log(this.tenBisParams);
  }

  setGuestMode(guestType: MatRadioChange) {
    if (guestType.value != 1) {
      this.tenBisParams.guestType = guestType.value;
      this.tenBisParams.isGuest = true;
    } else {
      this.tenBisParams.guestType = 'none';
      this.tenBisParams.isGuest = false;
    }
  }
}
