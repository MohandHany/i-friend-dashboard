import * as React from "react"
import { UserDetailsContent } from "@/features/refer-and-earn/users/user-details/user-details-content"

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserDetailsPage({ params }: PageProps) {
  const { userId } = await params
  return <UserDetailsContent userId={userId} />
}
