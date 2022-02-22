export class FileModel {
    id?: number;
    fileName: string;
    file: File;
}

export class FileModelUpdate {
    id: number;
    fileName: string;
    extension: string;
    destiny: string;
}
