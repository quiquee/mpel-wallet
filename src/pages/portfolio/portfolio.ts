import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailsPage } from "../details/details";
import { TransferPage } from "../transfer/transfer";
import { AccountProvider } from "../../providers/account";
import { CurrencyProvider } from "../../providers/currency";
import { FormatProvider } from '../../providers/format';

@Component({
  selector: 'portfolio-home',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {

  constructor(private navCtrl: NavController, private currencyService: CurrencyProvider,
    public accountProvider: AccountProvider, public formatService: FormatProvider) {
  }

  startTransfer(currency, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { currency });
  }

  goToDetailsPage(currency) {
    this.navCtrl.push(DetailsPage, { currency });
  }

  ionViewDidEnter() {
    this.currencyService.loadTokens();
  }
}
