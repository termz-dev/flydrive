import { bookingsOpen } from "@/platform/config";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  return <SiteNav bookingsOpen={bookingsOpen()} />;
}
