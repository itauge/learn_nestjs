import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('coffes') // sql table === 'coffe'
export class Coffes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('json', { nullable: true })
  flavors: string[];
}
