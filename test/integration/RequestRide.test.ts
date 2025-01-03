import MailerGateway from "../../src/application/gateway/MailerGateway";
import Signup from "../../src/application/usecase/account/Signup";
import GetRide from "../../src/application/usecase/ride/GetRide";
import RequestRide from "../../src/application/usecase/ride/RequestRide";
import DatabaseConnection, { PgPromiseAdapter } from "../../src/infra/database/Databaseconnection";
import MailerGatewayFake from "../../src/infra/gateway/MailerGatewayFake";
import { AccountRepositoryDatabase } from "../../src/infra/repository/AccountRepository";
import RideRepositoryDatabase from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection
let signup: Signup;
let mailerGateway: MailerGateway;
let requestRide: RequestRide;
let getRide: GetRide;


beforeEach(() => {
	connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
	mailerGateway = new MailerGatewayFake();
	signup = new Signup(accountRepository, mailerGateway);
	const rideRepository = new RideRepositoryDatabase(connection);
	requestRide = new RequestRide(rideRepository, accountRepository);
	getRide = new GetRide(rideRepository)
});


afterEach(async () => await connection.close());

test("Deve solicitar uma corrida", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true
	}
	const outputSignup = await signup.execute(inputSignup);

	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
	expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
	expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
	expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
	expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
	expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.date).toBeDefined();
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: false,
		isDriver: true,
		carPlate: "ABC1234",
	}
	const outputSignup = await signup.execute(inputSignup);

	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This account is not a passenger"));
});

test("Não deve solicitar uma corrida se o passageiro já tiver outra corrida não finalizada", async () => {
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		isDriver: false,
	}
	const outputSignup = await signup.execute(inputSignup);

	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	await requestRide.execute(inputRequestRide);
	await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(new Error("This passenger has an active ride"));
});