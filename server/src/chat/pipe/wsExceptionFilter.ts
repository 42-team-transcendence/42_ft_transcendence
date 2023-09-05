import { ArgumentsHost, BadRequestException, Catch } from "@nestjs/common";
import { BaseWsExceptionFilter, WsException } from "@nestjs/websockets";
import { HttpException } from "@nestjs/common";

@Catch(BadRequestException)
export class BadRequestExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof BadRequestException) {
      const wsException = new WsException(exception.getResponse());
      console.log(exception.getResponse())
      super.catch(wsException, host);
    } else {
      // Handle other cases or log the unknown exception
      super.catch(exception, host);
    }
  }
}