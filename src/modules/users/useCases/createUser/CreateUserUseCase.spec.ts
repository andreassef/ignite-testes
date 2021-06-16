import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {

    beforeAll(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(
            inMemoryUsersRepository
        );
    });

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });
        expect(user).toHaveProperty("id");
    });

    it("should not to be able to create a user if already exists", async () => {
        await createUserUseCase.execute({
            name: "André Assef",
            email: "andreassef@gmail.com",
            password: "1234",
        });

        await expect(
            createUserUseCase.execute({
                name: "Lucas Brito",
                email: "andreassef@gmail.com",
                password: "1234",
            })
        ).rejects.toEqual(new CreateUserError());
    });

})