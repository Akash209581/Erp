import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity.js';
import bcrypt from 'bcrypt';

@Injectable()
@Dependencies(getRepositoryToken(User))
export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async onModuleInit() {
    await this.seedAdmissionUser();
    await this.seedFinancerUser();
  }

  async seedAdmissionUser() {
    const username = 'admission_office';
    const password = 'Admission@2026';
    
    const existingUser = await this.usersRepository.findOneBy({ username });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.ADMISSION,
        email: 'admission@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Admission user created successfully');
    } else {
      console.log('Admission user already exists');
    }
  }

  async seedFinancerUser() {
    const username = 'financer_office';
    const password = 'Finance@2026';
    
    const existingUser = await this.usersRepository.findOneBy({ username });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.FINANCER,
        email: 'finance@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Financer user created successfully');
    } else {
      console.log('Financer user already exists');
    }
  }

  async findOne(username) {
    console.log(`Searching for user: ${username}`);
    return this.usersRepository.findOneBy({ username });
  }

  async create(userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
