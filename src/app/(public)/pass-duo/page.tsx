import { redirect } from "next/navigation"

// All individual pass pages were consolidated into a single /passes page
// showing every pass side by side. This route is kept so old links/bookmarks
// still land somewhere useful.
export default function PassDuoRedirect() {
  redirect("/passes")
}
