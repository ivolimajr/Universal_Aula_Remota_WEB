export class FileModel {
    id?: number;
    userId: number;
    fileName: string;
    file: File;
    files?: File[];
    extension?: string;
    destiny: string;
}
