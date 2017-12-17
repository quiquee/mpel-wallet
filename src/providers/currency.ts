declare function require(moduleName: string): any;
const Web3 = require("web3");
const MtPelerinTokens = require('../assets/contracts/MtPelerinTokens.json');
const FiatToken = require('../assets/contracts/FiatToken.json');

import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyProvider {
  public web3: any;
  private currencies = [];

  private static TOKENS_CONTRACT_ADDR = '0x73b10223b2318cfb775fbe7bc5781a04c2a0a3cd';  
  private static ACCOUNTS = [
    { name: 'MtPelerin Public Miner', pubKey: '0xfd7365ea32a3bb4858e1563e18d78bc09bb81df5' },
    { name: 'MtPelerin BankProject Cold/Miner', pubKey: '0x459040565c09E9e851F52DBF6DD8689111093211' },
    { name: 'MtPelerin BankProject Hot', pubKey: '0x9DCC65CfC9F1379c6073e8a778B177fE78291C2a' }
  ];
  private static DEFAULT_ACCOUNT = CurrencyProvider.ACCOUNTS[2];
  
  constructor() {
  }

  public getCurrencyList() {
    return this.currencies;
  }

  async loadTokens() {
    let contract = new this.web3.eth.Contract(MtPelerinTokens.abi, CurrencyProvider.TOKENS_CONTRACT_ADDR);
    let count = await contract.methods.getCurrencyCount().call();
    console.log('Found ' + count + ' tokens !');
    let ethBalance = await this.web3.eth.getBalance(CurrencyProvider.DEFAULT_ACCOUNT.pubKey)
      .then((value) => {
        return Math.round((this.web3.utils.fromWei(value, "ether") * 100) / 100).toFixed(2);
      });
    this.currencies = [{
      name: 'Ethereum', balance: ethBalance,
      address: null, contract: null, supply: null, symbol: 'ETH'
    }];

    for (var i = 1; i <= count; i++) {
      let address = await contract.methods.getCurrencyById(i).call();

      let token = { name: null, address: address, contract: null, supply: null, symbol: null };
      token.contract = new this.web3.eth.Contract(FiatToken.abi, address);
      token.name = await token.contract.methods.name().call();
      token.symbol = this.web3.utils.toAscii(await token.contract.methods.symbol().call());
      token.supply = await token.contract.methods.totalSupply().call() / 100;
      this.refreshBalance(token);
      this.currencies.push(token);
    }
  }

  async refreshBalance(token) {
    let balance = await token.contract.methods.balanceOf(CurrencyProvider.ACCOUNTS[2].pubKey).call() / 100;
    token.balance = (balance) ? balance : 0;
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

    this.loadTokens();
  }
}
