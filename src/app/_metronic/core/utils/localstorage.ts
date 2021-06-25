export class localStorage {
    
    public obterUsuario() {
        return JSON.parse(localStorage.getItem('devio.user'));
    }
    static getItem(arg0: string): string {
        throw new Error("Method not implemented.");
    }

    public salvarDadosLocaisUsuario(response: any) {
        this.salvarUsuario(response.userToken);
    }

    public salvarUsuario(user: string) {
        localStorage.setItem('devio.user', JSON.stringify(user));
    }
    static setItem(arg0: string, arg1: string) {
        throw new Error("Method not implemented.");
    }

}