/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsDate, IsPositive, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAchatDto {
  @IsString({ message: 'Le nom doit être une chaîne de caractères' })
  @MinLength(1, { message: 'Le nom du produit est requis' })
  @Matches(/^[^\d]*$/, { 
    message: 'Le nom du produit ne doit pas contenir de chiffres' 
  })
  nom: string;

  @IsNumber()
  @IsPositive({ message: 'Le prix doit être positif' })
  @Type(() => Number)
  prix: number;

  @IsDate()
  @Type(() => Date)
  date_achat: Date;
}

export class PeriodDto {
  @IsDate({ message: 'La date de début doit être une date valide' })
  @Type(() => Date)
  date_debut: Date;

  @IsDate({ message: 'La date de fin doit être une date valide' })
  @Type(() => Date)
  date_fin: Date;
}
