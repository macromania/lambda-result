import { APIGatewayProxyResult } from 'aws-lambda';
import { ServiceResult } from './index';

export class SuccessResult {
    static response<T>(result: ServiceResult<T>) {
        const response: APIGatewayProxyResult = {
            statusCode: result.statusCode,
            body: JSON.stringify({
                status: result.status,
                data: result.content,
                error: result.error,
            }),
        };

        return response;
    }
}
