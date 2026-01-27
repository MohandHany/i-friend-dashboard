"use client"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import FilterIcon from "@/public/filter-icon"

type BasicRow = { country: string; region: string }

export type FilterationBarProps = {
  rows: BasicRow[]
  selectedCountries: string[]
  selectedRegions: string[]
  onToggleCountry: (country: string, checked: boolean) => void
  onToggleRegion: (region: string, checked: boolean) => void
}

export default function FilterationUsersLocation({
  rows,
  selectedCountries,
  selectedRegions,
  onToggleCountry,
  onToggleRegion,
}: FilterationBarProps) {
  const countries = Array.from(new Set(rows.map((r) => r.country)))
  const regionsFromSelectedCountries = Array.from(
    new Set(rows.filter((r) => selectedCountries.includes(r.country)).map((r) => r.region))
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" className="bg-primary-blue hover:bg-primary-blue-hover gap-2 rounded-lg p-5">
          <FilterIcon className="w-5.5! h-5.5! fill-white" />
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
                {countries.map((country) => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={`country-${country}`}
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={(val) => onToggleCountry(country, Boolean(val))}
                    />
                    <Label htmlFor={`country-${country}`} className="cursor-pointer text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="region" className="border-b-0">
            <AccordionTrigger className={`text-natural-text px-4 py-2 hover:no-underline hover:bg-muted/50 ${selectedCountries.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
              Region
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0">
              {selectedCountries.length === 0 ? (
                <div className="text-sm text-muted-foreground mt-2">Select a country first to choose regions</div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {regionsFromSelectedCountries.map((region) => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox
                        id={`region-${region}`}
                        checked={selectedRegions.includes(region)}
                        onCheckedChange={(val) => onToggleRegion(region, Boolean(val))}
                      />
                      <Label htmlFor={`region-${region}`} className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {region}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </PopoverContent>
    </Popover>
  )
}