import pup from "puppeteer"
import userAgent from "user-agents"
import { readFileSync, writeFileSync } from "fs"
import { env } from "process"
import path from "path"
import { deleteCookie, loader } from "../misc"

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") })

const args = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-infobars",
  "--window-position=0,0",
  "--ignore-certifcate-errors",
  "--ignore-certifcate-errors-spki-list"
]

const options = {
  args,
  headless: true,
  ignoreHTTPSErrors: true
}

export async function login() {
  deleteCookie()
  try {
    const browser = await pup.launch(options)
    const page = (await browser.pages())[0]
    // page.setDefaultNavigationTimeout(0)
    page.setUserAgent(userAgent.toString())

    page.on("response", function (response) {
      const url = response.url()
      if (url.includes("/auth/login")) {
        const cookies = response.headers()["set-cookie"]
        writeFileSync(
          "cookie.txt",
          cookies
            .split("\n")
            .find((w) => w.includes("open_id_token"))
            ?.split("; ")[0] as string
        )
      }
    })
    const l = loader()

    await page.goto("https://www.redbubble.com/auth/login", {
      waitUntil: "networkidle2"
    })

    if (!env.RB_USER || !env.RB_PASS) {
      browser.close()
      return { error: "No Credentials" }
    }

    console.log("Logging in with credentials:")
    console.log(">> Username: ", env.RB_USER)
    console.log(">> Password: ", env.RB_PASS)

    await page.type("#ReduxFormInput1", env.RB_USER)
    await page.type("#ReduxFormInput2", env.RB_PASS)

    const btn = await page.$$('button[type="submit"]')
    btn[1].click()

    await page.waitForNavigation()
    await new Promise((r) => setTimeout(r, 3000))
    browser.close()

    clearInterval(l)

    return { message: "Done" }
  } catch (e) {
    return { error: e }
  }
}

export const startSession = async () => {
  try {
    const cookie = readFileSync("cookie.txt")
    return cookie.toString()
  } catch (e) {
    console.log("\x1b[33m%s\x1b[0m", "Attempting to login...")
    const res = await login()
    if (res.error) {
      console.log("\x1b[31m%s\x1b[0m", "Login failed...")
      deleteCookie()
      return null
    }
    const cookie = readFileSync("cookie.txt")
    console.log("\x1b[32m%s\x1b[0m", "Session Loaded.")
    return cookie.toString()
  }
}
