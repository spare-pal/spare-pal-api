import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import AppModule from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.setGlobalPrefix('api')

  await app.listen(process.env.APP_PORT || 3000, async () =>
    console.info('Application running at ', await app.getUrl()),
  )
}

bootstrap()