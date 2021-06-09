/**
 * Essa INTERFACE tem como base todos os atributos que todos os outros Models devem ter;
 */
export interface BaseModel {
  id: number; // ID de cada usuário
  fullName: string; // Esse atributo valerá tanto para o nome do usuário do sistema quanto para o nome do C.F.C
  email: string; // Esse atributo será o email de contato e o Email de acesso a plataforma.
  status: number; // Active = 1 | Suspended = 2 | Pending = 3
  telefone: string ;
  
}
