import { APIGatewayProxyResult } from 'aws-lambda';
import { ErrorResponse } from './index';

export class ErrorResult {
    static response(type: string, message: string, details?: string): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 400,
            body: JSON.stringify({
                errorType: type,
                errorMessage: message,
                details,
            }),
        };
        return errorResult;
    }

    static responseFromFailure(error: ErrorResponse | null): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 400,
            body: JSON.stringify({
                errorType: error?.errorType ?? 'An Error',
                errorMessage: error?.errorMessage ?? 'Please try again later',
                details: error?.details,
            }),
        };
        return errorResult;
    }

    static responseFromAuth(): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 401,
            body: JSON.stringify({
                errorType: 'Unauthorized',
                errorMessage: 'No Access',
                details: 'You are not authorized to access this resource. Please contact the administrator.',
            }),
        };
        return errorResult;
    }
}
