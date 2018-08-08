using CourseLister.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Rss.Providers.Canvas.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace CourseLister.Controllers
{

    // derive from authorize attribute.
    [Authorize(Roles = RoleNames.AccountAdmin + "," + RoleNames.HelpDesk)]
    public class CanvasController : Controller
    {
        private readonly HttpClient canvasClient;

        public CanvasController(IHttpClientFactory httpClientFactory)
        {
            this.canvasClient = httpClientFactory.CreateClient("CanvasClient");
        }

        public async Task<JsonResult> GetAllCoursesForAccount(string canvasAccountId, string query)
        {
            try
            {
                var response = await GetAllAsync<Course>($"/api/v1/accounts/{canvasAccountId}/courses?search_by=course&search_term={query}&per_page=100");
                return Json(response.Where(x => x.AccountId == canvasAccountId));
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        public async Task<List<T>> GetAllAsync<T>(string apiPath)
        {
            var collection = new List<T>();
            var nextLink = string.Empty;
            do
            {
                var response = string.IsNullOrWhiteSpace(nextLink) ? await canvasClient.GetAsync(apiPath) : await canvasClient.GetAsync(nextLink);

                if(!response.IsSuccessStatusCode)
                {
                    throw new Exception($"{response.StatusCode}: {response.ReasonPhrase}. {await response.Content.ReadAsStringAsync()}");
                }
                nextLink = GetNextLink(response);
                collection.AddRange(JsonConvert.DeserializeObject<List<T>>(await response.Content.ReadAsStringAsync()));
            } while (!string.IsNullOrWhiteSpace(nextLink));

            return collection;
        }

        private string GetNextLink(HttpResponseMessage message)
        {
            if (message.Headers.TryGetValues("Link", out IEnumerable<string> values))
            {
                var links = values.First().Split(',');

                foreach (var relLink in links)
                {
                    var link = relLink.Split(';');
                    if (link[1].Contains("next"))
                    {
                        return link[0].Substring(1, link[0].Length - 2);
                    }
                }
            }

            return string.Empty;
        }
    }
}
