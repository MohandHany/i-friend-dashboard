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

const topUsers = [
  { rank: 1, name: "Adham", score: 45, phone: "+0201000000000" },
  { rank: 2, name: "Ali", score: 34, phone: "+0201000000000" },
  { rank: 3, name: "Noor", score: 22, phone: "+0201000000000" },
  { rank: 4, name: "Yara", score: 17, phone: "+0201000000000" },
  { rank: 5, name: "Mahmoud", score: 12, phone: "+0201000000000" },
];

export function TopList() {
  return (
    <Card className="w-full">
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-bold text-black">Top list</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-light-natural">
            <TableRow>
              <TableHead className="w-[60px] text-center font-bold text-lg">#</TableHead>
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
            {topUsers.map((user) => (
              <TableRow key={user.rank}>
                <TableCell className="font-medium flex items-center justify-center">
                  {user.rank === 1 && (
                    <div>
                      <Image src="/top-one-icon.svg" alt="top-one" width={40} height={40} />
                    </div>
                  )}
                  {user.rank === 2 && (
                    <div>
                      <Image src="/top-two-icon.svg" alt="top-two" width={40} height={40} />
                    </div>
                  )}
                  {user.rank === 3 && (
                    <div>
                      <Image src="/top-three-icon.svg" alt="top-three" width={40} height={40} />
                    </div>
                  )}
                  {user.rank > 3 && (
                    <span>
                      {user.rank}
                    </span>
                  )}
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.score}</TableCell>
                <TableCell>
                  {user.phone}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
