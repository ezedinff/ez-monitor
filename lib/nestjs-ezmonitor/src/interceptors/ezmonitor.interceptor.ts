import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EzmonitorService } from '../services/ezmonitor.service';

@Injectable()
export class EzmonitorInterceptor implements NestInterceptor {
  constructor(private readonly ezmonitorService: EzmonitorService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;

    return next.handle().pipe(
      tap(async () => {
        const res = context.switchToHttp().getResponse();
        const responseTime = Date.now() - now;
        const statusCode = res.statusCode;

        await this.ezmonitorService.sendReport({
          app_name: process.env.APP_NAME || 'Unknown',
          endpoint: `${method} ${url}`,
          response_time: responseTime,
          status_code: statusCode,
          cpu_usage: this.ezmonitorService.getCpuUsage(),
          memory_usage: this.ezmonitorService.getMemoryUsage(),
        });
      }),
    );
  }
}