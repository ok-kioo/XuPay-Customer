import { Customer } from "../entity/Customer";

export interface ICustomerRepository {
    findById(id: string): Promise<Customer >;
    findByDocument(document: string): Promise<Customer>;

    create(customer: Omit<Customer, "id" | "createdAt" | "balance" >): Promise<void>;
    update(id: string, data: any): Promise<void>;
    delete(id: string): Promise<void>;
    
}
