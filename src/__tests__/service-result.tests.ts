import { ServiceResult } from '../index';

describe('Test ServiceResult', () => {
    test('Service Result Should Be Successful', () => {
        // Arrange & Act
        const successfulResult = ServiceResult.Succeeded(true);

        // Assert
        expect(successfulResult.content).toBe(true);
        expect(successfulResult.failure).toBe(false);
        expect(successfulResult.error).toBeNull();
    });

    test('Error Details Should Be Visible', () => {
        // Arrange & Act
        const errorResult = ServiceResult.Failed({
            errorMessage: 'Error Message',
            errorType: 'Error Type',
            details: {
                'Error Detail': 'Error Detail',
            }
        });

        // Assert
        expect(errorResult.failure).toBe(true);
        expect(errorResult.error).toBeDefined();
        expect(errorResult.error!.errorMessage).toBe('Error Message');
        expect(errorResult.error!.errorType).toBe('Error Type');
        expect(errorResult.error!.details).toBeDefined();
    });
});
