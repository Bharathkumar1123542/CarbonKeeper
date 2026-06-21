import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(input: unknown, init?: unknown) { void input; void init; }
  } as unknown as typeof Request;
}
if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body?: unknown, init?: unknown) { void body; void init; }
  } as unknown as typeof Response;
}

expect.extend(toHaveNoViolations);
