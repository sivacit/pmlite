import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('PM Lite API')
    .setDescription('The PMLite API description')
    .setVersion('1.0')
    .addTag('Project Management')
    .addBearerAuth()
    .build();
    
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, documentFactory);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
// Apply the JWT Auth Guard globally
  // app.useGlobalGuards(new JwtAuthGuard());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
