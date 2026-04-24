import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StudentMaster } from './entities/student-master.entity.js';

@Injectable()
@Dependencies(getRepositoryToken(StudentMaster))
export class StudentsService {
  constructor(studentsRepository) {
    this.studentsRepository = studentsRepository;
  }

  findAll() {
    return this.studentsRepository.find();
  }

  findOne(registerno) {
    return this.studentsRepository.findOneBy({ registerno });
  }

  create(student) {
    return this.studentsRepository.save(student);
  }

  async remove(registerno) {
    await this.studentsRepository.delete(registerno);
  }

  async clearAll() {
    await this.studentsRepository.clear();
    return { message: 'All student master records have been cleared' };
  }
}
