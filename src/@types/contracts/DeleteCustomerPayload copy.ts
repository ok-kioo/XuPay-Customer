import { PayloadBase } from "./PayloadBase";

export type GetCustomerPayload = PayloadBase & {
    id: string;
}