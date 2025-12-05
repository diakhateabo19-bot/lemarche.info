import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { Roles } from '../auth/roles.decorator';

class CreateVenteDto {
  details: { produitId: number; quantite: number }[];
  modePaiement: string;
}

@Controller('ventes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VentesController {
  @Post()
  @Roles(Role.CAISSIER)  // ← SEUL LE CAISSIER PEUT PASSER ICI
  create(@Body() createVenteDto: CreateVenteDto, @Request() req) {
    const employeId = req.user.id;
    const magasinId = req.user.magasinId;

    // Ici viendra plus tard la vraie logique :
    // - vérifier stock magasin
    // - diminuer stock
    // - créer la vente + détails + date_heure
    // - générer numéro ticket

    return {
      message: 'Vente enregistrée avec succès !',
      employeId,
      magasinId,
      dateHeure: new Date().toLocaleString('fr-FR'),
      details: createVenteDto.details,
      modePaiement: createVenteDto.modePaiement,
    };
  }
}
