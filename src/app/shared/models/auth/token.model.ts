export class Token {
  accessToken: string;
  refreshToken: string;
  expiration: Date;

  setAuth(auth: any) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiration = auth.expiration;
  }

}
