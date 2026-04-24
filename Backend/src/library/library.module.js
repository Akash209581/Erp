import { Module } from '@nestjs/common';
import { LibraryService } from './library.service.js';
import { LibraryController } from './library.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
