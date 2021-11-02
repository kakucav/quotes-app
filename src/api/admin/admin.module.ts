import { Module } from '@nestjs/common';
import { AdminQuoteModule } from './admin-quote/admin-quote.module';
import { AdminUserModule } from './admin-user/admin-user.module';

@Module({
  imports: [AdminQuoteModule, AdminUserModule],
})
export class AdminModule {}
