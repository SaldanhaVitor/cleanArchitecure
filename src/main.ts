import GetAccount from "./application/usecase/account/GetAccount";
import Signup from "./application/usecase/account/Signup";
import AccountController from "./infra/controller/AccountController";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { PgPromiseAdapter } from "./infra/database/Databaseconnection";
import { ExpressAdapter } from "./infra/http/HttpServer";

const databaseConnection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const httpServer = new ExpressAdapter();
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);
