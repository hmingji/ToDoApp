using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Reflection;
using IdentityServer4.EntityFramework.DbContexts;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;
using IdentityServer4.EntityFramework.Mappers;
using IdentityServer.Data;
using IdentityServerHost.Quickstart.UI;
using IdentityServer4.Services;
using Microsoft.Extensions.Logging;

namespace IdentityServer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        private string getClientOrigin()
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
            {
                return Configuration.GetValue<string>("ClientOrigin");
            }
            else
            {
                return Environment.GetEnvironmentVariable("ClientOrigin");
            }
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            string connStr;

            if (env == "Development")
            {
                // Use connection string from file.
                connStr = Configuration.GetConnectionString("IdentityServerConnection");
            }
            else
            {
                // Use connection string provided at runtime by Heroku.
                var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
                //connStr = connUrl;
                // Parse connection URL to connection string for Npgsql
                connUrl = connUrl.Replace("postgres://", string.Empty);
                var pgUserPass = connUrl.Split("@")[0];
                var pgHostDb = connUrl.Split("@")[1];
                var pgHost = pgHostDb.Split("/")[0];
                var pgDb = pgHostDb.Split("/")[1];
                var pgUser = pgUserPass.Split(":")[0];
                var pgPass = pgUserPass.Split(":")[1];
                var pgPort = 5432;

                connStr =
                    $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};SSL Mode=Require;Trust Server Certificate=true";
            }
            services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connStr));
            services
                .AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();
            services.AddCors();
            services.AddMvc(options =>
            {
                options.EnableEndpointRouting = false;
            });

            string connectionString = connStr;
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;

            services
                .AddIdentityServer()
                .AddDeveloperSigningCredential()
                .AddAspNetIdentity<IdentityUser>()
                .AddConfigurationStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                        builder.UseNpgsql(
                            connectionString,
                            sql => sql.MigrationsAssembly(migrationsAssembly)
                        );
                })
                .AddOperationalStore(options =>
                {
                    options.ConfigureDbContext = builder =>
                        builder.UseNpgsql(
                            connectionString,
                            sql => sql.MigrationsAssembly(migrationsAssembly)
                        );
                });
            services.AddSingleton<ICorsPolicyService>(
                (container) =>
                {
                    var logger = container.GetRequiredService<ILogger<DefaultCorsPolicyService>>();
                    return new DefaultCorsPolicyService(logger)
                    {
                        AllowedOrigins = { getClientOrigin() }
                    };
                }
            );
            services.ConfigureNonBreakingSameSiteCookies();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            InitializeDatabase(app, Configuration);

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            string publicUrl;

            if (env.IsDevelopment())
            {
                publicUrl = Configuration.GetValue<string>("PublicUrl");
                ;
            }
            else
            {
                publicUrl = Environment.GetEnvironmentVariable("PublicUrl");
            }

            app.Use(
                async (ctx, next) =>
                {
                    ctx.Request.Scheme = "https";
                    ctx.Request.Host = new HostString(publicUrl);

                    await next();
                }
            );
            app.UseStaticFiles();
            app.UseCors(opt =>
            {
                opt.AllowAnyHeader().AllowAnyMethod().WithOrigins(getClientOrigin());
            });
            AccountOptions.ShowLogoutPrompt = false;
            AccountOptions.AutomaticRedirectAfterSignOut = true;
            app.UseCookiePolicy();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}"
                );
            });
        }

        private void InitializeDatabase(IApplicationBuilder app, IConfiguration configuration)
        {
            using (
                var serviceScope = app.ApplicationServices
                    .GetService<IServiceScopeFactory>()
                    .CreateScope()
            )
            {
                var appDbContext =
                    serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                appDbContext.Database.EnsureCreated();
                var appDbCreator = (RelationalDatabaseCreator)
                    appDbContext.Database.GetService<IDatabaseCreator>();

                var grantDbContext =
                    serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>();
                grantDbContext.Database.EnsureCreated();
                var grantDbCreator = (RelationalDatabaseCreator)
                    grantDbContext.Database.GetService<IDatabaseCreator>();

                var configDbContext =
                    serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
                var configDbCreator = (RelationalDatabaseCreator)
                    configDbContext.Database.GetService<IDatabaseCreator>();

                try
                {
                    grantDbContext.Database.Migrate();
                    configDbContext.Database.Migrate();
                    appDbContext.Database.Migrate();
                }
                catch { }

                try
                {
                    configDbCreator.CreateTables();
                    appDbCreator.CreateTables();
                    grantDbCreator.CreateTables();
                }
                catch { }

                if (configDbContext.Clients.Any())
                {
                    configDbContext.Clients.RemoveRange(configDbContext.Clients);
                    foreach (var client in Config.Clients(configuration))
                    {
                        configDbContext.Clients.Add(client.ToEntity());
                    }
                    configDbContext.SaveChanges();
                }
                else
                {
                    foreach (var client in Config.Clients(configuration))
                    {
                        configDbContext.Clients.Add(client.ToEntity());
                    }
                    configDbContext.SaveChanges();
                } // clean the table regardless

                if (!configDbContext.IdentityResources.Any())
                {
                    foreach (var resource in Config.IdentityResources)
                    {
                        configDbContext.IdentityResources.Add(resource.ToEntity());
                    }
                    configDbContext.SaveChanges();
                }

                if (!configDbContext.ApiResources.Any())
                {
                    foreach (var resource in Config.ApiResources)
                    {
                        configDbContext.ApiResources.Add(resource.ToEntity());
                    }
                    configDbContext.SaveChanges();
                }

                if (!configDbContext.ApiScopes.Any())
                {
                    foreach (var apiScope in Config.ApiScopes)
                    {
                        configDbContext.ApiScopes.Add(apiScope.ToEntity());
                    }
                    configDbContext.SaveChanges();
                }
            }
        }
    }
}
