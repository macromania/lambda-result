import { ServiceResult } from '../index';

test('Service Result Should Be Successful', () => {
    // Arrange & Act
    const successfulResult = ServiceResult.Succeeded(true);

    // Assert
    expect(successfulResult.content).toBe(true);
    expect(successfulResult.failure).toBe(false);
    expect(successfulResult.error).toBeNull();
});
