import { Injectable, Inject } from '@nestjs/common';
import { EzmonitorOptions } from '../interfaces/ezmonitor-options.interface';
import * as os from 'os';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class EzmonitorService {
  private ezMonitorClient: AxiosInstance;

  constructor(
    @Inject('EZMONITOR_OPTIONS')
    private options: EzmonitorOptions,
  ) {
    this.ezMonitorClient = axios.create({
      baseURL: options.apiUrl,
      headers: {
        'X-API-KEY': options.apiKey,
      },
    });
  }

  async sendReport(report: {
    app_name: string;
    endpoint: string;
    response_time: number;
    status_code: number;
    cpu_usage: number;
    memory_usage: number;
    custom_properties?: Record<string, any>;
  }): Promise<void> {
    try {
      await this.ezMonitorClient.post('/report', {
        ...report,
      })
    } catch (error) {
      console.error(error, report);
      throw error
    }
  }

  getCpuUsage(): number {
    const cpus = os.cpus();
    const totalUsage = cpus.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total);
    }, 0);
    return (totalUsage / cpus.length) * 100;
  }

  getMemoryUsage(): number {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    return ((totalMemory - freeMemory) / totalMemory) * 100;
  }
}