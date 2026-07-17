import { AppError } from "./app-error";

export class UnauthorisedError extends AppError {
    constructor(message:string){
        super(message, 401)
    }
}