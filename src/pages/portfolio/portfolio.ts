import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CurrencyProvider} from "../../providers/currency";
import {DetailsPage} from "../details/details";
import { FormatProvider } from '../../providers/format';

@Component({
  selector: 'portfolio-home',
  templateUrl: 'portfolio.html'
})
export class PortfolioPage {

  constructor(private navCtrl: NavController, private currencyService: CurrencyProvider,
        public formatService: FormatProvider) {
  }

  goToDetailsPage(currency) {
    this.navCtrl.push(DetailsPage, {currency});
  }

  ionViewDidEnter() {
    this.currencyService.loadTokens();
  }
}
