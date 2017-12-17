declare function require(moduleName: string): any;
const Web3 = require("web3");
const MtPelerinTokens = require('../assets/contracts/MtPelerinTokens.json');
const FiatToken = require('../assets/contracts/FiatToken.json');

import { Injectable } from '@angular/core';
import { AccountProvider } from './account';
import { Currency } from '../model/currency';

@Injectable()
export class CurrencyProvider {
  public web3: any;
  private currencies: Array<Currency> = [];

  private static TOKENS_CONTRACT_ADDR = '0x73b10223b2318cfb775fbe7bc5781a04c2a0a3cd';  

  constructor(private accountProvider : AccountProvider) {
  }

  public allCurrencies(): Array<Currency> {
    return this.currencies;
  }

  public getCurrency(symbol: String) : Currency {
    return this.currencies.filter(currency => {
      return currency.symbol == symbol;
    })[0];
  }

  async loadTokens() {
    this.currencies = [];

    let contract = new this.web3.eth.Contract(MtPelerinTokens.abi, CurrencyProvider.TOKENS_CONTRACT_ADDR);
    let count = await contract.methods.getCurrencyCount().call();
    console.log('Found ' + count + ' tokens !');
    let ethBalance = await this.web3.eth.getBalance(this.accountProvider.activeAccount().pubKey)
      .then((value) => {
        return Math.round((this.web3.utils.fromWei(value, "ether") * 100) / 100).toFixed(2);
      });
    this.currencies = [{
      name: 'Ethereum', balance: ethBalance,
      address: null, contract: null, supply: null, symbol: 'ETH', image: 'ETH'
    }];

    for (var i = 1; i <= count; i++) {
      let address = await contract.methods.getCurrencyById(i).call();

      let token = { name: null, balance: null, address: address, contract: null, supply: null, symbol: null, image: null };
      token.contract = new this.web3.eth.Contract(FiatToken.abi, address);
      token.name = await token.contract.methods.name().call();
      token.symbol = this.web3.utils.toAscii(await token.contract.methods.symbol().call());
      token.supply = await token.contract.methods.totalSupply().call() / 100;
      token.image = 'MTPELERIN';
      this.refreshBalance(token);
      this.currencies.push(token);
    }
  }

  async refreshBalance(token) {
    let balance = await token.contract.methods.balanceOf(this.accountProvider.activeAccount().pubKey).call() / 100;
    token.balance = (balance) ? balance : 0;
  }

  async transfer(currency: Currency, beneficiaryAddress: String, amount: Number) {
    await currency.contract.methods.transfer(beneficiaryAddress, amount).call();
  }

  initCurrencyProvider() {
    console.log("Starting web3j...");
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      this.web3 = new Web3(
        new Web3.providers.HttpProvider("./node"));
    }
  }
}
