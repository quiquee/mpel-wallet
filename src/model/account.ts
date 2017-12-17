export enum AccountType {
  PUBLIC, MULTISIG, COLD, HOT
}

export class Account { 
  name: String;
  pubKey: String;
  pKey: String;
  type: AccountType; 
  
  public static publicAccount(name: String, pubKey: String) : Account {
    return { name: name, pubKey: pubKey, pKey: null, type: AccountType.PUBLIC};
  }

  public static hotAccount(name: String, pubKey: String, pKey: String) : Account {
    return { name: name, pubKey: pubKey, pKey: pKey, type: AccountType.HOT};
  }

  static coldAccount() {
    // Pkey is stored but encrypted with a strong mecanism
    // Require a 2FA
    throw "Not yet implemented !";
  }

  static multisigAccount() {
    // Contract address is needed
    // GUI must shows unlocking status progression
    throw "Not yet implemented !";
  }

}