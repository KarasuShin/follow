import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { SiteIcon } from "@renderer/components/site-icon"
import { Media } from "@renderer/components/ui/media"
import { getColorScheme, stringToHue } from "@renderer/lib/color"
import { cn } from "@renderer/lib/utils"
import type { CombinedEntryModel, FeedModel } from "@renderer/models"
import type { ReactNode } from "react"
import { useMemo } from "react"

import { PlatformIcon } from "./ui/platform-icon"

export function FeedIcon({
  feed,
  entry,
  fallbackUrl,
  className,
  size = 20,
  fallback = false,
}: {
  feed: FeedModel
  entry?: CombinedEntryModel["entries"]
  fallbackUrl?: string
  className?: string
  size?: number
  /**
   * Image loading error fallback to site icon
   */
  fallback?: boolean
}) {
  const image = entry?.authorAvatar || feed.image

  let ImageElement: ReactNode

  switch (true) {
    case !!image: {
      ImageElement = (
        <PlatformIcon className="mr-2 shrink-0 rounded-sm" url={image}>
          <Media
            src={feed.siteUrl || image}
            type="photo"
            loading="lazy"
            className={cn("rounded-sm", className)}
            style={{
              width: size,
              height: size,
            }}
            proxy={{
              width: size * 2,
              height: size * 2,
            }}
          />
        </PlatformIcon>
      )
      break
    }
    case !!fallbackUrl:
    case !!feed.siteUrl: {
      ImageElement = (
        <SiteIcon
          fallbackText={feed.title!}
          fallback={fallback}
          url={feed.siteUrl || fallbackUrl}
          className={className}
          style={{
            width: size,
            height: size,
          }}
        />
      )
      break
    }
    default: {
      ImageElement = (
        <i
          className="i-mgc-link-cute-re mr-2 shrink-0"
          style={{
            width: size,
            height: size,
          }}
        />
      )
      break
    }
  }

  const colors = useMemo(
    () => getColorScheme(stringToHue(feed.title || feed.url), true),
    [feed.title, feed.url],
  )

  if (!ImageElement) {
    return null
  }

  if (fallback && !!image) {
    return (
      <Avatar className="shrink-0">
        <AvatarImage
          className="duration-200 animate-in fade-in-0"
          src={image || ""}
          asChild
        >
          {ImageElement}
        </AvatarImage>
        <AvatarFallback asChild>
          <span
            style={
              {
                "width": size,
                "height": size,

                "--fo-light-background": colors.light.background,
                "--fo-dark-background": colors.dark.background,
              } as any
            }
            className={cn(
              "mr-2 flex shrink-0 items-center justify-center rounded-sm",
              "bg-[var(--fo-light-background)] text-white dark:bg-[var(--fo-dark-background)] dark:text-black",

              className,
            )}
          >
            <span className="text-xs font-medium">
              {!!feed.title && feed.title[0]}
            </span>
          </span>
        </AvatarFallback>
      </Avatar>
    )
  }

  return ImageElement
}
