import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class PortfolioProvider {

  constructor(private http: HttpClient) {
    console.log('Hello MoneyProvider Provider');
  }

  public getMyMoneyList() {
    return [
      "USD", "EUR", "GBP", "CHF"
    ]
  }

}
