"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FilterIcon from "@/public/filter-icon"
import SearchIcon from "@/public/search-icon"
import { ArrowLeftIcon } from "@/public/arrow-left-icon"
import { ArrowRightIcon } from "@/public/arrow-right-icon"
import ArrowDownIcon from "@/public/arrow-down-icon"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const usersLocationData = [
  { region: "Cairo", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Riyadh", country: "Saudi arabia", totalUser: "2,340", newUser: "120" },
  { region: "Makkah", country: "Saudi arabia", totalUser: "2,340", newUser: "120" },
  { region: "Alexandria", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Tabuk", country: "Saudi arabia", totalUser: "2,340", newUser: "120" },
  { region: "Dakahlia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Gharbia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
  { region: "Qalyubia", country: "Egypt", totalUser: "2,340", newUser: "120" },
]

export function UsersLocationTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(usersLocationData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = usersLocationData.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div>
      <Card className="w-full bg-white rounded-xl border">
        <CardHeader className="flex flex-row items-center justify-end gap-4 p-4">
          <div className="relative w-72 m-0">
            <SearchIcon className="absolute fill-natural right-2 top-1/2 -translate-y-1/2" />
            <Input placeholder="Search" className="pr-10 rounded-lg placeholder:text-natural-text" />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-lg p-5">
                <FilterIcon className="!w-5.5 !h-5.5 fill-white" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="end">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="country">
                  <AccordionTrigger className="text-natural-text px-4 py-2 hover:no-underline hover:bg-muted/50">
                    Country
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="flex flex-col gap-2 mt-2">
                      {Array.from(new Set(usersLocationData.map(item => item.country))).map((country) => (
                        <div key={country} className="flex items-center space-x-2">
                          <Checkbox id={`country-${country}`} />
                          <Label htmlFor={`country-${country}`} className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {country}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="region" className="border-b-0">
                  <AccordionTrigger className="text-natural-text px-4 py-2 hover:no-underline hover:bg-muted/50">
                    Region
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-0">
                    <div className="flex flex-col gap-2 mt-2">
                      {Array.from(new Set(usersLocationData.map(item => item.region))).map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox id={`region-${region}`} />
                          <Label htmlFor={`region-${region}`} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </PopoverContent>
          </Popover>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-light-natural">
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Region
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Country
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Total user
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    New User
                    <ArrowDownIcon className="w-4 h-4 fill-natural" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.region}</TableCell>
                  <TableCell>{row.country}</TableCell>
                  <TableCell>{row.totalUser}</TableCell>
                  <TableCell>{row.newUser}</TableCell>
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
  )
}
