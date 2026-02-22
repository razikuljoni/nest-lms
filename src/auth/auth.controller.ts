import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterDto } from './dto/registerUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const userData = await this.authService.registerUser(registerDto);

    return {
      message: 'User registered successfully',
      status: 'ok',
      access_token: userData.access_token,
      data: userData.data,
    };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.loginUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    return {
      message: 'Login successful',
      status: 'ok',
      access_token: user.access_token,
      data: user.data,
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const userId = req.user?.sub;
    const user = await this.userService.getUserById(userId);
    return {
      message: 'Profile retrieved successfully',
      status: 'ok',
      data: user,
    };
  }
}
