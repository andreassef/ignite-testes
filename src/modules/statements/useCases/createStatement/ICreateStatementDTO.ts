import { Statement } from "../../entities/Statement";

// export type ICreateStatementDTO =
// Pick<
//   Statement,
//   'user_id' |
//   'description' |
//   'amount' |
//   'type'
// >
enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}
export interface ICreateStatementDTO {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  sender_id?: string;
}