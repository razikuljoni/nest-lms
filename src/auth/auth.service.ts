import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPass,
    });

    const payload = { email: user?.email, sub: user?._id };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
