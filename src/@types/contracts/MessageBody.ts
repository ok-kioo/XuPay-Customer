import { UpdateCustomerPayload } from "./UpdateCustomerPayload";
import { DeleteCustomerPayload } from "./DeleteCustomerPayload";
import { CreateCustomerPayload } from "./CreateCustomerPayload";
import { GetCustomerPayload } from "./GetCustomerPayload";

export type Payload =
| UpdateCustomerPayload
| DeleteCustomerPayload
| CreateCustomerPayload
| GetCustomerPayload;

export type MessageBody = {
    source: string;
    type: string;
    payload: Payload;
    timestamp: string;
};