import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AUTH_SERVICE_NAME,
  ValidateResponse,
} from './auth.pb';

@Injectable()
export class AuthService {
  private svc: AuthServiceClient;
  private logger = new Logger();

  @Inject(AUTH_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  public async validate(token: string): Promise<ValidateResponse> {
    this.logger.log('Call ' + this.validate.name);
    return firstValueFrom(this.svc.validate({ token }));
  }
}
