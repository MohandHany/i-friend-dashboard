"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchIcon from "@/public/search-icon";
import { ArrowLeftIcon } from "@/public/arrow-left-icon";
import { ArrowRightIcon } from "@/public/arrow-right-icon";
import ArrowDownIcon from "@/public/arrow-down-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import FilterationUsersLocation from "./users-location-filter";
import {
  getRegionAnalysis,
  RegionAnalysisItem,
} from "@/services/queries/analysis/get/get-region-analysis";

export function UsersLocationTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<RegionAnalysisItem[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Apply filters
  const filteredRows = rows.filter((r) => {
    const countryOk =
      selectedCountries.length === 0 || selectedCountries.includes(r.country);
    const regionOk =
      selectedRegions.length === 0 || selectedRegions.includes(r.region);
    const term = searchTerm.trim().toLowerCase();
    const searchOk =
      term === "" ||
      r.country.toLowerCase().includes(term) ||
      r.region.toLowerCase().includes(term);
    return countryOk && regionOk && searchOk;
  });

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredRows.slice(startIndex, startIndex + itemsPerPage);

  const toggleCountry = (country: string, checked: boolean) => {
    setCurrentPage(1);
    setSelectedCountries((prev) => {
      const next = checked
        ? [...prev, country]
        : prev.filter((c) => c !== country);
      // After updating countries, recompute allowed regions and prune selectedRegions
      // If no countries are selected, clear region filters entirely
      const allowedRegions =
        next.length === 0
          ? []
          : Array.from(
              new Set(
                rows
                  .filter((r) => next.includes(r.country))
                  .map((r) => r.region),
              ),
            );
      setSelectedRegions((old) =>
        old.filter((rg) => allowedRegions.includes(rg)),
      );
      return next;
    });
  };

  const toggleRegion = (region: string, checked: boolean) => {
    setCurrentPage(1);
    setSelectedRegions((prev) =>
      checked ? [...prev, region] : prev.filter((r) => r !== region),
    );
  };

  // Pagination is purely local based on fetched rows length
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
        const res = await getRegionAnalysis();
        if (res.success && res.data) {
          const mapped: RegionAnalysisItem[] = res.data.data.map((item) => ({
            region: item.region,
            country: item.country,
            totalUser: item.totalUser,
            newUser: item.newUser,
          }));
          setRows(mapped);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div>
      <Card className="w-full bg-white rounded-xl border">
        <CardHeader className="flex flex-row items-center justify-end gap-4 p-4">
          <div className="relative w-72 m-0">
            <SearchIcon className="absolute fill-natural right-2 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search"
              className="pr-10 rounded-lg placeholder:text-natural-text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <FilterationUsersLocation
            rows={rows}
            selectedCountries={selectedCountries}
            selectedRegions={selectedRegions}
            onToggleCountry={toggleCountry}
            onToggleRegion={toggleRegion}
          />
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
                    Total User
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
  );
}
