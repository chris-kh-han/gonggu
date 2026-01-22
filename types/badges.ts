export interface UserStats {
  postsCreated: number
  postsViewed: number
  bookmarksCount: number
}

export interface Badge {
  slug: string
  name: string
  description: string
  icon: string
}

export interface BadgeDefinition extends Badge {
  condition: (stats: UserStats) => boolean
}
