"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ArrowDownIcon from "@/public/arrow-down-icon"
import DownloadIcon from "@/public/download-icon"

// Mock data for child reports
const reports = [
  { id: 1, name: "Report 23 March,2025", fileName: "Day.pdf" },
  { id: 2, name: "Report 22 March,2025", fileName: "Day.pdf" },
]

interface KidDetailsContentProps {
  kid: any; // Replace 'any' with a proper type if available
}

export function KidDetailsContent({ kid }: KidDetailsContentProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/users-management">Users Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users-management/user-details">User Details</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-muted-foreground font-normal">{kid.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">
          View <span className="text-gray-500">{kid.name}</span>
        </h1>
      </div>

      {/* Profile Details Card */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-black text-lg font-semibold">Profile details</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">First name</span>
              <span className="text-sm font-bold col-span-2">{kid.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Age</span>
              <span className="col-span-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                  {kid.age}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-sm text-gray-500 font-medium">Last name</span>
              <span className="text-sm font-bold col-span-2">{kid.lastName}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Child Report Card */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-black text-lg font-semibold">Child Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-natural border-none">
              <TableRow>
                <TableHead className="w-[50px] text-center text-lg font-semibold">#</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    Name
                    <ArrowDownIcon className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    File name
                    <ArrowDownIcon className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-center font-medium">{report.id}</TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.fileName}</TableCell>
                  <TableCell className="text-right py-0">
                    <div className="flex items-center justify-end">
                      <Button variant="ghost" className="h-auto text-primary-blue hover:text-primary-blue hover:bg-primary-blue/10 gap-1">
                        <DownloadIcon className="!h-5 !w-5" />
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
