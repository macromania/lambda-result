import { ServiceResult } from 'lambda-result';
import { ServiceRequest, ServiceResponse } from './service-types';

export class Service {
    public static doSomething(request: ServiceRequest): ServiceResult<ServiceResponse> {
        const message: ServiceResponse = {
            message: `Hello ${request.name}!`,
        };
        return ServiceResult.Succeeded(message);
    }
}
