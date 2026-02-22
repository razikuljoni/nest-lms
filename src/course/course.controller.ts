import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/auth/user.types';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const createdCourse = await this.courseService.create(createCourseDto);

    return {
      message: 'Course created successfully',
      status: 'ok',
      data: createdCourse,
    };
  }

  @Get()
  async findAll() {
    const courses = await this.courseService.findAll();

    return {
      message: 'Courses retrieved successfully',
      status: 'ok',
      data: courses,
      meta: {
        total: courses.length,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(id);

    return {
      message: 'Course retrieved successfully',
      status: 'ok',
      data: course,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const updatedCourse = await this.courseService.update(id, updateCourseDto);
    return {
      message: 'Course updated successfully',
      status: 'ok',
      data: updatedCourse,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedCourse = await this.courseService.delete(id);
    return {
      message: 'Course deleted successfully',
      status: 'ok',
      data: deletedCourse,
    };
  }
}
