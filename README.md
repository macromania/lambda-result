# Lambda Result

With respect to API Gateway Lambda Proxy results, there are certain conventions we need to provide from Lambda response detailed at: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html

In order to achieve this a simple lambda should always return success and error response in the following format:

**Success**

```typescript
statusCode: result.statusCode,
body: JSON.stringify({
    status: result.status,
    data: result.content,
    error: result.error,
}),
```

**Error**

```typescript
statusCode: 401,
body: JSON.stringify({
    errorType: 'Anauthorized',
    errorMessage: 'No Access',
}),
```

This can be achieved by wrapping the service layer methods with a `ServiceResult` entity influenced by Java’s [Optional pattern](https://community.oracle.com/tech/developers/discussion/4418055/optionals-patterns-and-good-practices) which is used for explicitly expressing the possible result of an action and keeping `Exceptions` as exceptional as possible at infrastructure level or new runtime issues that needs fixing.

A simple `ServiceResult` wrapper could be like below:

```typescript
export interface ErrorResponse {
    errorMessage: string;
    errorType: string;
    details?: any;
}

export class ServiceResult<T> {
    public readonly success: boolean;
    public readonly failure: boolean;
    public readonly statusCode: number;
    public readonly status: string;
    public readonly content: T | null;
    public readonly error: ErrorResponse | null;

    private constructor(content: T | null, error: ErrorResponse | null, success: boolean) {
        this.content = content;
        this.error = error;
        this.success = success;
        this.failure = !success;
        this.statusCode = success ? 200 : 400;
        this.status = success ? "Success" : "Error";
    }

    public static Succeeded<T>(content: T): ServiceResult<T> {
        return new ServiceResult<T>(content, null, true);
    }

    public static Failed<T>(error: ErrorResponse): ServiceResult<T> {
        return new ServiceResult<T>(null, error, false);
    }
}
```

Recently, I have used this pattern a lot and am keen to provide this as a public npm module for your Serverless API layer.

## Benefits

-   Human readable error codes returned by conventions
-   AWS CloudWatch and API Gateway compatible conventions
-   Developer productivity

## Usage

```typescript
exports.handler = async (event: APIGatewayProxyEvent) => {
    // Validate incoming payload and convert to request
    const request = ServiceValidator.validate(event);

    // Run request via server (Adaptor pattern)
    const result = await myService.doSomething(request);

    // If service results a failure/error, return with API Gateway Proxy compatible result
    if (result.failure) {
        console.error(result);
        return ErrorResult.responseFromFailure(result.error);
    }

    // Return an API Gateway Proxy compatible result
    return SuccessResult.response(result);
};
```

The same simplicity will be achieved at the service layer with something like this:

```typescript

export class MyService {

  async function doSomething(request: MyServiceRequest): Promise<ServiceResult<MyServiceResponse>> {

      try {
          const someOperationResult = await someThingElse.process(request);
          return ServiceResult.Succeeded(someOperationResult);
      }
      catch(e) {
          return ServiceResult.Failed({
                errorMessage: e,
                errorType: 'OperationError',
          });
      }
  }
}

```
