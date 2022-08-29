import { readFileSync } from "fs"
import { request } from "graphql-request"
import { urls } from "../urls"

export const useQuery = async (
  query: string,
  variables?: any
): Promise<{ data?: any; error?: any }> => {
  return request({
    url: urls.gqlEndpoint,
    document: query,
    variables,
    requestHeaders: {
      cookie: readFileSync("cookie.txt").toString()
    }
  })
    .then((data) => ({
      data
    }))
    .catch((error) => ({
      error
    }))
}
