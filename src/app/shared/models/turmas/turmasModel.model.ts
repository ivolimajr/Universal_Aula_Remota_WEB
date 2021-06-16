export interface TurmasModel {
    id: number;
    cursoId:number;
    instrutorId:number;
    turma:string;
    alunos?: [];    
    link:string;
    dataInicio: Date;
    dataFim:Date;
    matricula:number;
}