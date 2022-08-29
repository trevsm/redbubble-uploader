import { gql } from "graphql-request"
import { useQuery } from "../hooks/useQuery"

export const withDefaultInventoryItems = gql`
  query withDefaultInventoryItems(
    $workId: Int!
    $locale: String!
    $unit: ihs_Unit!
    $previewTypeIds: [String!]
  ) {
    ihs_defaultInventoryItems(
      workId: $workId
      locale: $locale
      unit: $unit
      previewTypeIds: $previewTypeIds
    ) {
      id
      description
      productPageUrls {
        fallbackUrl
      }
      productTypeId
      previewSet {
        previews {
          previewTypeId
          url
        }
      }
    }
  }
`

export const useGetInventoryItems = async (workId: number) => {
  return useQuery(withDefaultInventoryItems, {
    workId: workId,
    locale: "en",
    unit: "CM",
    previewTypeIds: ["default"]
  })
}
