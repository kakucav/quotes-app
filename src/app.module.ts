import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeormConfig from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './api/app/category/category.module';
import { QuoteModule } from './api/app/quote/quote.module';
import { UserModule } from './api/app/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { AdminModule } from './api/admin/admin.module';
import { SlugModule } from './service/slug/slug.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import routes from './routes';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register(routes),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeormConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    CategoryModule,
    QuoteModule,
    UserModule,
    AuthModule,
    AdminModule,
    SlugModule,
  ],
})
export class AppModule {}
