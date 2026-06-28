import { CreateCustomerPayload } from '@/@types/contracts/payload/CreateCustomerPayload';
import { CustomerService } from '../service/CustomerService';
import { isValidRequest, Request } from '@/@types/contracts/Request';
import { UpdateCustomerPayload } from '@/@types/contracts/payload/UpdateCustomerPayload';
import { DeleteCustomerPayload } from '@/@types/contracts/payload/DeleteCustomerPayload';
import { GetCustomerPayload } from '@/@types/contracts/payload/GetCustomerPayload';

export class CustomerController {
    constructor(
        private customerService: CustomerService
    ) {}

    public createCustomer(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const {  name, document, pixKey, city } = payload as CreateCustomerPayload;

        this.customerService.createCustomer(name, document, pixKey, city, socket);
    }

    public updateCustomer(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const { id, name, document, balance, pixKey, city } = payload as UpdateCustomerPayload;

        this.customerService.updateCustomer(
            id,
            { name, document, balance, pixKey, city },
            socket
        );
    }
    
    public deleteCustomer(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const { id } = payload as DeleteCustomerPayload;

        this.customerService.deleteCustomer(id, socket);
    }

    public getCustomer(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const { id } = payload as GetCustomerPayload;

        this.customerService.getCustomer(id, socket);
    }

}