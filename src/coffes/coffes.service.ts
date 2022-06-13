import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffes } from './entity/coffes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Flavor } from './entity/flavor.entity';

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
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  findAll() {
    return this.coffeRepository.find({ relations: ['flavors'] });
  }

  async findOne(id: number) {
    // const coffe = this.coffes.find((item) => item.id === +id);
    const coffe = await this.coffeRepository.findOne({
      where: {
        id: id,
      },
      relations: ['flavors'],
    });
    if (!coffe) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffe;
  }

  async create(createCoffeDto: CreateCoffeDto) {
    const flavors = await Promise.all(
      createCoffeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffe = this.coffeRepository.create({
      ...createCoffeDto,
      flavors,
    });
    return this.coffeRepository.save(coffe);
  }

  async update(id: string, updateCoffeDto: UpdateCoffeDto) {
    const flavors =
      updateCoffeDto.flavors &&
      (await Promise.all(
        updateCoffeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffe = await this.coffeRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavors,
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

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: {
        name: name,
      },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name: name });
  }
}
