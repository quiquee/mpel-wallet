declare function require(moduleName: string): any;
const MtPelerinTokens = require('../assets/contracts/MtPelerinTokens.json');
const FiatToken = require('../assets/contracts/FiatToken.json');

import { Injectable } from '@angular/core';
import { Web3Provider } from './web3';
import { Account } from '../model/account';
import { Currency } from '../model/currency';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CurrencyProvider {
  private static TOKENS_CONTRACT_ADDR = '0x73b10223b2318cfb775fbe7bc5781a04c2a0a3cd';

  public allCurrencies = this.allCurrenciesObs();

  constructor(private web3Provider: Web3Provider) {
  }

  private allCurrenciesObs(): Observable<Array<Currency>> {
    let tokenDirectory = this.web3Provider.getContract(MtPelerinTokens.abi, CurrencyProvider.TOKENS_CONTRACT_ADDR);
    let web3Provider = this.web3Provider;

    let promise = tokenDirectory.methods.getCurrencyCount().call().then(count => {
      let tokens: Promise<Currency>[] = [
        Promise.resolve({
          name: 'Ethereum', balance: 0, decimal: null,
          address: null, contract: null, supply: null, symbol: 'ETH', image: 'ETH',
          history: [],
          balanceOf: (account: Account) => Observable.fromPromise(Promise.resolve(account)
            .then(account => this.web3Provider.getBalance(account.pubKey)
              .then(balance => this.web3Provider.getUtils().fromWei(balance, 'ether')))),
          transfer: () => { return Observable.of(null); }
        })
      ];

      for (var i = 1; i <= count; i++) {
        let token: Promise<Currency> = tokenDirectory.methods.getCurrencyById(i).call().then(address => {
          let contract = web3Provider.getContract(FiatToken.abi, address);
          let methods = contract.methods;

          return Promise.all([
            methods.name().call(),
            methods.symbol().call()
              .then(symbol => this.web3Provider.getUtils().toAscii(symbol)),
            methods.totalSupply().call(),
          ]).then(details => <Currency>{
            name: details[0],
            balance: 0,
            decimal: 2,
            address: address,
            contract: contract,
            supply: details[2],
            symbol: details[1],
            image: 'MTPELERIN',
            history: [],
            balanceOf: (account: Account) =>
              Observable.fromPromise(Promise.resolve(account)
                .then(account => contract.methods.balanceOf(account.pubKey).call())
                .then((balance: number) => (balance) ? balance / 100 : 0)),
            transfer: function (sender: Account, beneficiary: Account, amount: number) {
              if (sender.pKey) {
                console.log(amount + ' ' + this.symbol + ' to ' + beneficiary.name);
                let cents = amount * (10 ** this.decimal);
                console.log(web3Provider);
                let promise = web3Provider.unlockAccount(sender.pubKey, 'password')
                  .then(() => methods.transfer(beneficiary.pubKey, cents).send({ from: sender.pubKey }))
                  .then(result => { console.log(result); })
                  .catch(error => { console.error(error); });
                return Observable.fromPromise(promise);
              }
              return null;
            }
          });
        });
        tokens.push(token);
      }
      return Promise.all(tokens);
    });
    return Observable.fromPromise(promise);
  }

  /*private async transferEth(sender: Account, beneficiary: Account, amount: number) {
    if (sender.pKey) {
      console.log(amount + ' eth to ' + beneficiary.name);
      await this.web3.eth.personal.unlockAccount(sender.pubKey, 'password');
      await this.web3.eth.sendTransaction({
        from: sender.pubKey,
        to: beneficiary.pubKey,
        value: this.web3.utils.toWei(amount, 'ether')
      }).then(result => {
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
    }
  }*/

  /*private async transferERC20(sender: Account, beneficiary: Account, amount: number) {
    if (sender.pKey) {
      console.log(amount + ' ' + currency.symbol + ' to ' + beneficiary.name);
      let cents = amount * (10 ** currency.decimal);
      await this.web3.eth.personal.unlockAccount(sender.pubKey, 'password');
      await currency.contract.methods.transfer(beneficiary.pubKey, cents).send({ from: sender.pubKey }).then(result => {
        console.log(result);
      }).catch(error => {
        console.error(error);
      });
    }
  }*/
}
