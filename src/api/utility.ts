import { Response, Request } from "express";

export function returnError(res: Response, missingVariables?: string[]) {
    res.status(400);
    res.send()
}

export function returnSuccess(res: Response, data?: object) {
    res.status(200);
    if (data) {
        res.send(data)
    } else {
        res.send()
    }
}

export function returnUnauthorized(res: Response) {
    res.status(401);
    res.send()
}