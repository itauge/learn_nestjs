import {
  Body,
  Delete,
  Get,
  Injectable, NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from "@nestjs/common";
import { Coffes } from './entity/coffes.entity';

@Injectable()
export class CoffesService {
  private coffes: Coffes[] = [
    {
      id: 123,
      name: 'One',
      brand: 'Be cool',
      flavors: ['Chocolate', 'vanila'],
    },
  ];

  findAll() {
    return this.coffes;
  }

  findOne(id: string) {
    const coffe = this.coffes.find((item) => item.id === +id);
    if (!coffe) {
      throw new NotFoundException(`Coffe ${id} not found`);
    }
    return coffe;
  }

  create(createCoffeDto: any) {
    this.coffes.push(createCoffeDto);
    return createCoffeDto;
  }

  update(id: string, updateCoffeDto: any) {
    const existingCoffe = this.findOne(id);
    if (existingCoffe) {
      //update the existing entity
    }
  }

  remove(id: string, deleteCoffeDto: any) {
    const coffeIndex = this.coffes.findIndex((item) => item.id === +id);
    if (coffeIndex >= 0) {
      this.coffes.splice(coffeIndex, 1);
    }
  }
}
