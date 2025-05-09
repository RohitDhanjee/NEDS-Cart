declare module '@paypal/checkout-server-sdk' {
    export namespace core {
      export class LiveEnvironment {
        constructor(clientId: string, clientSecret: string);
      }
      
      export class SandboxEnvironment {
        constructor(clientId: string, clientSecret: string);
      }
  
      export class PayPalHttpClient {
        constructor(environment: LiveEnvironment | SandboxEnvironment);
        execute<T>(request: unknown): Promise<PayPalResponse<T>>;
      }
  
      export interface PayPalResponse<T = any> {
        statusCode: number;
        result: T;
      }
  
      export class HttpError extends Error {
        statusCode?: number;
        details?: any;
      }
    }
  
    export namespace orders {
      export class OrdersCreateRequest {
        constructor();
        requestBody(body: object): void;
      }
  
      export class OrdersCaptureRequest {
        constructor(orderId: string);
        requestBody(body: object): void;
      }
    }
  }