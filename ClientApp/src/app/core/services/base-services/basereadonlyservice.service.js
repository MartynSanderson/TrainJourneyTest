"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var operators_1 = require("rxjs/operators");
var BaseReadOnlyService = /** @class */ (function () {
    function BaseReadOnlyService(http, apiEndpointUrl) {
        this.http = http;
        this.apiEndpointUrl = apiEndpointUrl;
    }
    BaseReadOnlyService.prototype.handleError = function (error) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            var errMessage = error.error.message;
            return Observable_1.Observable.throw(errMessage);
            // Use the following instead if using lite-server
            // return Observable.throw(err.text() || 'backend server error');
        }
        return Observable_1.Observable.throw(error || 'Node.js server error');
    };
    // Get all the records for the type of generic model passed in
    BaseReadOnlyService.prototype.getAll = function () {
        return this.http.get(this.apiEndpointUrl)
            .pipe(operators_1.catchError(this.handleError));
    };
    // Gets the record matching the id of the genric model requested
    BaseReadOnlyService.prototype.getById = function (id) {
        return this.http.get(this.apiEndpointUrl + '/' + id)
            .pipe(operators_1.catchError(this.handleError));
    };
    return BaseReadOnlyService;
}());
exports.BaseReadOnlyService = BaseReadOnlyService;
//# sourceMappingURL=basereadonlyservice.service.js.map