import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show user profile", () => {

    beforeAll(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("Should be able to show user's profile information", async () => {
        const user = await createUserUseCase.execute({
            name: "André Assef",
            email: "andre@gmail.com",
            password: "1234",
        });

        //const session = await authenticateUserUseCase
        expect(
            await showUserProfileUseCase.execute(user.id)
        ).toHaveProperty("id");
    });

    it("Should not be able to show a profile if user don't exists", async () => {
        await expect(
            showUserProfileUseCase.execute("srsrs561ggd7dtt2td")
        ).rejects.toEqual(new ShowUserProfileError());
    });
});