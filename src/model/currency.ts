import { Account } from './account';
import { Transfer } from './transfer';
import { Observable } from 'rxjs/Observable';

export class Currency {
  name: string;
  decimal: number;
  address: string;
  contract: any;
  supply: number;
  symbol: string;
  image: string;
  history: Array<any>;
  balanceOf(account: Account): Observable<number> { return null; };
  transfer(sender: Account, beneficiaryAddress: string, amount: number): Observable<Transfer> { return null; }
}
