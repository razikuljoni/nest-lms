import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(registerDto: RegisterDto) {
    try {
      return await this.userModel.create({
        fname: registerDto.fname,
        lname: registerDto.lname,
        email: registerDto.email,
        password: registerDto.password,
      });
    } catch (error: unknown) {
      const err = error as { code?: number };

      const DUPLICATE_KEY_ERROR_CODE = 11000;
      if (err?.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new ConflictException('Email is already taken.');
      }

      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      return user;
    } catch (error) {
      const err = error as { message?: string };
      throw new InternalServerErrorException(
        err?.message || 'Error finding user by email',
      );
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel.findById(userId).exec();

      return user;
    } catch (error) {
      const err = error as { message?: string };
      throw new InternalServerErrorException(
        err?.message || 'Error finding user by ID',
      );
    }
  }
}
