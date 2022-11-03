using IdentityModel;
using IdentityServer4;
using IdentityServer4.Models;
using IdentityServer4.Test;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace IdentityServer
{
    public class Config
    {
        

        public static IEnumerable<Client> Clients(IConfiguration configuration)
        {
            string getClientOrigin()
            {
                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
                {
                    return configuration.GetValue<string>("ClientOrigin");
                }
                else
                {
                    return Environment.GetEnvironmentVariable("ClientOrigin");
                }
            }

            return new Client[]
            {
                new Client
                {
                    ClientId = "todoClient",
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    ClientSecrets =
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile
                    }
                },
                new Client
                {
                    ClientId = "todo_mvc_client",
                    ClientName = "Todo MVC Web App",
                    AllowedGrantTypes = GrantTypes.Code,
                    RequirePkce = false,
                    AllowRememberConsent = false,
                    AllowOfflineAccess = true,
                    RedirectUris = new List<string>()
                    {
                        $"{getClientOrigin()}/signin-oidc",
                        $"{getClientOrigin()}/silent-signin"
                    },
                    PostLogoutRedirectUris = new List<string>()
                    {
                        $"{getClientOrigin()}/signout-callback-oidc"
                    },
                    ClientSecrets = new List<Secret>
                    {
                        new Secret("secret".Sha256())
                    },
                    AllowedScopes = new List<string>
                    {
                        IdentityServerConstants.StandardScopes.OpenId,
                        IdentityServerConstants.StandardScopes.Profile,
                        IdentityServerConstants.StandardScopes.OfflineAccess,
                    },
                    AccessTokenLifetime = 8000,
                    IdentityTokenLifetime = 7200,
                    UpdateAccessTokenClaimsOnRefresh = true,
                    AllowAccessTokensViaBrowser = true,
                }
            };
            
        }

        public static IEnumerable<ApiScope> ApiScopes =>
           new ApiScope[]
           {
               new ApiScope("todoAPI", "Todo API")
           };

        public static IEnumerable<ApiResource> ApiResources =>
          new ApiResource[]
          {
               //new ApiResource("movieAPI", "Movie API")
          };

        public static IEnumerable<IdentityResource> IdentityResources =>
          new IdentityResource[]
          {
              new IdentityResources.OpenId(),
              new IdentityResources.Profile()
          };

        public static List<TestUser> TestUsers =>
            new List<TestUser>
            {
                new TestUser
                {
                    SubjectId = "5BE86359-073C-434B-AD2D-A3932222DABE",
                    Username = "mingji",
                    Password = "swn",
                    Claims = new List<Claim>
                    {
                        new Claim(JwtClaimTypes.GivenName, "mingji"),
                        new Claim(JwtClaimTypes.FamilyName, "heng")
                    }
                }
            };
    }
}