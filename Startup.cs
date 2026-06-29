using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using System;
using Webority.Web.Common.Extensions;
using Webority.Web.GovIndia.Extensions;

namespace Webority.Web.GovIndia
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;

        public Startup(IWebHostEnvironment env)
        {
            _env = env;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Cookie policy, sessions, and antiforgery tokens
            services.AddWeborityCookies(_env);

            // Routing options — SEO-friendly lowercase, no trailing slash
            services.AddRouting(options =>
            {
                options.LowercaseUrls = true;
                options.AppendTrailingSlash = false;
            });

            services.AddHttpContextAccessor();
            services.AddMemoryCache();

            services.AddHsts(options =>
            {
                options.Preload = true;
                options.IncludeSubDomains = true;
                options.MaxAge = TimeSpan.FromDays(365);
            });

            // Razor Pages with kebab-case routing + dev runtime compilation
            services.AddWeborityRazorPages(_env);

            // Sitemap + attribute-based redirect services
            services.AddWeborityApplicationServices();

            services.AddWeborityResponseCompression();

            // Runtime CSS/JS bundling + minification. Source order is load-bearing:
            // Bootstrap first, then the custom cascade with responsive.css last.
            services.AddWebOptimizer(pipeline =>
            {
                pipeline.AddCssBundle("/css/bundle.css",
                    "/css/vendor/bootstrap/bootstrap.min.css",
                    "/css/style.css",
                    "/css/gov-identity.css",
                    "/css/design-polish.css",
                    "/css/responsive.css");

                pipeline.AddJavaScriptBundle("/js/bundle.js",
                    "/js/vendor/bootstrap/bootstrap.bundle.min.js",
                    "/js/main.js",
                    "/js/i18n-dict.js",
                    "/js/lang-toggle.js");
            });

            services.AddHealthChecks()
                .AddCheck("ready", () => HealthCheckResult.Healthy("Application is ready"));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Block indexing on *.azurewebsites.net
            app.UseSeoProtection();

            // Forwarded headers for SSL offloading — before any Request.Scheme check
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseCookiePolicy();

            app.UseWebOptimizer();

            app.UseWeborityResponseCompression();

            // Serve /.well-known/* (security.txt, etc.)
            app.UseWellKnownStaticFiles(_env);

            // Static files with aggressive caching + image CORS
            app.UseWeborityStaticFiles();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(new DeveloperExceptionPageOptions
                {
                    SourceCodeLineCount = 5
                });
            }

            // Trailing-slash + lowercase rewrites; HTTPS/HSTS + error pages outside dev
            app.UseWeborityUrlRewriting(_env);

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapHealthChecks("/health");
            });
        }
    }
}
