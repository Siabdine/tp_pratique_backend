/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AchatService } from './achat.service';
import { CreateAchatDto, PeriodDto } from './dto/create-achat.dto';
import { Achat } from './entities/achat.entity';
import { ProduitPlusAchete } from './interfaces/produit-plus-achete.interface';

@Controller('achats')
export class AchatController {
  constructor(private readonly achatService: AchatService) {}

  @Post()
  async create(@Body() createAchatDto: CreateAchatDto): Promise<Achat> {
    try {
      return await this.achatService.create(createAchatDto);
    } catch (error) {
      throw new HttpException(
        "Erreur lors de la création de l'achat",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(): Promise<Achat[]> {
    try {
      return await this.achatService.findAll();
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des achats',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('total')
  async getTotal(): Promise<{ total: number }> {
    try {
      const total = await this.achatService.getTotalDepenses();
      return { total };
    } catch (error) {
      throw new HttpException(
        'Erreur lors du calcul du total',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('produit-plus-achete')
  async getProduitPlusAchete(
    @Body() periodDto: PeriodDto,
  ): Promise<ProduitPlusAchete | { message: string; produit: null; count: 0 }> {
    console.log('📨 Requête reçue - produit-plus-achete:', {
      date_debut: periodDto.date_debut,
      date_fin: periodDto.date_fin,
      types: {
        date_debut: typeof periodDto.date_debut,
        date_fin: typeof periodDto.date_fin,
      }
    });

    try {
      const result = await this.achatService.getProduitPlusAchete(periodDto);
      console.log('✅ Résultat du service:', result);

      if (!result) {
        console.log('ℹ️  Aucun achat trouvé pour la période');
        return {
          message: 'Aucun achat trouvé pour la période sélectionnée',
          produit: null,
          count: 0,
        };
      }

      console.log('🎯 Produit le plus acheté:', result);
      return result;
    } catch (error) {
      console.error('❌ Erreur dans le contrôleur:', error);

      if (error instanceof BadRequestException) {
        console.log('⚠️  Erreur de validation:', error.message);
        throw error;
      }

      throw new HttpException(
        'Erreur lors du calcul du produit le plus acheté',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('health')
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString()
    };
  }
}