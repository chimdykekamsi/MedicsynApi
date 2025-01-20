import { Response } from "express";

class APIResponse<T> {
  private constructor(
    private readonly status: number,
    private readonly data?: T,
    private readonly message?: string,
    private readonly success?: boolean,
    private readonly error?: string
  ) {}

  static success<T>(message: string, data: T, statusCode = 200): APIResponse<T> {
    return new APIResponse<T>(statusCode, data, message, true);
  }

  static error(error: string, statusCode = 500): APIResponse<unknown> {
    return new APIResponse<unknown>(statusCode, undefined, undefined, false, error);
  }

  send(res: Response): void {
    res.status(this.status).json({
      success: this.success,
      message: this.message,
      data: this.data,
      error: this.error,
    });
  }
}

export default APIResponse;
