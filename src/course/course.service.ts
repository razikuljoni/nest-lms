import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './schemas/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  async create(createCourseDto: CreateCourseDto) {
    try {
      return await this.courseModel.create(createCourseDto);
    } catch (error: unknown) {
      const err = error as { code?: number };
      const DUPLICATE_KEY_ERROR_CODE = 11000;
      if (err?.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new ConflictException('Course with this name already exists');
      }

      throw new InternalServerErrorException('Failed to create course');
    }
  }

  async findAll() {
    return await this.courseModel.find({}).exec();
  }

  async findOne(id: string) {
    const course = await this.courseModel.findById(id).exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse = await this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, {
        new: true,
      })
      .exec();

    if (!updatedCourse) {
      throw new NotFoundException('Course not found');
    }

    return updatedCourse;
  }

  async delete(id: string) {
    const deletedCourse = await this.courseModel.findByIdAndDelete(id).exec();

    if (!deletedCourse) {
      throw new NotFoundException('Course not found');
    }

    return deletedCourse;
  }
}
