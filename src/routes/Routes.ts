import { Socket } from "net";
import type { Request } from "../@types/contracts/Request";
import { ErrorHandler } from "../infra/middleware/Error";
import { CustomerService } from "@/modules/customer/service/CustomerService";
import { CustomerController } from "@/modules/customer/controller/CustomerController";
import { CustomerRepositoryImpl } from "@/modules/customer/domain/repository/CustomerRepositoryImpl";

export class Routes {
    private readonly customerRepository: CustomerRepositoryImpl;
    private readonly customerService: CustomerService;
    private readonly customerController: CustomerController;


    constructor() {
        this.customerRepository = new CustomerRepositoryImpl();
        this.customerService = new CustomerService(this.customerRepository);
        this.customerController = new CustomerController(this.customerService);
    }

    public handle(request: Request, socket: Socket): void {
        if (request.path === "customer-create" && request.method === "POST") {
            this.customerController.createCustomer(request, socket);
        }
        else if (request.path === "customer-update" && request.method === "PUT") {
            this.customerController.updateCustomer(request, socket);
        }
        else if (request.path === "customer-delete" && request.method === "DELETE") {
            this.customerController.deleteCustomer(request, socket);
        }
        else if (request.path === "customer" && request.method === "GET") {
            this.customerController.getCustomer(request, socket);
        }
        else {
            return ErrorHandler.handle('Rota não encontrada', socket);
        }
        
    }
}