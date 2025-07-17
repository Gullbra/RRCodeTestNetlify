
export interface IApiResponse<T> {
  data: T,
  message: string,
  errors: string[],
  success: boolean
}
