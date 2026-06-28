import { Socket } from "net";
import { ICustomerRepository } from "../domain/repository/ICustomerRepository";
import { ErrorHandler } from "@/infra/middleware/Error";
import { Prisma } from "@/infra/database/generated/client";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import crypto from "crypto";

type UpdateCustomerData = {
  name?: string;
  document?: string;
  balance?: Prisma.Decimal;
  pixKey?: string;
  city?: string;
  apiToken?: string;
};

export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async createCustomer(name: string,document: string, pixKey: string, city: string,socket: Socket): Promise<void> {if (!name || !document) {
      return ErrorHandler.handle("Dados incompletos para criação do cliente",socket);
    }
    const existingCustomer = await this.customerRepository.findByDocument(document);

    if (existingCustomer) {
      return ErrorHandler.handle("Cliente com este documento já existe",socket);
    }

    const customer = await this.customerRepository.create({ name, document, pixKey, city });

    const apiToken = this.generateApiToken(customer.id);

    await this.updateCustomer(customer.id, {apiToken}, socket);

    const responseBody = {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      balance: customer.balance.toString(),
      apiToken,
      createdAt: customer.createdAt.toISOString(),
    };

    const response = ResponseParser.serializeResponse(201, responseBody);
    socket.write(response);
    socket.end();
  }

  public async updateCustomer(
  id: string,
  data: UpdateCustomerData,
  socket: Socket
): Promise<void> {
  if (!id) {
    return ErrorHandler.handle(
      "ID do cliente é obrigatório para atualização",
      socket
    );
  }

  const {
    name,
    document,
    balance,
    pixKey,
    city,
    apiToken,
  } = data;

  const existingCustomer = await this.customerRepository.findById(id);

  if (!existingCustomer) {
    return ErrorHandler.handle(
      "Cliente com este ID não encontrado",
      socket
    );
  }

  const dataToUpdate: {
    name?: string;
    document?: string;
    balance?: Prisma.Decimal;
    apiToken?: string;
    pixKey?: string;
    city?: string;
  } = {};

  if (name !== undefined) {
    if (name.trim() === "") {
      return ErrorHandler.handle("Nome não pode ser vazio", socket);
    }

    dataToUpdate.name = name;
  }

  if (document !== undefined) {
    if (document.trim() === "") {
      return ErrorHandler.handle("Documento não pode ser vazio", socket);
    }

    const customerWithSameDocument =
      await this.customerRepository.findByDocument(document);

    if (customerWithSameDocument && customerWithSameDocument.id !== id) {
      return ErrorHandler.handle(
        "Outro cliente com este documento já existe",
        socket
      );
    }

    dataToUpdate.document = document;
  }

  if (balance !== undefined) {
    if (balance.isNegative()) {
      return ErrorHandler.handle("Saldo não pode ser negativo", socket);
    }

    dataToUpdate.balance = existingCustomer.balance.plus(balance);
  }

  if (pixKey !== undefined) {
    dataToUpdate.pixKey = pixKey;
  }

  if (city !== undefined) {
    dataToUpdate.city = city;
  }

  if (apiToken !== undefined) {
    dataToUpdate.apiToken = apiToken;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return ErrorHandler.handle(
      "Nenhum campo válido enviado para atualização",
      socket
    );
  }

  const updatedCustomer = await this.customerRepository.update(id, dataToUpdate);

  const responseBody = {
      id: updatedCustomer.id,
      name: updatedCustomer.name,
      document: updatedCustomer.document,
      balance: updatedCustomer.balance.toString(),
      createdAt: updatedCustomer.createdAt.toISOString(),
    };

    const response = ResponseParser.serializeResponse(200, responseBody);
    socket.write(response);
    socket.end();
  }


  public async deleteCustomer(id: string, socket: Socket): Promise<void> {
    if (!id) {
      return ErrorHandler.handle("ID do cliente é obrigatório para exclusão",socket);
    }

    const existingCustomer = await this.customerRepository.findById(id);

    if (!existingCustomer) {
      return ErrorHandler.handle("Cliente com este ID não encontrado",socket);
    }

    await this.customerRepository.delete(id);

    const response = ResponseParser.serializeResponse(204, {});
    socket.write(response);
    socket.end();
  }

  public async getCustomer(id: string, socket: Socket): Promise<void> {
    if (!id) {
      return ErrorHandler.handle("ID do cliente é obrigatório para consulta",socket
      );
    }

    const customer = await this.customerRepository.findById(id);

    if (!customer) {
      return ErrorHandler.handle("Cliente com este ID não encontrado",socket);
    }

    const responseBody = {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      balance: customer.balance.toString(),
      createdAt: customer.createdAt.toISOString(),
    };

    const response = ResponseParser.serializeResponse(200, responseBody);
    socket.write(response);
    socket.end();
  }

  private generateApiToken(id: string): string {
    const key = Buffer.from(
      process.env.SECRET_API_TOKEN_KEY!,
      "hex"
    );

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      key,
      iv
    );

    const encrypted =
      cipher.update(id, "utf8", "hex") +
      cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  }
}