import { validateCredentials } from "../app/services/validate-credentials";

describe("validateCredentials", () => {
  it("should return null if no matching user is found", async () => {
    // Arrange
    const username = "nonexistentuser";
    const password = "password123";

    // Act
    const result = await validateCredentials(username, password);

    // Assert
    expect(result).toBeNull();
  });

  it("should return the user data if credentials are valid", async () => {
    // Arrange
    const username = "admin";
    const password = "MyP@ssw0rd";

    // Act
    const result = await validateCredentials(username, password);

    // Assert
    expect(result).toEqual({
      key: "1715C4B2-F0A7-4EC1-92CB-66CE9C73EEF3",
      data: {
        displayName: "admin",
        passwordHash: "b676993c5c591ce1f67b0f0efc4912a8a04782b1283254824c7fb9afc3d7dd3f",
      },
    });
  });
});