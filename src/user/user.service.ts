import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerDto: RegisterDto) {
    return await this.userModel.create({
      fname: registerDto.fname,
      lname: registerDto.lname,
      email: registerDto.email,
      password: registerDto.password,
    });
  }
}
