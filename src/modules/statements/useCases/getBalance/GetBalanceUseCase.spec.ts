import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUseRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("The purpose of this test is get user's balance", () =>{

    beforeAll(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUseRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUseRepository);
    });

    it("Should be able to get user's balance", async () => {
        const user = await inMemoryUseRepository.create({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        const balance = await getBalanceUseCase.execute({
            user_id: user.id
        });

        expect(balance).toHaveProperty("statement");
        expect(balance).toHaveProperty("balance");
    });

    it("Should not be able to get user's balance if user don't exists", async () => {
        await expect(
            getBalanceUseCase.execute({
                user_id: "e6ed6dgdhjeiehegege"
            })
        ).rejects.toEqual(new GetBalanceError());
    });

});