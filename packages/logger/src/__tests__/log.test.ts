import { describe, it, expect, jest } from "@jest/globals";
import { log } from "..";

jest.spyOn(global.console, "log");

describe("@repo/logger", () => {
  it("prints a message", () => {
    log("hello");
    // eslint-disable-next-line no-console -- testing console
    expect(log).toBeCalledWith("LOGGER: ", "hello");
  });
});
