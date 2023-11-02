export type Shortcut = {
  shortlink: string
  url: string
  createdAt: Date
  updatedAt: Date
}

export type ShortcutValidationResult = {
  shortlink: string,
  url: string
}
