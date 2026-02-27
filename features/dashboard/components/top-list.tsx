"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ArrowDownIcon from "@/public/arrow-down-icon";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTopChildren } from "@/services/queries/home/get/get-top-children";
import { topChild } from "@/services/queries/home/get/get-top-children";

export function TopList() {
  const [topChildren, setTopChildren] = useState<topChild[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await getTopChildren()
        const topChildren = result.data
        setTopChildren(topChildren ?? [])
      } catch (error) {
        console.log(error)
      }
    })()
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-medium text-black">
          Top List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-light-natural">
            <TableRow>
              <TableHead className="w-[60px] text-center font-bold text-lg">
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
                  Score Coins
                  <ArrowDownIcon className="w-4 h-4 fill-natural" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Phone
                  <ArrowDownIcon className="w-4 h-4 fill-natural" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topChildren.map((child, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center justify-center">
                  {index + 1 === 1 && (
                    <div>
                      <Image
                        src="/top-one-icon.svg"
                        alt="top-one"
                        width={40}
                        height={40}
                      />
                    </div>
                  )}
                  {index + 1 === 2 && (
                    <div>
                      <Image
                        src="/top-two-icon.svg"
                        alt="top-two"
                        width={40}
                        height={40}
                      />
                    </div>
                  )}
                  {index + 1 === 3 && (
                    <div>
                      <Image
                        src="/top-three-icon.svg"
                        alt="top-three"
                        width={40}
                        height={40}
                      />
                    </div>
                  )}
                  {index + 1 > 3 && (
                    <span>
                      {index + 1}
                    </span>
                  )}
                </TableCell>
                <TableCell>{child.name}</TableCell>
                <TableCell>{child.scoreCoins}</TableCell>
                <TableCell>{child.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
