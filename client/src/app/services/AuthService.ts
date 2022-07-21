import { Log, User, UserManager, WebStorageStateStore } from 'oidc-client-ts';

export class AuthService {
    public userManager: UserManager;

    constructor() {
        const settings = {
            authority: process.env.REACT_APP_AUTH_URL!,
            client_id: process.env.REACT_APP_CLIENT_ID!,
            redirect_uri: `${process.env.REACT_APP_PUBLIC_URL!}/signin-oidc`,
            //silent_redirect_uri: `${Constants.clientRoot}silent-renew.html`,
            // tslint:disable-next-line:object-literal-sort-keys
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

        this.userManager.events.addUserLoaded((user) => {
            console.log("user loaded");
            if (window.location.href.indexOf("signin-oidc") !== -1) {
                this.navigateToScreen();
            }
            if (window.location.href.indexOf("silent-signin") !== -1) {
                this.navigateToScreen();
            }
        });

        this.userManager.events.addSilentRenewError((e) => {
            console.log("silent renew error", e.message);
        });

        this.userManager.events.addAccessTokenExpired(() => {
            console.log("token expired");
            this.logout();
        });
    }

    getUser = async () => {
        const user = await this.userManager.getUser();
        if (!user) {
            return await this.userManager.signinRedirectCallback();
        }
        return user;
    };

    signinRedirectCallback = () => {
        this.userManager.signinRedirectCallback().then(() => {
            "";
        });
    };

    signinRedirect = () => {
        this.userManager.signinRedirect({}).then(() => {
            this.userManager.getUser();
        });
    };

    navigateToScreen = () => {
        window.location.replace(`${process.env.REACT_APP_PUBLIC_URL}/todo`);
    };

    isAuthenticated = () => {
        if (!sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_CLIENT_ID}`)) {   
            return false;
        } else {
            const oidcStorage = JSON.parse(sessionStorage.getItem(`oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_CLIENT_ID}`) || '{}');
            return (!!oidcStorage && !!oidcStorage.access_token);
        }
    };

    public renewToken(): Promise<User | null> {
        return this.userManager.signinSilent();
    }

    logout = () => {
        this.userManager.signoutRedirect({
            id_token_hint: sessionStorage.getItem("id_token")!
        });
        this.userManager.clearStaleState();
    };

    signoutRedirectCallback = () => {
        this.userManager.signoutRedirectCallback().then(() => {
            sessionStorage.clear();
            window.location.replace(process.env.REACT_APP_PUBLIC_URL!);
        });
        this.userManager.clearStaleState();
    };

    signinSilent = () => {
        this.userManager.signinSilent()
            .then((user) => {
                console.log("signed in", user);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    signinSilentCallback = () => {
        this.userManager.signinSilentCallback();
    };
}