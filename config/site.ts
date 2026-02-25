export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: {
    title: string
    href: string
  }[]
}

export const siteConfig: SiteConfig = {
  name: "Street Food Finder",
  description: "Discover the best street food in your city with real-time updates and reviews.",
  url: "https://streetfoodfinder.vercel.app",
  ogImage: "https://streetfoodfinder.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/streetfoodfinder",
    github: "https://github.com/streetfoodfinder/app",
  },
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Browse Stalls",
      href: "/stalls",
    },
    {
      title: "Map View",
      href: "/map",
    },
    {
      title: "About",
      href: "/about",
    },
  ],
}
