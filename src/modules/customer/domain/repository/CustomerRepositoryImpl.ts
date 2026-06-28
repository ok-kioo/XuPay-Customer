import { Customer } from "../entity/Customer";
import { ICustomerRepository } from "./ICustomerRepository";
import { PrismaClient } from "@prisma/client/extension";

export class CustomerRepositoryImpl implements ICustomerRepository {
 
    public async create(customer: Omit<Customer, "id" | "createdAt" | "balance" | "apiToken" >): Promise<Customer> {
        const prisma = new PrismaClient();
        const createdCustomer = await prisma.customer.create({
            data: {
                name: customer.name,
                document: customer.document
            }
        });
        return createdCustomer;
    }

    public async update(id: string, data: any): Promise<Customer> {
        const prisma = new PrismaClient();
        const customer = await prisma.customer.update({
            where: {
                id: id
            },
            data: data
        });
        return customer;
    }

    public async delete(id: string): Promise<void> {
        const prisma = new PrismaClient();
        await prisma.customer.delete({
            where: {
                id: id
            }
        });
    }

    public async findById(id: string): Promise<Customer> {
        const prisma = new PrismaClient();

        const customer = await prisma.customer.findUnique({
            where: {
                id: id
            }
        });

        return customer;
    }

    public async findByDocument(document: string): Promise<Customer> {
        const prisma = new PrismaClient();
        const customer = await prisma.customer.findUnique({
            where: {
                document: document
            }
        });
        return customer;
    }

}