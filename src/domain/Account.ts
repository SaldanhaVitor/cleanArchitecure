import crypto from "crypto";
import Cpf from "./Cpf";
import Email from "./Email";

export default class Account {
  private cpf: Cpf;
  private email: Email;

  constructor(
    readonly accountId: string,
    readonly name: string,
    email: string,
    cpf: string,
    readonly carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate");
  }

  // static factory method
  static create(
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
  ) {
    const accountId = crypto.randomUUID();
    return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
  }

  getCpf() {
    return this.cpf.getValue();
  }

  getEmail() {
    return this.email.getValue();
  }
}