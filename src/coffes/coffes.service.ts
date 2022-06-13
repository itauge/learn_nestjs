import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffes } from './entity/coffes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import { Flavor } from './entity/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from '../events/entity/event.entity';

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
    private readonly connection: Connection,
  ) {}

  findAll(pagenationQuery: PaginationQueryDto) {
    const { limit, offset } = pagenationQuery;
    return this.coffeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
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

  //Transaction
  async recommendCoffe(coffe: Coffes) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffe.recommendation++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommened_coffe';
      recommendEvent.type = 'coffe';
      recommendEvent.payload = { coffeId: coffe.id };

      await queryRunner.manager.save(coffe);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
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
