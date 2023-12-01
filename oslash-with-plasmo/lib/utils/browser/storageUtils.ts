import { Storage } from "@plasmohq/storage";
import type { Shortcut } from "~lib/types";

export async function getDataFromStorage<T>(key) {
  const storage = new Storage({
    area: "local"
  })
  return await storage.get<T>(key)
}

export async function setDataToStorage(key: string, shortcuts: Shortcut[]) {
  const storage = new Storage({
    area: "local"
  })
  await storage.set(key, shortcuts)
}