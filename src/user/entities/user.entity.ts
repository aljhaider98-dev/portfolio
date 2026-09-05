import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true,  })
  emailVerification: boolean;

  @Column({ nullable: true })
  otp: string ;

  @Column()
  password: string;
  @Column({ nullable: true })
  verifyotp: boolean;
}