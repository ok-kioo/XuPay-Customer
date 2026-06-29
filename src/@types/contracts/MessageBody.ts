import { UpdateCustomerPayload } from "./payload/UpdateCustomerPayload";
import { DeleteCustomerPayload } from "./payload/DeleteCustomerPayload";
import { CreateCustomerPayload } from "./payload/CreateCustomerPayload";
import { GetCustomerPayload } from "./payload/GetCustomerPayload";
import { HealthPayload } from "./payload/HealthPayload";

export type Payload =
| UpdateCustomerPayload
| DeleteCustomerPayload
| CreateCustomerPayload
| GetCustomerPayload
| HealthPayload;

export type MessageBody = {
    payload: Payload;
};