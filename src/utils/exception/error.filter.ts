import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export class ErrorCustomException extends HttpException {
  constructor(message: string, statusCode: HttpStatus, property: string = '') {
    super(
      {
        message,
        property,
      },
      statusCode,
    )
  }

  static handle(error: Error, property?: string) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
        case 'P2016':
          throw new ErrorCustomException(
            'NOT_FOUND',
            HttpStatus.NOT_FOUND,
            property,
          )
        case 'P2021':
          throw new ErrorCustomException(
            'DATABASE_CONNECTION_ERROR',
            HttpStatus.INTERNAL_SERVER_ERROR,
            property,
          )
        case 'P2002':
          throw new ErrorCustomException(
            'EXISTS',
            HttpStatus.CONFLICT,
            property,
          )
        default:
          throw new ErrorCustomException(error.message, 400, property)
      }
    } else if (error instanceof ErrorCustomException) {
      throw error
    } else {
      throw new ErrorCustomException('Something went wrong!', 500, property)
    }
  }
}

@Catch(ErrorCustomException)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<any>()
    let message = exception.getResponse()['message']

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message,
      property: exception.getResponse()['property'],
    })
  }
}
