"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formDataToSetJSONformatData = (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
};
exports.default = formDataToSetJSONformatData;
