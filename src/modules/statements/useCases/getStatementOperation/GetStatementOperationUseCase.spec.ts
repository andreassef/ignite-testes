import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUseRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Get statement operation", () => {
    beforeAll(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUseRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUseRepository, inMemoryStatementsRepository);
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUseRepository, inMemoryStatementsRepository);
    });

    it("Should be able to return information about a statement operation", async () => {
        const user = await inMemoryUseRepository.create({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit" as OperationType,
            amount: 200.00,
            description: "Pix"
        });

        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id,
            statement_id: statement.id
        });

        expect(statementOperation).toHaveProperty("id");
    });

    it("Should not be able to get information about statement operation if user don't exists", async () => {
        await expect(
            createStatementUseCase.execute({
                user_id: "e6ed6dgdhjeiehegege",
                type: "deposit" as OperationType,
                amount: 200.00,
                description: "Pix"
            })
        ).rejects.toEqual(new CreateStatementError.UserNotFound());
    });

    it("Should not be able to get a statement if it not exists", async () => {
        const user = await inMemoryUseRepository.create({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        await expect(
            getStatementOperationUseCase.execute({
                user_id: user.id,
                statement_id: "eueheueghdhudi27y3b"
            })
        ).rejects.toEqual(new GetStatementOperationError.StatementNotFound());
    });
});