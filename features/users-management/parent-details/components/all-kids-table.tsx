"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import VisibleIcon from "@/public/visible-icon";
import ArrowDownIcon from "@/public/arrow-down-icon";
import { ArrowLeftIcon } from "@/public/arrow-left-icon";
import { ArrowRightIcon } from "@/public/arrow-right-icon";
import { useState } from "react";
import { usePathname } from "next/navigation";

import Link from "next/link";

import type { ParentChildrenData } from "@/services/queries/users-management/get/get-parent-details";

export function AllKidsTable({ kids }: { kids: ParentChildrenData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(kids.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentKids = kids.slice(startIndex, startIndex + itemsPerPage);

  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-black text-lg font-medium">
            All Kids
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-natural border-none">
              <TableRow>
                <TableHead className="w-[50px] text-center text-lg font-semibold">
                  #
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Kid Name
                    <ArrowDownIcon className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Reports Count
                    <ArrowDownIcon className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentKids.map((kid, index) => (
                <TableRow key={index + 1}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{kid.name}</TableCell>
                  <TableCell>{kid.reportsCount}</TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-end pr-8">
                      <Link href={`${pathname}/kid-details/${kid.id}`}>
                        <Button
                          variant="ghost"
                          className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1"
                        >
                          <VisibleIcon className="h-5! w-5!" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition" />
            Previous
          </Button>
          <div className="flex items-center gap-2 text-sm">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 ${currentPage === page ? "bg-gray-50" : ""}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 group"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
            <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Button>
        </div>
      )}
    </div>
  );
}
