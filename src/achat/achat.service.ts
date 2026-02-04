/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Achat } from './entities/achat.entity';
import { CreateAchatDto, PeriodDto } from './dto/create-achat.dto';

export interface ProduitPlusAchete {
  produit: string;
  count: number;
}

@Injectable()
export class AchatService {
  constructor(
    @InjectRepository(Achat)
    private achatRepository: Repository<Achat>,
  ) {}

  async create(createAchatDto: CreateAchatDto): Promise<Achat> {
    const achat = this.achatRepository.create(createAchatDto);
    const savedAchat = await this.achatRepository.save(achat);
    
    // Convertir le prix en nombre si nécessaire
    if (savedAchat.prix && typeof savedAchat.prix === 'string') {
      return {
        ...savedAchat,
        prix: parseFloat(savedAchat.prix),
      };
    }
    
    return savedAchat;
  }

  async findAll(): Promise<Achat[]> {
    const achats = await this.achatRepository.find({
      order: {
        date_achat: 'DESC',
      },
    });
    
    // Convertir les prix en nombres
    return achats.map(achat => ({
      ...achat,
      prix: this.ensureNumber(achat.prix),
    }));
  }

  async getTotalDepenses(): Promise<number> {
    const result = await this.achatRepository
      .createQueryBuilder('achat')
      .select('SUM(achat.prix)', 'total')
      .getRawOne();

    const total = result?.total;
    return total ? Number(total) : 0;
  }

  async getProduitPlusAchete(
    periodDto: PeriodDto,
  ): Promise<ProduitPlusAchete | null> {
    if (periodDto.date_fin < periodDto.date_debut) {
      throw new BadRequestException(
        'La date de fin doit être postérieure à la date de début',
      );
    }

    const achats = await this.achatRepository.find({
      where: {
        date_achat: Between(periodDto.date_debut, periodDto.date_fin),
      },
    });

    if (achats.length === 0) {
      return null;
    }

    const countByProduct: Record<string, number> = {};

    achats.forEach((achat) => {
      countByProduct[achat.nom] = (countByProduct[achat.nom] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(countByProduct));
    const produitsMax = Object.entries(countByProduct).filter(
      ([, count]) => count === maxCount,
    );

    if (produitsMax.length > 1) {
      throw new BadRequestException(
        "Plusieurs produits ont le même nombre maximal d'achats",
      );
    }

    return {
      produit: produitsMax[0][0],
      count: maxCount,
    };
  }

  private ensureNumber(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }
}
