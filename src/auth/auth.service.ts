import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
    const alreadyExists = await this.userService.findByEmail(registerDto.email);
    if (alreadyExists) {
      throw new InternalServerErrorException('User already exists');
    }
    const saltRounds = 10;
    const hashedPass = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.userService.createUser({
      ...registerDto,
      password: hashedPass,
    });

    const payload = { email: user?.email, sub: user?._id, role: user?.role };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async loginUser(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('User not found.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { email: user.email, sub: user._id, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return { access_token: token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
