export class FileModel {
    id?: number;
    userId: number;
    fileName: string;
    file: File;
    files?: File[];
    extension?: string;
}

export class FileModelUpdate {
    id: number;
    userId: number;
    files: File[];
    fileName: string;
    extension: string;
    destiny: string;
}
