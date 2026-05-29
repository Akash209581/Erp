import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity.js';
import bcrypt from 'bcrypt';
import { ILike } from 'typeorm';

@Injectable()
@Dependencies(getRepositoryToken(User))
export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async onModuleInit() {
    await this.seedAdminUser();
    await this.seedStudentUser();
    await this.seedAdmissionUser();
    await this.seedFinancerUser();
    await this.seedWardenUser();
    await this.seedAdminUser();
  }

  async seedAdminUser() {
    const username = 'admin';
    const password = 'Admin@2026';
    
    const existingUser = await this.usersRepository.findOneBy({ username });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.ADMIN,
        email: 'admin@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Admin user created successfully');
    }
  }

  async seedStudentUser() {
    const username = 'student';
    const password = 'Student@2026';
    
    const existingUser = await this.usersRepository.findOneBy({ username });
    
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.STUDENT,
        email: 'student@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Student user created successfully');
    }
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

  async seedWardenUser() {
    const username = 'hostel_warden';
    const password = 'Warden@2026';
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.WARDEN,
        email: 'warden@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Warden user created successfully');
    }
  }

  async seedAdminUser() {
    const username = 'chief_warden';
    const password = 'Admin@2026';
    const existingUser = await this.usersRepository.findOneBy({ username });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.ADMIN,
        email: 'admin@vignan.ac.in',
      });
      await this.usersRepository.save(user);
      console.log('Admin user created successfully');
    }
  }

  async findOne(username) {
    console.log(`Searching for user: ${username}`);
    if (!username) return null;
    return this.usersRepository.findOne({
      where: { username: ILike(username.trim()) }
    });
  }

  async create(userData) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}
