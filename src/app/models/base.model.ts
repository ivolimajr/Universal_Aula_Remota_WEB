export interface BaseModel {
  id: number;
  fullName: string;
  email: string;
  status: number; // Active = 1 | Suspended = 2 | Pending = 3
  dateOfBbirth: string;
  dob: Date; // DATA DE ANIVERSÁRIO EM FORMATO DATE
}
