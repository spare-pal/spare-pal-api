import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import AppModule from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CustomExceptionFilter } from './utils/exception/error.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )
  app.useGlobalFilters(new CustomExceptionFilter())

  const config = new DocumentBuilder()
    .setTitle('Spare Pal')
    .setDescription('API docs for Spare Pal')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(process.env.PORT || 3000, async () =>
    console.info('Application running at ', await app.getUrl()),
  )
}

bootstrap()
