import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  level: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
