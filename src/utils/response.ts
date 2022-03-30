type StatusResponse = 'success' | 'error'
interface DefaultResponse {
    status: string
    message: string
    data: Record<string, string> | Record<string, string>[]
}

/**
 * Builds our default http response for any request
 * @param status - Response's status, it could be 'success' or 'error'
 * @param message - Message to send in the response
 * @param data - Data to send in the response
 * @returns DefaultResponse
 */
export function buildResponse(
    status: StatusResponse,
    message: string,
    data: Record<string, string> | Record<string, string>[]
): DefaultResponse {
    return {
        status,
        message,
        data,
    }
}
