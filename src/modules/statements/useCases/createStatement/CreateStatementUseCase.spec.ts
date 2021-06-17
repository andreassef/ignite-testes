import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUseRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
    beforeAll(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUseRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUseRepository, inMemoryStatementsRepository);
    });

    it("Should be able to create a statement of a deposit", async () => {
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

        expect(statement).toHaveProperty("id");
    });

    it("Should be able to create a statement of a withdraw", async () => {
        const user = await inMemoryUseRepository.create({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        await createStatementUseCase.execute({
            user_id: user.id,
            type: "deposit" as OperationType,
            amount: 200.00,
            description: "Pix"
        });

        const withdraw = await createStatementUseCase.execute({
            user_id: user.id,
            type: "withdraw" as OperationType,
            amount: 20,
            description: "Pix de envio"
        });

        expect(withdraw).toHaveProperty("id");
    });

    it("Should not to be able to create a statement if the user don't exists", async () => {
        await expect(
            createStatementUseCase.execute({
                user_id: "e6ed6dgdhjeiehegege",
                type: "deposit" as OperationType,
                amount: 200.00,
                description: "Pix"
            })
        ).rejects.toEqual(new CreateStatementError.UserNotFound());
    });
    
    it("Should not be able to make a withdraw if fund is not engough", async () => {

        const user = await inMemoryUseRepository.create({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        await expect(
            createStatementUseCase.execute({
                user_id: user.id,
                type: "withdraw" as OperationType,
                amount: 200.00,
                description: "Pix"
            })
        ).rejects.toEqual(new CreateStatementError.InsufficientFunds());
    });
});