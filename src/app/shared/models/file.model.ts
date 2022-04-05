export class FileModel {
    id?: number;
    fileName: string;
    file: File;
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
