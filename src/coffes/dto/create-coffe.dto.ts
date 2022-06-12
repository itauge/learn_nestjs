import { IsString } from 'class-validator';

export class CreateCoffeDto {
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsString({ each: true })
  flavors: string[];
}
