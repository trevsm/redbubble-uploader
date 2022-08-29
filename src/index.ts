import { startSession } from "./auth/auth"

async function main() {
  await startSession()
  console.log("HERE")
}

main()
