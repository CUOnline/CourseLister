using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CourseLister.Models
{
    public class Course
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("course_code")]
        public string CourseCode { get; set; }

        [JsonProperty("sis_course_id")]
        public string SisCourseId { get; set; }

        [JsonProperty("account_id")]
        public string AccountId { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
