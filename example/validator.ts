import { APIGatewayProxyEvent } from 'aws-lambda';
import { ServiceResult } from 'lambda-result';
import { ServiceRequest } from './service-types';

export class ServiceValidator {
    public static validate(event: APIGatewayProxyEvent): ServiceResult<ServiceRequest> {
        const body = event.body;
        if (body) {
            try {
                const request: ServiceRequest = JSON.parse(body);
                return ServiceResult.Succeeded(request);
            } catch (e) {
                ServiceResult.Failed({
                    errorType: 'ParseError',
                    errorMessage: `${e}`,
                });
            }
        }

        return ServiceResult.Failed({
            errorType: 'ValidationError',
            errorMessage: 'Missing message in the payload',
        });
    }
}
