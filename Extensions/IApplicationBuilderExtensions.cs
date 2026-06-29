using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Extensions.Hosting;
using Microsoft.Net.Http.Headers;
using System;
using System.Linq;
using Webority.Web.Common.RedirectRules;

namespace Webority.Web.GovIndia.Extensions
{
    public static class IApplicationBuilderExtensions
    {
        /// <summary>
        /// Blocks search-engine indexing on *.azurewebsites.net domains.
        /// </summary>
        public static IApplicationBuilder UseSeoProtection(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (context.Request.Host.Host.EndsWith(".azurewebsites.net", StringComparison.OrdinalIgnoreCase))
                {
                    context.Response.Headers["X-Robots-Tag"] = "noindex, nofollow, noarchive";
                }
                await next();
            });

            return app;
        }

        /// <summary>
        /// Static files with aggressive caching (365 days) and CORS for images.
        /// </summary>
        public static IApplicationBuilder UseWeborityStaticFiles(this IApplicationBuilder app)
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                OnPrepareResponse = (context) =>
                {
                    var headers = context.Context.Response.GetTypedHeaders();

                    headers.CacheControl = new CacheControlHeaderValue
                    {
                        Public = true,
                        MaxAge = TimeSpan.FromDays(365)
                    };

                    var path = context.Context.Request.Path.Value?.ToLowerInvariant() ?? string.Empty;
                    if (IsImageFile(path))
                    {
                        var rawHeaders = context.Context.Response.Headers;
                        rawHeaders["Access-Control-Allow-Origin"] = "*";
                        rawHeaders["Access-Control-Allow-Methods"] = "GET, HEAD, OPTIONS";
                        rawHeaders["Access-Control-Allow-Headers"] = "*";
                        rawHeaders["Cross-Origin-Resource-Policy"] = "cross-origin";
                    }
                }
            });

            return app;
        }

        private static bool IsImageFile(string path)
        {
            var imageExtensions = new[]
            {
                ".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".ico",
                ".bmp", ".tiff", ".tif", ".heic", ".heif", ".avif"
            };

            return imageExtensions.Any(ext => path.EndsWith(ext, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// URL rewriting: trailing-slash + lowercase; HTTPS/HSTS + error pages outside development.
        /// </summary>
        public static IApplicationBuilder UseWeborityUrlRewriting(this IApplicationBuilder app, IWebHostEnvironment env)
        {
            var rewriteOptions = new RewriteOptions()
                .Add(new RemoveTrailingSlashPermanent())
                .Add(new RedirectToLowerCasePermanent());

            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
                app.UseHsts();
            }

            app.UseRewriter(rewriteOptions);

            if (!env.IsDevelopment())
            {
                app.UseExceptionHandler("/Error/500");
                app.UseStatusCodePagesWithReExecute("/Error/{0}");
            }

            return app;
        }
    }
}
