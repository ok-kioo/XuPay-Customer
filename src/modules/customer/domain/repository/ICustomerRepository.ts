import { Customer } from "../entity/Customer";

export interface ICustomerRepository {
    findById(id: string): Promise<Customer | null>;
    findByDocument(document: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;

    create(customer: Omit<Customer, "id" | "createdAt" | "balance" | "apiToken" >): Promise<Customer>;
    update(id: string, data: any): Promise<Customer>;
    delete(id: string): Promise<void>;
    
}
