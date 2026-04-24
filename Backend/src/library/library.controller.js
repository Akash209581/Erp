import { Controller, Get, UseGuards, Dependencies } from '@nestjs/common';
import { LibraryService } from './library.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

@Controller('library')
@Dependencies(LibraryService)
export class LibraryController {
  constructor(libraryService) {
    this.libraryService = libraryService;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getStatus() {
    return { status: 'Library module operational' };
  }
}
