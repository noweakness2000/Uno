import { readdirSync } from "node:fs";
import path from "node:path";
import { HomeView } from "./home-view";

/**
 * Unit ids that have art in public/images/units. Reading the folder here
 * (server side) means dropping in `unit-9.png` shows up with no code change;
 * anything without a file gets the icon tile in UnitPath.
 */
function listUnitImageIds(): string[] {
  try {
    return readdirSync(path.join(process.cwd(), "public", "images", "units"))
      .filter((name) => /^unit-\d+\.png$/.test(name))
      .map((name) => name.replace(/\.png$/, ""));
  } catch {
    return [];
  }
}

export default function HomePage() {
  return <HomeView unitImageIds={listUnitImageIds()} />;
}
