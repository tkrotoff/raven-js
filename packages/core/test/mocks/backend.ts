import { Scope } from '@sentry/hub';
import { Breadcrumb, SentryEvent } from '@sentry/types';
import { Backend, Options } from '../../src/interfaces';

export interface TestOptions extends Options {
  test?: boolean;
  mockInstallFailure?: boolean;
}

export class TestBackend implements Backend {
  public static instance?: TestBackend;

  public installed: number;
  public event?: SentryEvent;

  public constructor(private readonly options: TestOptions) {
    TestBackend.instance = this;
    this.installed = 0;
  }

  public install(): boolean {
    this.installed += 1;
    return !this.options.mockInstallFailure;
  }

  public async eventFromException(exception: any): Promise<SentryEvent> {
    return {
      exception: [
        {
          type: 'Error',
          value: 'random error',
        },
      ],
      message: String(exception),
    };
  }

  public async eventFromMessage(message: string): Promise<SentryEvent> {
    return { message };
  }

  public async sendEvent(event: SentryEvent): Promise<number> {
    this.event = event;
    return 200;
  }

  public storeBreadcrumb(_breadcrumb: Breadcrumb): boolean | Promise<boolean> {
    return true;
  }

  public storeScope(_: Scope): void {
    // noop
  }
}
