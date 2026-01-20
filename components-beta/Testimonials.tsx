import { cn } from "@/lib/utils"
import { Marquee } from "@/components-beta/ui/marquee"

const reviews = [
    {
      name: "tayo.",
      username: "@_that_creative",
      body: "Axle finally made AI agents make sense. I didn’t need docs, setup, or code — I just built and shipped.",
      img: "https://avatar.vercel.sh/tayo",
    },
    {
      name: "Aurora",
      username: "@Craftedbyaurora",
      body: "I was tired of duct-taping tools together. Axle gave me one place to create and control agents properly.",
      img: "https://avatar.vercel.sh/judah",
    },
    {
      name: "lha wha lhe",
      username: "@lhawhale",
      body: "What sold me was control. My agents actually follow rules and don’t go rogue. That’s rare.",
      img: "https://avatar.vercel.sh/lha",
    },
    {
      name: "Fawas",
      username: "@Saka_Builds",
      body: "Axle replaced hours of manual work. My agents now handle tasks I used to babysit.",
      img: "https://avatar.vercel.sh/fawas",
    },
    {
      name: "iom_future",
      username: "@iom_future",
      body: "This feels like the missing layer between AI and real workflows. Simple, but powerful.",
      img: "https://avatar.vercel.sh/iom",
    },
    {
      name: "Einstein",
      username: "@einstein",
      body: "Any tool that reduces complexity without reducing power is a win. Axle does exactly that.",
      img: "https://avatar.vercel.sh/einstein",
    },
  ]
  

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-72 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
           )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-dark">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-dark/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-dark">{body}</blockquote>
    </figure>
  )
}

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
    </div>
  )
}
