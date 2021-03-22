import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
const md5 = require('md5');

@Injectable()
export class SignatureGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const { signature, ...rest } = request.body;


    const convertObjectFormattedString = <T>(
      object: T,
      method: string,
      url: string,
    ): string => {
      const paramsArr = [];

      const convertObjectParamsArr = <T>(object: T): void => {
        Object.entries(object).forEach((entry) => {
          if (typeof entry[1] === 'object') {
            return convertObjectParamsArr(entry[1]);
          }
          paramsArr.push(entry.join('='));
        });
      };

      convertObjectParamsArr(object);
      const paramsStr = paramsArr
        .sort((a, b) => a[0].localeCompare(b[0]))
        .join('and');
      const resultStr = `${method}${url}-${paramsStr}`;
      return resultStr;
    };

    const md5SignatureString = md5(convertObjectFormattedString(rest, method, url));

    console.log(md5SignatureString);

    if (signature !== md5SignatureString) {
      return false;
    }
    return true;
  }
}
