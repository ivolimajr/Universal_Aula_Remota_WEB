export class TokenPost {
    userName: string;
    password: string;
}

export class TokenResult {
    authenticated: boolean;
    created: string;
    expiration: string;
    accessToken: string;
    refreshToken: string;
}
