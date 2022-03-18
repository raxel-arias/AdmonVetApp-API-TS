export interface PromiseResponse {
    status: number,
    msg: string,
    data?: any
}

export interface ResponseError extends PromiseResponse{
    isError: boolean,
    errorDetails?: any
}