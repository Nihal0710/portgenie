import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showWordmark?: boolean
  size?: "sm" | "md" | "lg"
  href?: string
}

const sizes = {
  sm: { mark: 28, text: "text-sm" },
  md: { mark: 32, text: "text-base" },
  lg: { mark: 40, text: "text-lg" },
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="40" height="40" rx="10" className="fill-zinc-100 dark:fill-zinc-900" />
      <rect
        x="0.5"
        y="0.5"
        width="39"
        height="39"
        rx="9.5"
        className="stroke-zinc-200 dark:stroke-zinc-800"
        fill="none"
      />
      <circle cx="20" cy="14" r="3" fill="#ef4444" />
      <path
        d="M12 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 28h20"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M16 18l4 6 4-6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  )
}

export function Logo({
  className,
  showWordmark = true,
  size = "md",
  href = "/",
}: LogoProps) {
  const { mark, text } = sizes[size]

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark size={mark} />
      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-semibold tracking-tight", text)}>
            PortGenie
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
            2.0
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
