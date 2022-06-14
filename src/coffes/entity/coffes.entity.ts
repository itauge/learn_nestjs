import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity('coffes') // sql table === 'coffe'
export class Coffes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendation: number;

  @JoinTable()
  @ManyToMany(
      (type) => Flavor,
      (flavor) => flavor.coffes,
      {
    cascade: true,
  })
  flavors: Flavor[];
}
