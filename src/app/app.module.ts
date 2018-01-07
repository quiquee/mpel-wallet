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
import {TransactionProvider} from '../providers/transaction';
import {Web3Provider} from '../providers/web3';
import {HttpClientModule} from "@angular/common/http";
import {PortfolioDetailsPage} from "../pages/portfolio-details/portfolio-details";
import {AccountsDetailsPage} from "../pages/accounts-details/accounts-details";
import {HeaderComponent} from '../components/header/header';
import {NgxQRCodeModule} from 'ngx-qrcode3';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    AccountsPage,
    AccountsDetailsPage,
    MyApp,
    PortfolioPage,
    PortfolioDetailsPage,
    SettingsPage,
    TabsPage,
    TransferPage,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AccountsPage,
    AccountsDetailsPage,
    MyApp,
    PortfolioPage,
    PortfolioDetailsPage,
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
    CurrencyProvider,
    Web3Provider,
    BarcodeScanner,
    TransactionProvider
  ]
})
export class AppModule {

}
