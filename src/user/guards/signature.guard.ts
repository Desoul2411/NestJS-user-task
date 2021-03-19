import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
const md5 = require('md5');

@Injectable()
export class SignatureGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const {method,url} = request;
    const { signature, ...rest } = request.body;

    /* let formattedBodyParams = Object.entries(rest)
        .map(([k,v])=> `${k}=${v}`)
        .sort()
        .join('and');

        console.log('formattedBodyParams', formattedBodyParams);

    let md5SignatureString = md5(`${method}and${url.substr(1)}-${formattedBodyParams}`); */

    //let formattedBodyParams = (...args: string[]): string => args.join('');

   /*  const concatArgsIntoString = (...args: string[]): any => {
      
      console.log(args); 

    }  */
/*     const convertObjectToSortedStringByKey = <T>(object: T): string =>
      Object.entries(object)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((result, entry) => {
          if (typeof entry[1] === 'object') {
            return concatArgsIntoString(result, entry[0], convertObjectToSortedStringByKey(entry[1]));
          }

          return concatArgsIntoString(entry[0], entry[1]);
        }, '');

        let formattedBodyParams = convertObjectToSortedStringByKey(rest); */
        //console.log(formattedBodyParams);



    const convertObjectFormattedString = <T>(object: T, method: string, url: string): string => {
      const paramsArr = [];

      const convertObjectParamsArr = <T>(object: T): void => {
        Object.entries(object)
        .forEach((entry) => {
          if (typeof entry[1] === 'object') {
            return convertObjectParamsArr(entry[1]);
          }
          paramsArr.push(entry.join('='))
        });
      };
        
      convertObjectParamsArr(object);
      const paramsStr = paramsArr.sort((a, b) => a[0].localeCompare(b[0])).join('and');
      const resultStr = `${method}${url}-${paramsStr}`;
      return resultStr;
    }

    const md5SignatureString = convertObjectFormattedString(rest, method, url);

    console.log(md5SignatureString);

    if(signature !== md5SignatureString) {
        return false
    }
    return true
  };
}