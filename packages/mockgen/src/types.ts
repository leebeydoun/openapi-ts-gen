import { StatusCodes } from 'http-status-codes'
import { Schema } from 'json-schema-faker'

export interface API {
    [key: string]: Method
}

export interface Method {
    post?: Responses
    get?: Responses
}

export interface Responses {
    responses: Record<StatusCodes, ResponseCode>
}

export interface ResponseCode {
    content: Record<string, { schema: Schema }>
}
