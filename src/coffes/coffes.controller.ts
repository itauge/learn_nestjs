import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffesService } from './coffes.service';
import { CreateCoffeDto } from './dto/create-coffe.dto';
import { UpdateCoffeDto } from './dto/update-coffe.dto';
import {PaginationQueryDto} from "../common/dto/pagination-query.dto";

@Controller('coffes')
export class CoffesController {
  constructor(private readonly coffieServices: CoffesService) {}

  @Get()
  findAll(@Query() pagenationQuery: PaginationQueryDto) {
    // const { limit, offset } = pagination;
    // return `This is coffe and the limit is ${limit}, offset is ${offset}`;
    return this.coffieServices.findAll(pagenationQuery);
  }

  //first get method
  @Get(':id')
  findOne(@Param('id') id: number) {
    // return `This is my id:${id}`;
    console.log(typeof id);
    return this.coffieServices.findOne(id);
  }

  //first post method
  @Post()
  create(@Body() createCoffeDto: CreateCoffeDto) {
    console.log(createCoffeDto instanceof CreateCoffeDto);
    return this.coffieServices.create(createCoffeDto);
  }

  //update method
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeDto: UpdateCoffeDto) {
    // return `This is update ${id}`;
    return this.coffieServices.update(id, updateCoffeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    // return `This is delete ${id}`;
    return this.coffieServices.remove(id);
  }
}
