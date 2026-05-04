import { Response } from "@/@types/contracts/Response";
import { Request } from "@/@types/contracts/Request";
import { Payload } from "@/@types/contracts/MessageBody";
import { GetCustomerPayload } from "@/@types/contracts/GetCustomerPayload";
import { CreateCustomerPayload } from "@/@types/contracts/CreateCustomerPayload";
import { UpdateCustomerPayload } from "@/@types/contracts/UpdateCustomerPayload";
import { DeleteCustomerPayload } from "@/@types/contracts/DeleteCustomerPayload";
import { Prisma } from "@/infra/database/generated/client";

export class ResponseParser {
  public static deserialize(rawRequest: string): Request {
    try {
      const request = rawRequest.trim();

      const parts = request.split("|");

      if (parts.length !== 3) {
        throw new Error(
          "Requisição com campos diferentes do esperado " + request
        );
      }

      const [method, path, rawBody] = parts;

      const bodyParts = rawBody.split(";").map((part) => part.trim());

      if (bodyParts.length !== 4) {
        throw new Error(
          "Corpo da requisição com campos diferentes do esperado " + rawBody
        );
      }

      const [source, type, rawPayload, timestamp] = bodyParts;

      const payload = this.parsePayload(rawPayload);

      return {
        method,
        path,
        body: {
          source,
          type,
          payload,
          timestamp: timestamp.trim(),
        },
      };
    } catch (error: any) {
      throw new Error(`Formato inválido de corpo: ${error.message}`);
    }
  }

  private static parsePayload(rawPayload: string): Payload {
    const payload = this.parseKeyValueList(rawPayload);

    const hasId = payload.id !== undefined;
    const hasName = payload.name !== undefined;
    const hasDocument = payload.document !== undefined;
    const hasEmail = payload.email !== undefined;
    const hasBalance = payload.balance !== undefined;
    const hasDelete = payload.delete === "true";

    const hasAnyUpdateField =
      hasName || hasDocument || hasEmail || hasBalance;

    if (
      !hasId &&
      hasName &&
      hasDocument &&
      hasEmail &&
      !hasBalance &&
      !hasDelete
    ) {
      return this.parseCreatePayload(payload);
    }

    if (hasId && !hasAnyUpdateField && !hasDelete) {
      return this.parseGetPayload(payload);
    }

    if (hasId && hasAnyUpdateField && !hasDelete) {
      return this.parseUpdatePayload(payload);
    }

    if (hasId && !hasAnyUpdateField && hasDelete) {
      return this.parseDeletePayload(payload);
    }

    throw new Error(
      "Payload do Customer inválido. Formatos aceitos: id=xxx | name=xxx,document=xxx,email=xxx | id=xxx,name=xxx | id=xxx,document=xxx | id=xxx,email=xxx | id=xxx,balance=0.00 | id=xxx,delete=true"
    );
  }

  private static parseGetPayload(
    payload: Record<string, string>
  ): GetCustomerPayload {
    return {
      kind: "GET_CUSTOMER_PAYLOAD",
      id: payload.id,
    };
  }

  private static parseCreatePayload(
    payload: Record<string, string>
  ): CreateCustomerPayload {
    return {
      kind: "CREATE_CUSTOMER_PAYLOAD",
      name: payload.name,
      document: payload.document,
    };
  }

  private static parseUpdatePayload(
    payload: Record<string, string>
  ): UpdateCustomerPayload {
    const parsedPayload: UpdateCustomerPayload = {
      kind: "UPDATE_CUSTOMER_PAYLOAD",
      id: payload.id,
    };

    if (payload.name !== undefined) {
      parsedPayload.name = payload.name;
    }

    if (payload.document !== undefined) {
      parsedPayload.document = payload.document;
    }

    if (payload.balance !== undefined) {
      parsedPayload.balance = new Prisma.Decimal(payload.balance);
    }

    return parsedPayload;
  }

  private static parseDeletePayload(
    payload: Record<string, string>
  ): DeleteCustomerPayload {
    return {
      kind: "DELETE_CUSTOMER_PAYLOAD",
      id: payload.id,
    };
  }

  private static parseKeyValueList(rawPayload: string): Record<string, string> {
    if (!rawPayload || rawPayload.trim() === "") {
      throw new Error("Payload vazio");
    }

    const payload: Record<string, string> = {};

    const fields = rawPayload.split(",");

    for (const field of fields) {
      const separatorIndex = field.indexOf("=");

      if (separatorIndex === -1) {
        throw new Error(`Campo de payload sem "=": ${field}`);
      }

      const key = field.slice(0, separatorIndex).trim();
      const value = field.slice(separatorIndex + 1).trim();

      if (!key || !value) {
        throw new Error(`Campo de payload inválido: ${field}`);
      }

      payload[key] = value;
    }

    return payload;
  }

  public static serialize(response: Response): string {
    return `${response.method}|${response.path}|${response.body.source};${response.body.type};${response.body.payload};${response.body.timestamp}`;
  }
}