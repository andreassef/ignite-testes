import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
  }

class CreateTransferController {
    async handle(request: Request, response: Response): Promise<Response> {
        const { id: user_id } = request.user;
        const { sender_id } = request.params;
        const { amount, description } = request.body;

        const createStatementUseCase = container.resolve(CreateStatementUseCase);

        const statement = await createStatementUseCase.execute({
            user_id,
            type: OperationType.TRANSFER,
            amount,
            description,
            sender_id
          });
      
          return response.status(201).json(statement);
    }
}

export { CreateTransferController };