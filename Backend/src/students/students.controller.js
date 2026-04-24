import { Controller, Get, Post, Body, Param, UseGuards, Dependencies } from '@nestjs/common';
import { StudentsService } from './students.service.js';

@Controller('students')
@Dependencies(StudentsService)
export class StudentsController {
  constructor(studentsService) {
    this.studentsService = studentsService;
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':registerno')
  findOne(@Param('registerno') registerno) {
    return this.studentsService.findOne(registerno);
  }

  @Post()
  create(@Body() student) {
    return this.studentsService.create(student);
  }

  @Post('clear-all')
  clearAll() {
    return this.studentsService.clearAll();
  }
}
