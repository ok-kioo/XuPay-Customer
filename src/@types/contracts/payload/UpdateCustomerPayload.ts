import { Prisma } from "@/infra/database/generated/client";
import { PayloadBase } from "../PayloadBase";

export type UpdateCustomerPayload = PayloadBase & {
  kind: "UPDATE_CUSTOMER_PAYLOAD";
  id: string;
  name?: string;
  document?: string;
  balance?: Prisma.Decimal;
  pixKey?: string;
  city?: string;
  
};