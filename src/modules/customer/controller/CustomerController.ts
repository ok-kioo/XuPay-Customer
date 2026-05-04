import { CustomerService } from '../service/CustomerService';
import { isValidBodyRequest, Request } from '@/@types/contracts/Request';
import { ErrorHandler } from '@/infra/middleware/Error';

export class CustomerController {
    constructor(
        private customerService: CustomerService
    ) {}

    public createCustomer(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket);
        }

        if(messageBody.payload.kind !== "CREATE_CUSTOMER_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para criação de cliente', socket);
        }

        this.customerService.createCustomer(messageBody.payload.name, messageBody.payload.document, socket);
    }

    public updateCustomer(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket);
        }

        if(messageBody.payload.kind !== "UPDATE_CUSTOMER_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para atualização de cliente', socket);
        }

        this.customerService.updateCustomer(
            messageBody.payload.id,
            messageBody.payload.name,
            messageBody.payload.document,
            messageBody.payload.balance,
            socket
        );
    }
    
    public deleteCustomer(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket);
        }

        if(messageBody.payload.kind !== "DELETE_CUSTOMER_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para exclusão de cliente', socket);
        }

        this.customerService.deleteCustomer(messageBody.payload.id, socket);
    }

    public getCustomer(request: Request, socket: any): void {
        const messageBody = isValidBodyRequest(request.body, socket);

        if (!messageBody){
            return ErrorHandler.handle('Corpo da requisição inválido', socket);
        }

        if(messageBody.payload.kind !== "GET_CUSTOMER_PAYLOAD"){
            return ErrorHandler.handle('Payload inválido para obtenção de cliente', socket);
        }

        this.customerService.getCustomer(messageBody.payload.id, socket);
    }

}