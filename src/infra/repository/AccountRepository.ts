import AccountRepository from "../../application/repository/AccountRepository";
import Account from "../../domain/Account";
import DatabaseConnection from "../database/Databaseconnection";


export class AccountRepositoryDatabase implements AccountRepository {

	constructor(readonly connection: DatabaseConnection) {
	}

	async getAccountByEmail(email: string): Promise<Account | undefined> {
		const [accountData] = await this.connection.query("select * from cccat17.account where email = $1", [email]);
		if (!accountData) return;
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
	}

	async getAccountById(accountId: string): Promise<Account> {
		const [accountData] = await this.connection.query("select * from cccat17.account where account_id = $1", [accountId]);
		if (!accountData) throw new Error('Account not found');
		return new Account(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
	}

	async saveAccount(account: Account) {
		await this.connection.query("insert into cccat17.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.getName(), account.getEmail(), account.getCpf(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]);
	}
}

export class AccountRepositoryMemory implements AccountRepository {
	accounts: Account[];

	constructor() {
		this.accounts = [];
	}

	async getAccountByEmail(email: string): Promise<any> {
		return this.accounts.find((account: Account) => account.getEmail() === email);
	}

	async getAccountById(accountId: string): Promise<any> {
		return this.accounts.find((account: Account) => account.accountId === accountId);
	}

	async saveAccount(account: Account): Promise<void> {
		this.accounts.push(account);
	}

}
