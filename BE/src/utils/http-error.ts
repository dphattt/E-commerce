export type HttpError = Error & { status: number };

export function httpError(message: string, status: number): HttpError {
  return Object.assign(new Error(message), { status });
}
