// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: 'v726demo1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'https://your-domain.com/api',
  auth: {
    api: false,
    url: 'https://localhost:44319/api/auth/v1/signin',
    clientId: 'leandro',
    clientSecret: 'admin123',
    cookieNameClientCredentials: 'access-token-client-hom',
    cookieName: 'access-token-hom',
    last_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2OGM5MjMwOTFjZjc0OGI1YTE4OWUxYjIxYWI0NGIxNiIsInVuaXF1ZV9uYW1lIjoibGVhbmRybyIsImV4cCI6MTY1NDcxMzQ1OCwiaXNzIjoiRXhlbXBsZUlzc3VlciIsImF1ZCI6IkV4ZW1wbGVBdWRpZW5jZSJ9.dcQ1LxhQSltFjyJBV2tcMdUTvnaK4ssb67C6aw0KEzo'
  },
  serviceUrl: {
    domain: 'localhost'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
