import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const { method, url } = request;

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - now;
        const { statusCode } = response;

        const logPayload = {
          timestamp: new Date().toISOString(),
          method,
          url,
          statusCode,
          durationMs: elapsed,
        };

        // Structured JSON log so that Cloud Logging can parse fields

        console.log(JSON.stringify(logPayload));
      }),
    );
  }
}
