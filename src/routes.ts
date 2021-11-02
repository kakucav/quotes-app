import { CategoryModule } from './api/app/category/category.module';
import { QuoteModule } from './api/app/quote/quote.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/app/user/user.module';
import { AdminModule } from './api/admin/admin.module';
import { AdminQuoteModule } from './api/admin/admin-quote/admin-quote.module';
import { AdminUserModule } from './api/admin/admin-user/admin-user.module';
import { Routes } from '@nestjs/core';

const routes: Routes = [
  {
    path: 'categories',
    module: CategoryModule,
  },
  {
    path: 'quotes',
    module: QuoteModule,
  },
  {
    path: 'auth',
    module: AuthModule,
  },
  {
    path: 'users',
    module: UserModule,
  },
  {
    path: 'admin',
    module: AdminModule,
    children: [
      {
        path: 'quotes',
        module: AdminQuoteModule,
      },
      {
        path: 'users',
        module: AdminUserModule,
      },
    ],
  },
];

export default routes;
