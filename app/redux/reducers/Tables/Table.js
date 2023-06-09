"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var TableReducer = function (state, action) {
    if (state === void 0) { state = {
        state: false,
        name: "",
    }; }
    switch (action.type) {
        case "TABLESET":
            state = __assign({}, state, { state: action.state, name: action.table_name });
            break;
        case "CLOSETABLEMODUL":
            state = __assign({}, state, { state: false, name: action.table_name });
            break;
        case "CLOSETABLE":
            state = __assign({}, state, { state: false, name: "" });
            break;
        default:
            return state;
    }
    return state;
};
exports.default = TableReducer;
//# sourceMappingURL=Table.js.map