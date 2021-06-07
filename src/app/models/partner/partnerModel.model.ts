/**
 * Essa é a interface do Parceiro. EX: DetranDF, DetranGO....;
 */
import { BaseModel } from '../base.model';

export interface PartnerModel extends BaseModel {
  dataAbertura: Date;
}