import { describe, expect, it } from "vitest";

import {
  loginBodySchema,
  registerBodySchema,
} from "@/models/auth/auth.validation";

describe("registerBodySchema", () => {
  it("accepts a valid payload and normalizes the email", () => {
    const parsed = registerBodySchema.parse({
      email: "  User@Example.com  ",
      password: "supersecret",
      name: "  Chris  ",
    });
    expect(parsed.email).toBe("user@example.com");
    expect(parsed.password).toBe("supersecret");
    expect(parsed.name).toBe("Chris");
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(() =>
      registerBodySchema.parse({
        email: "user@example.com",
        password: "short",
      }),
    ).toThrow(/at least 8/i);
  });

  it("rejects invalid emails", () => {
    expect(() =>
      registerBodySchema.parse({
        email: "not-an-email",
        password: "supersecret",
      }),
    ).toThrow();
  });

  it("defaults missing name to an empty string", () => {
    const parsed = registerBodySchema.parse({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(parsed.name).toBe("");
  });
});

describe("loginBodySchema", () => {
  it("normalizes the email", () => {
    const parsed = loginBodySchema.parse({
      email: "  USER@EXAMPLE.COM  ",
      password: "anything",
    });
    expect(parsed.email).toBe("user@example.com");
  });

  it("rejects empty passwords", () => {
    expect(() =>
      loginBodySchema.parse({ email: "user@example.com", password: "" }),
    ).toThrow();
  });
});
