import { APIGatewayProxyEvent } from 'aws-lambda';
import { SuccessResult, ErrorResult } from 'lambda-result';
import { Service } from './service';
import { ServiceValidator } from './validator';

exports.handler = async (event: APIGatewayProxyEvent) => {
    // Validate incoming payload and convert to request
    const request = ServiceValidator.validate(event);
    if (request.failure) {
        return ErrorResult.responseFromFailure(request.error);
    }

    // Run request via server (Adaptor pattern)
    const result = Service.doSomething(request.content!);

    // If service results a failure/error, return with API Gateway Proxy compatible result
    if (result.failure) {
        console.error(result);
        return ErrorResult.responseFromFailure(result.error);
    }

    // Return an API Gateway Proxy compatible result
    return SuccessResult.response(result);
};
