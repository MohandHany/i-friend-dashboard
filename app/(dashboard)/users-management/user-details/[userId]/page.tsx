import { UserDetailsContent } from "@/features/users-management/user-details/user-details-content"
import { users } from "@/features/users-management/data/mock-users"

interface UserDetailsPageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { userId } = await params
  const user = users.find((u) => u.id === Number(userId))

  if (!user) {
    return <div>User not found</div>
  }

  return <UserDetailsContent user={user} />
}
