import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({ user_id, type, amount, description, sender_id }: ICreateStatementDTO) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(type === 'withdraw' || type === 'transfer') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });
      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }
    let statementOperation:  ICreateStatementDTO;

    if(type === 'transfer') {
      statementOperation = await this.statementsRepository.create({
        user_id: sender_id,
        type,
        amount,
        description
      })

      await this.statementsRepository.create({
        user_id,
        type: OperationType.WITHDRAW,
        amount,
        description
      })
    } else {
      statementOperation = await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description
      })
    }

    return statementOperation;
  }
}
