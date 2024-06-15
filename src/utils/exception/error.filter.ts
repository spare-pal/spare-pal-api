import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export class CustomException extends HttpException {
  private readonly logger = new Logger(CustomException.name)

  constructor(
    message: string,
    statusCode: HttpStatus,
    detail: string = '',
    model: string = '',
  ) {
    super(
      {
        message,
        detail,
        model,
      },
      statusCode,
    )
  }

  static handle(error: any, detail?: string) {
    console.error(error)
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2025':
        case 'P2016':
          throw new CustomException(
            'Not found',
            HttpStatus.NOT_FOUND,
            detail ?? (error?.meta?.cause as string) ?? '',
            (error?.meta?.modelName as string) ?? '',
          )
        case 'P2021':
          throw new CustomException(
            'Invalid data',
            HttpStatus.INTERNAL_SERVER_ERROR,
            detail ?? (error?.meta?.cause as string) ?? '',
            (error?.meta?.modelName as string) ?? '',
          )
        case 'P2002':
          throw new CustomException(
            'Conflict',
            HttpStatus.CONFLICT,
            detail ?? (error?.meta?.cause as string) ?? '',
            (error?.meta?.modelName as string) ?? '',
          )
        default:
          console.error(error)
          throw new CustomException(
            error.message,
            HttpStatus.BAD_REQUEST,
            detail ?? (error?.meta?.cause as string) ?? '',
            (error?.meta?.modelName as string) ?? '',
          )
      }
    } else if (error instanceof CustomException) {
      throw error
    } else {
      throw new CustomException('Something went wrong!', 500, detail)
    }
  }
}

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    const exceptionResponse = exception.getResponse()
    const message = exceptionResponse['message'] || 'Something went wrong!'
    const model = exceptionResponse['model'] || ''
    const detail = exceptionResponse['detail'] || model

    this.logger.error({ message, detail })

    response.status(exception.getStatus()).json({
      message,
      detail,
      statusCode: exception.getStatus(),
    })
  }
}
