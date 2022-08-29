import { unlinkSync } from "fs"

export const loader = function () {
  const P = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
  let x = 0
  return setInterval(function () {
    process.stdout.write("\r" + P[x++] + " ")
    if (x === P.length) x = 0
  }, 100)
}

export const deleteCookie = () => {
  try {
    unlinkSync("cookie.txt")
  } catch (e) {
    //
  }
}
