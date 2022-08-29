import { startSession } from "./auth/auth"
import { useGetInventoryItems } from "./graphql/withDefaultInventoryItems"

async function main() {
  await startSession()
  const { data, error } = await useGetInventoryItems(123456789)

  if (data) console.log(data)
  if (error) console.log(error)
}

main()
