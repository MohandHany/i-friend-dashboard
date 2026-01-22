import { KidDetailsContent } from "@/features/users-management/user-details/kid-details/kid-details-content"
import { kids } from "@/features/users-management/data/mock-kids"

interface KidDetailsPageProps {
  params: Promise<{
    kidId: string
  }>
}

export default async function KidDetailsPage({ params }: KidDetailsPageProps) {
  const { kidId } = await params
  const kid = kids.find((k) => k.id === Number(kidId))

  if (!kid) {
    return <div>Kid not found</div>
  }

  return <KidDetailsContent kid={kid} />
}
