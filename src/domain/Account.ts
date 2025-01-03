import crypto from "crypto";
import Cpf from "./Cpf";
import Email from "./Email";
import Name from "./Name";
import CarPlate from "./CarPlate";

export default class Account {
  private cpf: Cpf;
  private email: Email;
  private name: Name;
  private carPlate: CarPlate;

  constructor(
    readonly accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean
  ) {
    this.name = new Name(name);
    this.email = new Email(email);
    this.cpf = new Cpf(cpf);
    this.carPlate = new CarPlate(carPlate);
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

  getName() {
    return this.name.getValue();
  }

  getCarPlate() {
    return this.carPlate.getValue();
  }
}