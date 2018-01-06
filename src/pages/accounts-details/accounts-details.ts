import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AccountProvider} from '../../providers/account';
import { FormatProvider } from '../../providers/format';
import { TransferPage } from "../transfer/transfer";
import { Account } from '../../model/account';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-accounts-details',
  templateUrl: 'accounts-details.html',
})
export class AccountsDetailsPage {
  showKey:string = "pubKey";
  account = new Account(null, null, null);

  scannedCode = null;

  constructor(private accountProvider: AccountProvider, 
    private barcodeScanner: BarcodeScanner,
    public formatProvider: FormatProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    //  this.account.name = 'Enrique NOHODL, USE!';
    //  this.pubKey = '0xf40d14d0B1E06833826f6c3cE27F5CE9b27d4DB5';
    //  this.pubKey = accountProvider.activeAccount().pKey;
  }

  scanCode() {
    console.log(this.barcodeScanner);
    this.barcodeScanner.scan().then(barcodeData => {
      console.log(barcodeData);
      this.scannedCode = barcodeData.text;
    })
  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { token });
  }

  ionViewWillEnter() {
    this.account = this.navParams.get('account');
  }
}
