import { Award, Briefcase, Globe, Users } from "lucide-react"
import { homePageDefaults, type HomePageContent } from "@/lib/content/homepage"

type SocialProofContent = HomePageContent["socialProof"]

const statIcons = [Award, Briefcase, Globe, Users]

export function SocialProofBar({
  content = homePageDefaults.socialProof,
}: {
  content?: SocialProofContent
}) {
  const stats = content.stats.map((stat, index) => ({
    icon: statIcons[index] ?? Award,
    value: stat.value,
    label: stat.label,
  }))

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 lg:px-8 stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className="animate-on-scroll flex flex-col items-center gap-2 text-center">
            <stat.icon className="h-5 w-5 text-accent" />
            <span className="font-serif text-2xl font-bold text-foreground md:text-3xl">{stat.value}</span>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
