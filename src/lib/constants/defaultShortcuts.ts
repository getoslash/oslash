import type { Shortcut } from "../types";

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  {
    shortlink: 'o/meet',
    url: 'https://meet.google.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    shortlink: 'o/mail',
    url: 'https://mail.google.com',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    shortlink: 'o/linkedin',
    url: 'https://www.linkedin.com/feed/',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    shortlink: 'o/figma',
    url: 'https://figma.com/',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]