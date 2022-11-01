import { Log, UserManager, WebStorageStateStore } from 'oidc-client-ts';

class AuthService {
    public userManager: UserManager;

    constructor() {
        const settings = {
            authority: process.env.REACT_APP_AUTH_URL!,
            client_id: process.env.REACT_APP_CLIENT_ID!,
            redirect_uri: `${process.env.REACT_APP_PUBLIC_URL!}/signin-oidc`,
            //silent_redirect_uri: `${process.env.REACT_APP_PUBLIC_URL!}/static/silent-renew.html`,
            post_logout_redirect_uri: `${process.env.REACT_APP_PUBLIC_URL!}/signout-callback-oidc`,
            silent_redirect_uri: `${process.env.REACT_APP_PUBLIC_URL!}/silent-signin`,
            client_secret: process.env.REACT_APP_CLIENT_SECRET!,
            response_type: 'code',
            scope: process.env.REACT_APP_CLIENT_SCOPE!,
            userStore: new WebStorageStateStore({ store: window.sessionStorage }),
            automaticSilentRenew: true,
        };

        this.userManager = new UserManager(settings);

        Log.setLogger(console);
        Log.setLevel(Log.INFO);

        this.userManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
        });

        this.userManager.events.addAccessTokenExpired(() => {
            console.log("token expired");
            this.logout();
        });
    }

    getUser =  () => {
        return this.userManager.getUser();
    };

    signinRedirectCallback = () => {
        return this.userManager.signinRedirectCallback();
    };

    signinRedirect = () => {
        return this.userManager.signinRedirect();
    };

    isAuthenticated = () => {
        if (!sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_CLIENT_ID}`)) {   
            return false;
        } else {
            const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_CLIENT_ID}`) || '{}');
            return (!!oidcStorage && !!oidcStorage.access_token);
        }
    };

    logout = () => {
        return this.userManager.signoutRedirect({
            id_token_hint: sessionStorage.getItem("id_token")!
        });
        //this.userManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        return this.userManager.signoutRedirectCallback().then(() => {
            sessionStorage.clear();
        });
        //this.userManager.clearStaleState();
    };

    signinSilentCallback = () => {
        return this.userManager.signinSilentCallback();
    };
}

const authService = new AuthService();

export { authService };