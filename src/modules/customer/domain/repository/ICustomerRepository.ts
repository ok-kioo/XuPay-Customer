import { Customer } from "../entity/Customer";

export interface ICustomerRepository {
    findById(id: string): Promise<Customer >;
    findByDocument(document: string): Promise<Customer>;

    create(customer: Omit<Customer, "id" | "createdAt" | "balance" >): Promise<Customer>;
    update(id: string, data: any): Promise<Customer>;
    delete(id: string): Promise<void>;
    
}
