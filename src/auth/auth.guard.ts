/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { UserRequest } from 'src/app.interfaces';
import { ValidateResponse } from './auth.pb';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(AuthService)
  public readonly service: AuthService;
  private logger = new Logger();

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    this.logger.log('Call ' + this.canActivate.name);
    const req: UserRequest = ctx.switchToHttp().getRequest();
    const authorization: string = req.headers['authorization'];

    if (!authorization) {
      this.logger.error('Unauthorized');
      throw new UnauthorizedException();
    }

    const bearer: string[] = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      this.logger.error('Unauthorized bearer');
      throw new UnauthorizedException();
    }

    const token: string = bearer[1];

    this.logger.log("Token: " + token);

    const { status, userId }: ValidateResponse = await this.service.validate(
      token,
    );

    this.logger.log("Status: " + status + " UserId: " + userId);

    req.user = userId;

    if (status !== HttpStatus.OK) {
      this.logger.error('Error status != OK')
      throw new UnauthorizedException();
    }

    this.logger.log(this.canActivate.name + 'return true');
    return true;
  }
}
