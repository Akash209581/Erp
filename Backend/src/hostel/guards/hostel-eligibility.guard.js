import { Injectable, Dependencies, ForbiddenException } from '@nestjs/common';
import { StudentsService } from '../../students/students.service.js';

@Injectable()
@Dependencies(StudentsService)
export class HostelEligibilityGuard {
  constructor(studentsService) {
    this.studentsService = studentsService;
  }

  async canActivate(context) {
    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user || (user.role !== 'Student' && user.role !== 'student')) {
      return true; 
    }

    const registerno = user.username || user.registerno; 
    
    if (!registerno) {
        throw new ForbiddenException('Student registration number not found');
    }

    const student = await this.studentsService.findOne(registerno);
    
    if (!student || student.Hostel?.toLowerCase() !== 'yes') {
      throw new ForbiddenException('You are not registered for Hostel. Please contact administration.');
    }

    return true;
  }
}
