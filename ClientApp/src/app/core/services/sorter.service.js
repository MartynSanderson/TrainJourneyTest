"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var operators_1 = require("rxjs/operators");
var basereadonlyservice_service_1 = require("./basereadonlyservice.service");
var BaseService = /** @class */ (function (_super) {
    __extends(BaseService, _super);
    function BaseService(http, apiEndpointUrl) {
        var _this = _super.call(this, http, apiEndpointUrl) || this;
        _this.http = http;
        _this.apiEndpointUrl = apiEndpointUrl;
        return _this;
    }
    BaseService.prototype.handleError = function (error) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            var errMessage = error.error.message;
            return Observable_1.Observable.throw(errMessage);
            // Use the following instead if using lite-server
            // return Observable.throw(err.text() || 'backend server error');
        }
        return Observable_1.Observable.throw(error || 'Node.js server error');
    };
    // Inserts or Updates the generic model provided
    BaseService.prototype.save = function (model) {
        if (model.id) {
            return this.http.put(this.apiEndpointUrl + '/' + model.id, model)
                .pipe(operators_1.catchError(this.handleError));
        }
        else {
            return this.http.post(this.apiEndpointUrl, model)
                .pipe(operators_1.catchError(this.handleError));
        }
    };
    // Deletes the generic model matching the id provided
    BaseService.prototype.delete = function (id) {
        return this.http.delete(this.apiEndpointUrl + '/' + id)
            .pipe(operators_1.catchError(this.handleError));
    };
    return BaseService;
}(basereadonlyservice_service_1.BaseReadOnlyService));
exports.BaseService = BaseService;
//# sourceMappingURL=baseservice.service.js.map