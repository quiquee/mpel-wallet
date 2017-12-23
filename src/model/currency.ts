import { Transfer } from './transfer';

export class Currency {
  name: String;
  decimal: number;
  balance: number;
  address: String;
  contract: any;
  supply: number;
  symbol: String;
  image: String;
  history: Array<Transfer>;
}
