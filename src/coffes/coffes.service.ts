import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffes } from './entity/coffes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';

@Injectable()
export class CoffesService {
  // private coffes: Coffes[] = [
  //   {
  //     id: 123,
  //     name: 'One',
  //     brand: 'Be cool',
  //     flavors: ['Chocolate', 'vanila'],
  //   },
  // ];

  constructor(
    @InjectRepository(Coffes)
    private readonly coffeRepository: Repository<Coffes>,
  ) {}

  findAll() {
    return this.coffeRepository.find();
  }

  async findOne(id: number) {
    // const coffe = this.coffes.find((item) => item.id === +id);
    const coffe = await this.coffeRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!coffe) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffe;
  }

  create(createCoffeDto: CreateCoffeDto) {
    const coffe = this.coffeRepository.create(createCoffeDto);
    return this.coffeRepository.save(coffe);
  }

  async update(id: string, updateCoffeDto: UpdateCoffeDto) {
    const coffe = await this.coffeRepository.preload({
      id: +id,
      ...updateCoffeDto,
    });
    if (!coffe) {
      throw new NotFoundException(`Coffe ${id} is not found`);
    }
    return this.coffeRepository.save(coffe);
  }

  async remove(id: number) {
    // const coffeIndex = this.coffes.findIndex((item) => item.id === +id);
    // if (coffeIndex >= 0) {
    //   this.coffes.splice(coffeIndex, 1);
    // }
    const coffe = await this.coffeRepository.findOne({
      where: {
        id: id,
      },
    });
    return this.coffeRepository.remove(coffe);
  }
}
