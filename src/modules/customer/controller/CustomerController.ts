import { CreateCustomerPayload } from '@/@types/contracts/payload/CreateCustomerPayload';
import { CustomerService } from '../service/CustomerService';
import { isValidRequest, Request } from '@/@types/contracts/TcpRequest';
import { UpdateCustomerPayload } from '@/@types/contracts/payload/UpdateCustomerPayload';
import { DeleteCustomerPayload } from '@/@types/contracts/payload/DeleteCustomerPayload';
import { GetCustomerPayload } from '@/@types/contracts/payload/GetCustomerPayload';
import { LoginPayload } from '@/@types/contracts/payload/LoginPayload';

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

        const {  name, document, email, password, pixKey, city } = payload as CreateCustomerPayload;

        this.customerService.createCustomer(name, document, email, password, pixKey, city, socket);
    }

    public updateCustomer(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);

        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const { id, name, document, email, password, balance, pixKey, city } = payload as UpdateCustomerPayload;

        this.customerService.updateCustomer(
            id,
            { name, document, email, password, balance, pixKey, city },
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

    public login(request: Request, socket: any): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest){
            return;
        }

        const payload = request.body.payload;

        const { email, password } = payload as LoginPayload;
        
        this.customerService.auth(email, password, socket);
    }

}