"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, type ReactNode } from "react"
import { MailIcon, PencilIcon, UserRoundIcon } from "lucide-react"

import { useSupportAuth } from "@/app/(support)/support/_components/support-auth-provider"
import { SupportPageLayout } from "@/app/(support)/support/_components/support-page-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { useI18n } from "@/i18n/provider"
import { cn } from "@/lib/utils"

export function SupportProfilePage() {
  const t = useI18n()
  const router = useRouter()
  const { ready, session } = useSupportAuth()

  useEffect(() => {
    if (ready && !session) {
      router.replace("/support/login?next=/support/profile")
    }
  }, [ready, router, session])

  if (!ready || !session) {
    return (
      <SupportPageLayout section="home" contentClassName="py-8">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </SupportPageLayout>
    )
  }

  const user = session.user
  const displayName = user.nickname || user.username
  const fallback = displayName.slice(0, 1).toUpperCase() || "U"

  return (
    <SupportPageLayout
      section="home"
      contentClassName="py-6 sm:py-8"
      startAside={(
        <aside className="h-fit rounded-md bg-card p-5">
          <div className="flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={user.avatar} alt={displayName} />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">{displayName}</h1>
              <p className="truncate text-sm text-muted-foreground">{user.username}</p>
            </div>
          </div>
          <dl className="mt-5 grid gap-3 text-sm">
            <ProfileMeta icon={<UserRoundIcon className="size-4" />} label={t("supportPublic.profile.username")} value={user.username} />
            <ProfileMeta icon={<MailIcon className="size-4" />} label={t("supportPublic.profile.email")} value={user.email || t("supportPublic.profile.emailUnset")} />
          </dl>
          <Link className={cn(buttonVariants(), "mt-5 w-full")} href="/support/profile/edit">
            <PencilIcon />
            {t("supportPublic.profile.edit")}
          </Link>
        </aside>
      )}
    >
      <section className="min-w-0 rounded-md bg-card p-5">
        <h2 className="text-base font-semibold">账号信息</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          在左侧编辑你的账号资料，或返回对话页继续咨询。
        </p>
        <Link className={cn(buttonVariants({ variant: "outline" }), "mt-4")} href="/support/chat">
          返回对话
        </Link>
      </section>
    </SupportPageLayout>
  )
}

function ProfileMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-md bg-muted/45 px-3 py-2">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 flex-1 truncate text-right font-medium">{value}</dd>
    </div>
  )
}
