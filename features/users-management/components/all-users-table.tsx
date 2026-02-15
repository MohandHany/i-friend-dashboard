"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import VisibleIcon from "@/public/visible-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllParents, AllParentsItem } from "@/services/queries/users-management/GET/get-all-parents"
import { UsersFilter } from "./users-filter"
import { formatRegistrationDate } from "@/lib/utils"

export function AllUsersTable() {

  const [kidsFilter, setKidsFilter] = useState("");
  const [subscriptionFilters, setSubscriptionFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<AllParentsItem[]>([]);
  const itemsPerPage = 10;

  const pathname = usePathname();

  const filteredUsers = users.filter((user) => {
    const matchesName = search
      ? user.name?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchesKids = kidsFilter
      ? user.kidsCount.toString() === kidsFilter
      : true;
    const matchesSubscription =
      subscriptionFilters.length > 0
        ? subscriptionFilters.includes(
          user.isSubscribed ? "Subscribed" : "Not Subscribed",
        )
        : true;

    let matchesDate = true;
    if (dateFilter) {
      // Mock date format: "23 March,2024"
      // We need to handle the comma carefully or rely on Date parsing
      const userDate = new Date(user.registrationDate || "");
      const filterDate = new Date(dateFilter);
      // Compare by locale date string or similar to ignore time
      matchesDate = userDate.toDateString() === filterDate.toDateString();
    }

    return matchesName && matchesKids && matchesSubscription && matchesDate;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllParents();
        if (res.success && res.data) {
          setUsers(res.data.users ?? []);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <Card className="w-full bg-white rounded-xl border">
        <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4 p-4">
          <CardTitle className="text-black text-lg font-semibold grow m-0">
            All Users
          </CardTitle>
          <UsersFilter
            kidsFilter={kidsFilter}
            setKidsFilter={setKidsFilter}
            subscriptionFilters={subscriptionFilters}
            setSubscriptionFilters={setSubscriptionFilters}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            search={search}
            setSearch={setSearch}
            onReset={() => {
              setKidsFilter("");
              setSubscriptionFilters([]);
              setDateFilter("");
              setSearch("");
              setCurrentPage(1);
            }}
          />
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead className="w-[50px] text-center font-bold text-lg">
                  #
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Kids
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Subscription State
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Registration Date
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.kidsCount}</TableCell>
                  <TableCell>
                    <span
                      className={`text-${user.isSubscribed ? "success" : "danger"}`}
                    >
                      {user.isSubscribed ? "Subscribed" : "Not Subscribed"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatRegistrationDate(user.registrationDate)}
                  </TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-center">
                      <Button
                        asChild
                        variant="ghost"
                        className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1"
                      >
                        <Link href={`${pathname}/parent-details/${user.id}`}>
                          <VisibleIcon className="h-5! w-5!" />
                          View
                        </Link>
                      </Button>
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
