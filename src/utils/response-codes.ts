import { Response } from "express";
const responseCodes = {
    success: {
        ok: (res: Response, data: unknown, message = 'Success') => {
            return res.status(200).json({
                status: 200,
                message: message,
                data: data
            });
        },
        created: (res: Response, data: unknown, message = 'Resource created successfully') => {
            return res.status(201).json({
                status: 201,
                message: message,
                data: data
            });
        }
    },
    clientError: {
        badRequest: (res: Response, message = 'Bad Request') => {
            return res.status(400).json({
                status: 400,
                message: message
            });
        },
        unauthorized: (res: Response, message = 'Unauthorized') => {
            return res.status(401).json({
                status: 401,
                message: message
            });
        },
        forbidden: (res: Response, message = 'Forbidden') => {
            return res.status(403).json({
                status: 403,
                message: message
            });
        },
        notFound: (res: Response, message = 'Resource not found') => {
            return res.status(404).json({
                status: 404,
                message: message
            });
        }
    },
    serverError: {
        internalServerError: (res: Response, message = 'Internal Server Error') => {
            return res.status(500).json({
                status: 500,
                message: message
            });
        },
        serviceUnavailable: (res: Response, message = 'Service Unavailable') => {
            return res.status(503).json({
                status: 503,
                message: message
            });
        }
    }
};

export {responseCodes};
