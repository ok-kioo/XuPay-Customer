import { UpdateCustomerPayload } from "./payload/UpdateCustomerPayload";
import { DeleteCustomerPayload } from "./payload/DeleteCustomerPayload";
import { CreateCustomerPayload } from "./payload/CreateCustomerPayload";
import { GetCustomerPayload } from "./payload/GetCustomerPayload";
import { HealthPayload } from "./payload/HealthPayload";
import { LoginPayload } from "./payload/LoginPayload";

export type Payload =
| UpdateCustomerPayload
| DeleteCustomerPayload
| CreateCustomerPayload
| GetCustomerPayload
| HealthPayload
| LoginPayload;

export type MessageBody = {
    payload: Payload;
};