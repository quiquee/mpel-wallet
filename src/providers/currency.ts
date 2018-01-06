declare function require(moduleName: string): any;
const MtPelerinTokens = require('../assets/contracts/MtPelerinTokens.json');
const FiatToken = require('../assets/contracts/FiatToken.json');

import { Injectable } from '@angular/core';
import { Web3Provider } from './web3';
import { Account } from '../model/account';
import { Currency } from '../model/currency';
import { Transfer } from '../model/transfer';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CurrencyProvider {
  private static TOKENS_CONTRACT_ADDR = '0x73b10223b2318cfb775fbe7bc5781a04c2a0a3cd';

  public allCurrencies = this.allCurrenciesObs();

  constructor(private web3Provider: Web3Provider) {
    console.log(this.web3Provider.getAccounts().create());
  }

  private allCurrenciesObs(): Observable<Array<Currency>> {
    let tokenDirectory = this.web3Provider.getContract(MtPelerinTokens.abi, CurrencyProvider.TOKENS_CONTRACT_ADDR);
    let web3Provider = this.web3Provider;

    let promise = tokenDirectory.methods.getCurrencyCount().call().then(count => {
      let tokens: Promise<Currency>[] = [
        Promise.resolve({
          name: 'Ethereum', decimal: null,
          address: null, contract: null, supply: null, symbol: 'ETH', image: 'ETH',
          history: [],
          balanceOf: (account: Account) => Observable.fromPromise(Promise.resolve(account)
            .then(account => this.web3Provider.getBalance(account.address)
              .then(balance => this.web3Provider.getUtils().fromWei(balance, 'ether')))),
          transfer: function(sender: Account, beneficiaryAddress: string, amount: number) {
            let value = web3Provider.getUtils().toWei(amount, 'ether');
            return web3Provider.sendSignedTransaction(
              sender.address, sender.pKey, beneficiaryAddress, value, null);
          }
        })
      ];

      for (var i = 1; i <= count; i++) {
        let token: Promise<Currency> = tokenDirectory.methods.getCurrencyById(i).call().then(address => {
          let contract = web3Provider.getContract(FiatToken.abi, address);
          let methods = contract.methods;

          return Promise.all([
            methods.name().call(),
            methods.symbol().call()
              .then(symbol => web3Provider.getUtils().toAscii(symbol)),
            methods.totalSupply().call(),
          ]).then(details => <Currency>{
            name: details[0],
            decimal: 2,
            address: address,
            contract: contract,
            supply: details[2],
            symbol: details[1],
            image: 'MTPELERIN',
            history: [],
            balanceOf: (account: Account) =>
              Observable.fromPromise(Promise.resolve(account)
                .then(account => contract.methods.balanceOf(account.address).call())
                .then((balance: number) => (balance) ? balance / 100 : 0)),
            transfer: function(sender: Account, beneficiaryAddress: string, amount: number) {
              console.log(amount + ' ' + this.symbol + ' to ' + beneficiaryAddress);
              let cents = amount * (10 ** this.decimal);
              let contractData = methods.transfer(beneficiaryAddress, cents).encodeABI();
              return web3Provider.sendSignedTransaction(
                sender.address, sender.pKey, address, null, contractData);
            }
          });
        });
        tokens.push(token);
      }
      return Promise.all(tokens);
    });
    return Observable.fromPromise(promise);
  }
}
