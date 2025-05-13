import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketTable } from "@/components/market-table"
import { Search } from "lucide-react"

export default function MarketsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <img src="/images/crypto-logo.png" alt="CryptoTrade Logo" className="h-8 w-auto" />
          <h1 className="text-lg font-semibold">Markets</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search markets..." className="w-[200px] pl-8 md:w-[300px]" />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Explore cryptocurrency markets, prices, and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="gainers">Gainers</TabsTrigger>
                <TabsTrigger value="losers">Losers</TabsTrigger>
                <TabsTrigger value="volume">Volume</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <MarketTable />
              </TabsContent>
              <TabsContent value="gainers" className="space-y-4">
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Top gainers would be displayed here
                </div>
              </TabsContent>
              <TabsContent value="losers" className="space-y-4">
                <div className="text-center py-8 text-sm text-muted-foreground">Top losers would be displayed here</div>
              </TabsContent>
              <TabsContent value="volume" className="space-y-4">
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Highest volume coins would be displayed here
                </div>
              </TabsContent>
              <TabsContent value="favorites" className="space-y-4">
                <div className="text-center py-8 text-sm text-muted-foreground">You have no favorite markets yet</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
