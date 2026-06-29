using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Webority.Web.Common.Extensions;
using Webority.Web.Common.Routing;
using Webority.Web.Common.Services;

namespace Webority.Web.GovIndia.Extensions
{
    public static class IServiceCollectionExtensions
    {
        public static IServiceCollection AddWeborityApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<ISitemapService, SitemapService>();
            services.AddSingleton<IRouteRedirectService, AttributeRedirectService>();

            return services;
        }

        /// <summary>
        /// Adds Razor Pages with kebab-case routing and (in development) runtime compilation.
        /// </summary>
        public static IServiceCollection AddWeborityRazorPages(this IServiceCollection services, IWebHostEnvironment env)
        {
            var razorPages = services.AddRazorPages().AddRazorPagesOptions(options =>
            {
                options.Conventions.Add(new KebabCasePageRouteModelConvention());
            }).AddMvcOptions(options =>
            {
                if (env.IsProduction())
                {
                    options.CacheProfiles.Add("RazorPageCache", new CacheProfile()
                    {
                        Duration = 3600,
                        Location = ResponseCacheLocation.Any,
                        VaryByHeader = "Accept-Encoding"
                    });
                }
            });

            if (env.IsDevelopment())
            {
                razorPages.AddRazorRuntimeCompilation();
            }

            return services;
        }

        /// <summary>
        /// Configures cookies and antiforgery tokens with GDPR-compliant defaults.
        /// </summary>
        public static IServiceCollection AddWeborityCookies(this IServiceCollection services, IWebHostEnvironment env)
        {
            services.Configure<CookiePolicyOptions>(options =>
            {
                options.CheckConsentNeeded = context =>
                {
                    if (!env.IsProduction()) return false;
                    return false; // consent handled at the tracking-script level
                };

                options.MinimumSameSitePolicy = SameSiteMode.Lax;
                options.Secure = CookieSecurePolicy.Always;
            });

            services.AddWeborityAntiforgery(env);

            return services;
        }
    }
}
