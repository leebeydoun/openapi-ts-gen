import SwaggerParser from '@apidevtools/swagger-parser'
import { StatusCodes } from 'http-status-codes'
import { API, Method } from './types'
import { generate } from 'json-schema-faker'

export class OAResponseGenerator {
    api?: API

    async initialise(src: string) {
        const oaObject = await SwaggerParser.validate(src)
        this.api = oaObject.paths as API

        return this
    }

    generate(
        path: string,
        method: keyof Method = 'get',
        statusCode: StatusCodes = StatusCodes.OK,
        content: string = 'application/json'
    ) {
        if (!this.api)
            throw new Error(
                'API is not initialised. Please call method `initialise` ' +
                    "and await it's completion before trying to generate a mock"
            )

        const apiPath = this.api[path]
        if (!apiPath) throw new Error(`API path ${path} not found in the list of paths available`)

        const apiMethod = apiPath[method]
        if (!apiMethod) throw new Error(`Failed to find API method '${method}' for path ${path}`)

        const apiResponse = apiMethod.responses[statusCode]
        if (!apiResponse)
            throw new Error(
                `Failed to find status code ${statusCode} for API method ${method} in path ${path}`
            )

        const apiContent = apiResponse.content
        if (!apiContent)
            throw new Error(
                `Failed to find 'content' property for ${statusCode} in API method ${method} in path ${path}`
            )

        const mimeDefinition = apiContent[content]
        if (!mimeDefinition) {
            throw new Error(
                `Failed to find ${content} mimetype property in API status ` +
                    `code ${statusCode} in API Method ${method} in path ${path}`
            )
        }
        const schema = mimeDefinition.schema
        if (!schema) {
            throw new Error(
                `Failed to find 'schema' property for ${content}` +
                    ` in API status code ${statusCode} in API Method ${method} in path ${path}`
            )
        }

        return generate(schema)
    }
}
