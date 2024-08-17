import { Module, DynamicModule } from '@nestjs/common';
import { EzmonitorService } from './services/ezmonitor.service';
import { EzmonitorInterceptor } from './interceptors/ezmonitor.interceptor';
import { EzmonitorOptions } from './interfaces/ezmonitor-options.interface';

@Module({})
export class EzmonitorModule {
  static forRoot(options: EzmonitorOptions): DynamicModule {
    return {
      module: EzmonitorModule,
      providers: [
        {
          provide: 'EZMONITOR_OPTIONS',
          useValue: options,
        },
        EzmonitorService,
        EzmonitorInterceptor,
      ],
      exports: [EzmonitorService, EzmonitorInterceptor],
    };
  }
}