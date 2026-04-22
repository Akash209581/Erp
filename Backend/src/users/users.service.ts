import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdmissionUser();
    await this.seedFinancerUser();
  }

  private async seedAdmissionUser() {
    const username = 'admission_office';
    const password = 'Admission@2026'; // Stable credentials as requested
    
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

  private async seedFinancerUser() {
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

  async findOne(username: string): Promise<User | null> {
    console.log(`Searching for user: ${username}`);
    return this.usersRepository.findOneBy({ username });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
