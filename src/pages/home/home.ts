import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {PortfolioProvider} from "../../providers/portfolio/portfolio";
import {MoneyPage} from "../money/money";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  moneys: String[];

  constructor(private navCtrl: NavController, private moneyService: PortfolioProvider) {
  }

  ngOnInit(): void {
    this.moneys = this.moneyService.getMyMoneyList()
  }

  goToMoneyPage(money: String) {
    this.navCtrl.push(MoneyPage, {money})
  }
}
