import { Customer } from "../entity/Customer";
import { ICustomerRepository } from "./ICustomerRepository";
import { prismaClient } from "@/infra/database/prismaClient";

export class CustomerRepositoryImpl implements ICustomerRepository {
 
    public async create(customer: Omit<Customer, "id" | "createdAt" | "balance" | "apiToken" >): Promise<Customer> {
        const createdCustomer = await prismaClient.customer.create({
            data: {
                name: customer.name,
                document: customer.document,
                email: customer.email,
                password: customer.password,
                pixKey: customer.pixKey,
                city: customer.city
            }
        });
        return createdCustomer;
    }

    public async update(id: string, data: any): Promise<Customer> {
        const customer = await prismaClient.customer.update({
            where: {
                id: id
            },
            data: data
        });
        return customer;
    }

    public async delete(id: string): Promise<void> {
        await prismaClient.customer.delete({
            where: {
                id: id
            }
        });
    }

    public async findById(id: string): Promise<Customer | null> {
        const customer = await prismaClient.customer.findUnique({
            where: {
                id: id
            }
        });

        return customer;
    }

    public async findByDocument(document: string): Promise<Customer | null> {
        const customer = await prismaClient.customer.findUnique({
            where: {
                document: document
            }
        });
        return customer;
    }

    public async findByEmail(email: string): Promise<Customer | null> {
        const customer = await prismaClient.customer.findUnique({
            where: {
                email: email
            }
        });
        return customer;
    }
}