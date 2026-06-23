import { UpdateCustomerPayload } from "./payload/UpdateCustomerPayload";
import { DeleteCustomerPayload } from "./payload/DeleteCustomerPayload";
import { CreateCustomerPayload } from "./payload/CreateCustomerPayload";
import { GetCustomerPayload } from "./payload/GetCustomerPayload";

export type Payload =
| UpdateCustomerPayload
| DeleteCustomerPayload
| CreateCustomerPayload
| GetCustomerPayload;

export type MessageBody = {
    payload: Payload;
};