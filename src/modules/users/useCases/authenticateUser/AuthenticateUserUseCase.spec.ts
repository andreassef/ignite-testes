import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {

    beforeAll(() => {   
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to authenticate an user", async () => {
        const user: ICreateUserDTO = {
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        }
        
        await createUserUseCase.execute(user);

        const session = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        });

        expect(session).toHaveProperty("token");
    });

    it("should not be able to authenticate an nonexistent user", async () => {
        await expect(
            authenticateUserUseCase.execute({
              email: "false@email.com",
              password: "1234",
            })
          ).rejects.toEqual(new IncorrectEmailOrPasswordError());
    });

    it("should not be able to authenticate with incorrect password", async () => {
        const user: ICreateUserDTO = {
            name: "André Assef",
            email: "andree@gmail.com",
            password: "1234",
        };
    
        await createUserUseCase.execute(user);
    
        await expect(
          authenticateUserUseCase.execute({
            email: user.email,
            password: "incorrectPassword",
          })
        ).rejects.toEqual(new IncorrectEmailOrPasswordError());
      });
});