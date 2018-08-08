var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
((window) => {
    let $ = window.jQuery;
    let Vue = window.Vue;
    let axios = window.axios;
    let _ = window._;
    let webApiUrl = window.webApiUrl;
    let authorized = window.authorized === 'True';
    let app = new Vue({
        el: '#app',
        data: {
            loading: true,
            canvasAccountId: '',
            query: '',
            errorText: '',
            queryRunning: false
        },
        mounted: function () {
            return __awaiter(this, void 0, void 0, function* () {
                if (authorized) {
                }
                this.loading = false;
            });
        },
        methods: {
            generateCourseCSV: function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.queryRunning) {
                        return;
                    }
                    this.queryRunning = true;
                    $("body").css("cursor", "progress");
                    let courseResponse = yield axios.get('/Canvas/GetAllCoursesForAccount?canvasAccountId=' + this.canvasAccountId + '&query=' + this.query + '&courseCode=' + this.courseCode);
                    if (!Array.isArray(courseResponse.data)) {
                        this.errorText = courseResponse.data;
                        $("body").css("cursor", "default");
                        this.queryRunning = false;
                        return;
                    }
                    var courseArray = courseResponse.data;
                    var text = "";
                    for (var i = 0; i < courseArray.length; ++i) {
                        text += courseArray[i].id + ", " + courseArray[i].course_code + ", " + courseArray[i].sis_course_id + ", " + courseArray[i].name + "\r\n";
                    }
                    this.downloadCsv("Export.csv", text);
                    $("body").css("cursor", "default");
                    this.queryRunning = false;
                });
            },
            downloadCsv: function (filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        },
        filters: {
            'formatDate': function (value) {
                if (!value)
                    return '';
                let date = new Date(value);
                // get time
                let hours = date.getHours();
                let minutes = date.getMinutes();
                hours = hours % 12;
                hours = hours ? hours : 12;
                let strTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes}${hours >= 12 ? 'pm' : 'am'}`;
                return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()} ${strTime}`;
            }
        }
    });
})(window);
//# sourceMappingURL=index.js.map