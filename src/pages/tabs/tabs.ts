import {Component} from '@angular/core';
import {AccountsPage} from '../accounts/accounts';
import {PortfolioPage} from '../portfolio/portfolio';
import {SettingsPage} from "../settings/settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tabsRoot = [ PortfolioPage, AccountsPage, SettingsPage];

  constructor() {
  }
}
