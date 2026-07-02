import { Socket } from "net";
import { ICustomerRepository } from "../domain/repository/ICustomerRepository";
import { ErrorHandler } from "@/infra/middleware/error/TcpError";
import { Prisma } from "@/infra/database/generated/client";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { generateApiToken } from "@/infra/provider/encrypt/encrypt";

type UpdateCustomerData = {
  name?: string;
  document?: string;
  email?: string;
  password?: string;
  balance?: Prisma.Decimal;
  pixKey?: string;
  city?: string;
  apiToken?: string;
};

export class CustomerService {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  public async createCustomer(name: string,document: string, email: string, password: string, pixKey: string, city: string, socket: Socket): Promise<void> {if (!name || !document) {
      return ErrorHandler.handle("Dados incompletos para criação do cliente",socket);
    }
    const existingCustomerByDocument = await this.customerRepository.findByDocument(document);

    if (existingCustomerByDocument) {
      return ErrorHandler.handle("Cliente com este documento já existe",socket);
    }

    const existingCustomerByEmail = await this.customerRepository.findByEmail(email);

    if (existingCustomerByEmail) {
      return ErrorHandler.handle("Cliente com este email já existe",socket);
    }

    const existingByEmail = await this.customerRepository.findByEmail(email);

    if (existingByEmail) {
      return ErrorHandler.handle("Cliente com este email já existe", socket);
    }

    const customer = await this.customerRepository.create({ name, document, email, password, pixKey, city });

    const apiToken = generateApiToken( { id: customer.id } );

    await this.customerRepository.update(customer.id, { apiToken });

    const responseBody = {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      email: customer.email,
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
    email,
    password,
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
    email?: string;
    password?: string;
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

  if (email !== undefined) {
    if (email.trim() === "") {
      return ErrorHandler.handle("Email não pode ser vazio", socket);
    }

    const customerWithSameEmail =
      await this.customerRepository.findByEmail(email);

    if (customerWithSameEmail && customerWithSameEmail.id !== id) {
      return ErrorHandler.handle(
        "Outro cliente com este email já existe",
        socket
      );
    }

    dataToUpdate.email = email;
  }

  if (password !== undefined) {
    if (password.trim() === "") {
      return ErrorHandler.handle("Senha não pode ser vazia", socket);
    }

    dataToUpdate.password = password;
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
      email: updatedCustomer.email,
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
      email: customer.email,
      balance: customer.balance.toString(),
      createdAt: customer.createdAt.toISOString(),
    };

    const response = ResponseParser.serializeResponse(200, responseBody);
    socket.write(response);
    socket.end();
  }

  public async auth(email: string, password: string, socket: Socket): Promise<void> {
    if (!email || !password) {
      return ErrorHandler.handle("Email e senha são obrigatórios para autenticação", socket);
    }

    const customer = await this.customerRepository.findByEmail(email);

    if (!customer) {
      return ErrorHandler.handle("Cliente com este email não encontrado",socket);
    }

    

    const responseBody = {
      id: customer.id,
      name: customer.name,
      document: customer.document,
      email: customer.email,
      apiToken: customer.apiToken,
      balance: customer.balance.toString(),
      createdAt: customer.createdAt.toISOString(),
    };

    const response = ResponseParser.serializeResponse(200, responseBody);
    socket.write(response);
    socket.end();
  }
}