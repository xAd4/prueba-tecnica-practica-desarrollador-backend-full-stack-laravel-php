/** Response of GET /version. */
export interface BackendVersionResponse {
  data: {
    name: string
    version: string
  }
}
