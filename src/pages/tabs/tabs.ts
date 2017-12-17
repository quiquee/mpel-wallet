import {Component} from '@angular/core';
import {AccountsPage} from '../accounts/accounts';
import {PortfolioPage} from '../portfolio/portfolio';
import {TransferPage} from '../transfer/transfer';
import {SettingsPage} from "../settings/settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabsRoot = [ PortfolioPage, TransferPage, AccountsPage, SettingsPage];

  constructor() {
  }
}
