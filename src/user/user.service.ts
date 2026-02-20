import { ConflictException, Injectable } from '@nestjs/common';
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
      console.log('error ==>', error);
      const err = error as { code?: number };

      const DUPLICATE_KEY_ERROR_CODE = 11000;
      if (err?.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new ConflictException('Email is already taken.');
      }
    }
  }
}
