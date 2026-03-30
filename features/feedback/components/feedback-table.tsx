"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Star } from "lucide-react"
import VisibleIcon from "@/public/visible-icon"
import DeleteIcon from "@/public/delete-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import { FeedbackItem, RatingValue } from "@/services/queries/feedback/get/get-all-feedbacks"

interface FeedbackTableProps {
  feedback: FeedbackItem[]
  startIndex: number
  onView: (feedback: FeedbackItem) => void
  onDelete: (id: string) => void
}

const ratingToStars = (rating: RatingValue): number => {
  switch (rating) {
    case "EXCELLENT": return 5;
    case "VERY_GOOD": return 4;
    case "GOOD": return 3;
    case "FAIR": return 2;
    case "BAD": return 1;
    default: return 0;
  }
};

export function FeedbackTable({ feedback, startIndex, onView, onDelete }: FeedbackTableProps) {
  return (
    <Table>
      <TableHeader className="bg-light-natural">
        <TableRow className="hover:bg-natural/20 border-none">
          <TableHead className="text-center font-bold">#</TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Name
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Rating
              <ArrowDownIcon className="w-3.5 h-3.5" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Email
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center gap-1">
              Phone
              <ArrowDownIcon className="w-4 h-4" />
            </div>
          </TableHead>
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {feedback.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="h-30 text-center text-natural-text">
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="font-medium">No feedback found</p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          feedback.map((item, index) => {
            const fullName = `${item.parent.firstName} ${item.parent.lastName}`;
            const stars = ratingToStars(item.rating);
            return (
              <TableRow key={item.id} className="hover:bg-natural/50 border-b border-natural h-[55px] last:border-none transition-colors">
                <TableCell className="text-center font-medium">
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>
                  {fullName}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
                    <span>{stars}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {item.parent.user.email}
                </TableCell>
                <TableCell>
                  {item.parent.phoneNumber}
                </TableCell>
                <TableCell className="text-right py-0">
                  <div className="flex items-center justify-end gap-2 pr-6">
                    <Button
                      variant="ghost"
                      className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1"
                      onClick={() => onView(item)}
                    >
                      <VisibleIcon className="w-5! h-5!" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-auto text-danger hover:text-danger hover:bg-danger/10 gap-1"
                      onClick={() => onDelete(item.id)}
                    >
                      <DeleteIcon className="w-5! h-5!" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
