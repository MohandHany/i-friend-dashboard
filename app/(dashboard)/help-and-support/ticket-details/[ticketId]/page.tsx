import TicketDetails from "@/features/help-and-support/ticket-details/ticket-details";

interface TicketDetailsPageProps {
  params: Promise<{ ticketId: string }>
}

export default async function Page({ params }: TicketDetailsPageProps) {
  const { ticketId } = await params
  return <TicketDetails ticketId={ticketId} />;
}
