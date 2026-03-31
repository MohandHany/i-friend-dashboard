"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ImageIcon from "@/public/image-icon";
import SendIcon from "@/public/send-outline-icon";
import ArrowDownIcon from "@/public/arrow-down-2-icon";
import UserIcon from "@/public/user-bold-icon";
import HeadPhoneIcon from "@/public/head-phone-icon";
import AddReply from "./add-reply-card";
import { getOneTicket, SingleTicketData } from "@/services/queries/help-and-support/get/get-one-ticket";

export default function TicketDetails({ ticketId }: { ticketId: string }) {
  const [isReplyVisible, setIsReplyVisible] = useState(true);
  const [isAddReplyOpen, setIsAddReplyOpen] = useState(false);
  const [ticket, setTicket] = useState<SingleTicketData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = React.useCallback(async () => {
    setLoading(true);
    const res = await getOneTicket(ticketId);
    if (res.success && res.data) {
      setTicket(res.data);
    }
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  if (loading) {
    return (
      <div className="flex flex-col p-6 items-center justify-center text-natural-text h-32">
        Loading ticket details...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col p-6">
        <h2 className="text-xl font-semibold">Ticket not found</h2>
        <Link href="/help-and-support" className="text-primary-blue hover:underline mt-4">
          Back to Help & Support
        </Link>
      </div>
    );
  }

  const fullName = `${ticket.parent.firstName} ${ticket.parent.lastName}`;
  const hasAttachments = ticket.attachmentUrls && ticket.attachmentUrls.length > 0;
  const isSuggestion = ticket.type.toUpperCase() === "SUGGESTION";

  return (
    <div className="flex flex-col w-full">
      {/* Breadcrumb & Header */}
      <div className="mb-6 flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-natural-text text-base">
            <BreadcrumbItem>
              <BreadcrumbLink href="/help-and-support">
                Help & Support
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/help-and-support">
                {ticket.parent.firstName} {ticket.parent.lastName}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-natural-text">
                {isSuggestion ? `#${ticket.ticketNumber}` : ticket.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-[22px] font-semibold flex gap-2">
          View <span className="text-natural-text">{fullName}</span>
        </h1>
      </div>

      {/* Main Content Area */}
      {isSuggestion ? (
        <Card className="w-full m-0 border-0 shadow-sm border rounded-2xl overflow-hidden">
          <CardHeader className="p-4 border-b border-natural">
            <h2 className="text-lg font-medium mb-0 ml-2 capitalize">
              {ticket.type.toLowerCase()}
            </h2>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col gap-8 text-sm font-medium">
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="text-natural-text pt-0.5">Title</div>
                <div className="text-black font-semibold">{ticket.title}</div>
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div className="text-natural-text pt-0.5">Description</div>
                <div className="min-w-0 text-black font-semibold leading-relaxed break-all">
                  {ticket.description}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Card: Problem */}
          <Card className="flex-1 w-full m-0 border-0 shadow-sm border rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row justify-between items-center p-3 border-b border-natural">
              <h2 className="text-lg font-medium mb-0 ml-2 capitalize">
                {ticket.type.toLowerCase()}
              </h2>
              <Button
                className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-xl p-5"
                onClick={() => setIsAddReplyOpen(true)}
              >
                <SendIcon className="w-5! h-5! -rotate-45 -translate-y-0.5" />
                Reply
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-6 text-sm font-medium">
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-4">
                  <div className="text-natural-text pt-0.5">Title</div>
                  <div className="min-w-0 break-all">{ticket.title}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-4">
                  <div className="text-natural-text pt-0.5">Description</div>
                  <div className="min-w-0 break-all text-black">
                    {ticket.description}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2 sm:gap-4">
                  <div className="text-natural-text pt-0.5">Attachment</div>
                  <div className="flex flex-wrap gap-4 min-w-0">
                    {hasAttachments ? (
                      ticket.attachmentUrls?.map((url, i) => (
                        <div
                          key={i}
                          className="w-40 h-40 bg-natural rounded-2xl flex items-center justify-center overflow-hidden"
                        >
                          {/* Rendering image if it's a URL, otherwise fallback to the icon style */}
                          {url.startsWith("http") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={url}
                              alt={`Attachment ${i}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-16 h-16 opacity-50 text-natural-text" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-natural-text">No attachments</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card: Reply */}
          <Card className="flex-1 w-full lg:max-w-md m-0 border-0 shadow-sm border rounded-2xl overflow-hidden break-all">
            <CardHeader className="flex flex-row justify-between items-center p-5">
              <div className="flex items-center gap-2 mb-0">
                <h2 className="text-lg font-medium mb-0">Reply</h2>
                {ticket.messages.length > 0 && (
                  <span className="text-sm text-primary-blue bg-primary-blue/10 px-2.5 py-1 rounded-full">
                    {ticket.messages.length}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                className="text-natural-text hover:text-black hover:bg-transparent"
                onClick={() => setIsReplyVisible(!isReplyVisible)}
              >
                <ArrowDownIcon
                  className={`w-5 h-5 transition-transform duration-300 ${isReplyVisible ? "rotate-180" : ""
                    }`}
                />
              </Button>
            </CardHeader>

            <div
              className={`grid transition-all duration-300 ease-in-out ${isReplyVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
              <div className="overflow-hidden">
                <CardContent className="p-5 pt-0 flex flex-col gap-6 ">
                  {ticket.messages.length === 0 ? (
                    <div className="text-center text-natural-text py-4 text-sm">
                      No replies yet.
                    </div>
                  ) : (
                    ticket.messages.map((msg) => {
                      const isUser = msg.sender === "USER";
                      return (
                        <div key={msg.id} className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            {isUser ? (
                              <div className="w-[35px] h-[35px] rounded-full bg-natural overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {ticket.parent.avatarUrl &&
                                  ticket.parent.avatarUrl.startsWith("http") ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={ticket.parent.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="w-[20px] h-[20px] opacity-50 text-natural-text" />
                                )}
                              </div>
                            ) : (
                              <div className="w-[35px] h-[35px] rounded-full bg-primary-blue flex-shrink-0 flex items-center justify-center text-white">
                                <HeadPhoneIcon className="w-5.5 h-5.5 pr-[1px]" />
                              </div>
                            )}
                            <div className="font-semibold text-sm">
                              {isUser ? fullName : "You"}
                            </div>
                          </div>
                          <div className="text-natural-text text-sm break-all">
                            {msg.message}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      )}

      <AddReply
        isOpen={isAddReplyOpen}
        onClose={() => setIsAddReplyOpen(false)}
        ticketId={ticketId}
        onSuccess={fetchTicket}
      />
    </div>
  );
}
