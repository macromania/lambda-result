import { APIGatewayProxyResult } from "aws-lambda";
import { ErrorResponse, ServiceResult } from "./index";

export class ErrorResult {
    static response(type: string, message: string): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 400,
            body: JSON.stringify({
                errorType: type,
                errorMessage: message,
            }),
        };
        return errorResult;
    }

    static responseFromFailure(error: ErrorResponse | null): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 400,
            body: JSON.stringify({
                errorType: error?.errorType ?? "An Error",
                errorMessage: error?.errorMessage ?? "Please try again later",
            }),
        };
        return errorResult;
    }

    static responseFromAuth(): APIGatewayProxyResult {
        const errorResult: APIGatewayProxyResult = {
            statusCode: 401,
            body: JSON.stringify({
                errorType: "Unauthorized",
                errorMessage: "No Access",
            }),
        };
        return errorResult;
    }
}

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

        console.info(`Response:: ${JSON.stringify(response, null, 2)}`);
        return response;
    }
}
