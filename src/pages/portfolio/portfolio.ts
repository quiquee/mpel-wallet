import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DetailsPage } from "../details/details";
import { TransferPage } from "../transfer/transfer";
import { AccountProvider } from "../../providers/account";
import { CurrencyProvider } from "../../providers/currency";
import { FormatProvider } from '../../providers/format';
import { Currency } from '../../model/currency';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'portfolio-home',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {
  error: string;
  private activeAccount;
  private allTokensSubscription;

  constructor(private navCtrl: NavController, private currencyProvider: CurrencyProvider,
    public accountProvider: AccountProvider, public formatService: FormatProvider) {
      this.activeAccount = this.accountProvider.activeAccount();
  }

  activeAccountCanSend(token) {
    let activeAccount = this.accountProvider.activeAccount();
    return activeAccount.pKey && token.balance > 0;
  }

  activeAccountBalance(token) {
    let activeAccount = this.accountProvider.activeAccount();
    return this.formatService.formatAmount(token.balance) + ' ' + token.currency.symbol;
  }

  startTransfer(token, event: FocusEvent) {
    event.stopPropagation();
    this.navCtrl.push(TransferPage, { token });
  }

  goToDetailsPage(token) {
    console.log(token);
    this.navCtrl.push(DetailsPage, { token });
  }

  ionViewDidEnter() {
    let activeAccount = this.accountProvider.activeAccount();
    this.allTokensSubscription = this.currencyProvider.allCurrencies
    .flatMap(currencies => {
      return Observable.from(currencies)
        .flatMap(currency => currency.balanceOf(activeAccount).map(balance =>
          <any>{
            currency: currency,
            balance: balance,
            transfers: []
          })
        ).toArray();
    })
    .subscribe(data => {
      activeAccount.portfolio = data;
      this.activeAccount = activeAccount;
    }, error => {
      console.error(error);
    });
  }

  ionViewDidLeave() {
    this.allTokensSubscription.unsubscribe();
  }
}
