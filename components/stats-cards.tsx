import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCards() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium">
            Active users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">500</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center rounded-lg bg-danger/10 px-2 py-1 text-xs font-medium text-danger">
                -1.8%
              </span>
              <span>last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium">
            Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">2,230</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
                +9.6%
              </span>
              <span>last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium">
            Non-subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">500</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="inline-flex items-center rounded-lg bg-success/10 px-2 py-1 text-xs font-medium text-success">
                +9.6%
              </span>
              <span>last month</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
