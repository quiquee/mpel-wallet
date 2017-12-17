import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {MyApp} from './app.component';
import {AccountsPage} from "../pages/accounts/accounts";
import {PortfolioPage} from '../pages/portfolio/portfolio';
import {TabsPage} from '../pages/tabs/tabs';
import {TransferPage} from '../pages/transfer/transfer';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {SettingsPage} from "../pages/settings/settings";
import {AccountProvider} from '../providers/account';
import {FormatProvider} from '../providers/format';
import {CurrencyProvider} from '../providers/currency';
import {HttpClientModule} from "@angular/common/http";
import {DetailsPage} from "../pages/details/details";

@NgModule({
  declarations: [
    AccountsPage,
    MyApp,
    PortfolioPage,
    DetailsPage,
    SettingsPage,
    TabsPage,
    TransferPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AccountsPage,
    MyApp,
    PortfolioPage,
    DetailsPage,
    TransferPage,
    SettingsPage,
    TabsPage,
    TransferPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AccountProvider,
    FormatProvider,
    CurrencyProvider
  ]
})
export class AppModule {

  constructor(private currencyProvider: CurrencyProvider) {
    this.currencyProvider.initCurrencyProvider();
  }
}
