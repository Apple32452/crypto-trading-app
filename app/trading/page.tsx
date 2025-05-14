"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PriceChart } from "@/components/price-chart"
import { OrderBook } from "@/components/order-book"
import { RecentTrades } from "@/components/recent-trades"
import { FuturesTradingForm } from "@/components/futures-trading-form"
import { PositionTable } from "@/components/position-table"
import { OrderHistory } from "@/components/order-history"
import { v4 as uuidv4 } from "uuid"
import { ToastProvider } from "@/components/ui/toast"

export default function TradingPage() {
  const [currentPrice, setCurrentPrice] = useState(103636.1)
  const [timeframe, setTimeframe] = useState("1H")
  const [positions, setPositions] = useState([])
  const [orders, setOrders] = useState([])
  const [pnlHistory, setPnlHistory] = useState([])
  const [totalPnl, setTotalPnl] = useState(0)

  // Listen for price updates from the chart component
  const handlePriceUpdate = (price) => {
    setCurrentPrice(price)
  }

  // Calculate total PnL whenever pnlHistory changes
  useEffect(() => {
    const total = pnlHistory.reduce((sum, item) => sum + item.pnl, 0)
    setTotalPnl(total)
  }, [pnlHistory])

  // Handle placing a new order
  const handlePlaceOrder = (order) => {
    const newOrder = {
      id: uuidv4(),
      ...order,
      status: "filled", // In a real app, this would be pending initially
    }

    // Add to order history
    setOrders((prev) => [newOrder, ...prev])

    // For market orders, immediately create a position
    if (order.type === "market") {
      const newPosition = {
        id: uuidv4(),
        symbol: "BTC-USDT",
        side: order.side,
        amount: order.amount,
        entryPrice: order.price,
        leverage: order.leverage,
        liquidationPrice:
          order.side === "buy" ? order.price * (1 - 1 / order.leverage) : order.price * (1 + 1 / order.leverage),
        timestamp: new Date().toISOString(),
      }

      setPositions((prev) => [...prev, newPosition])
    }
  }

  // Handle closing a position
  const handleClosePosition = (positionId) => {
    const positionToClose = positions.find((p) => p.id === positionId)

    if (positionToClose) {
      // Calculate PnL
      const priceDiff =
        positionToClose.side === "buy"
          ? currentPrice - positionToClose.entryPrice
          : positionToClose.entryPrice - currentPrice

      const pnl = priceDiff * positionToClose.amount * positionToClose.leverage
      const pnlPercentage = (priceDiff / positionToClose.entryPrice) * 100 * positionToClose.leverage

      // Create a closing order
      const closingOrder = {
        id: uuidv4(),
        type: "market",
        side: positionToClose.side === "buy" ? "sell" : "buy",
        price: currentPrice,
        amount: positionToClose.amount,
        leverage: positionToClose.leverage,
        total: currentPrice * positionToClose.amount,
        timestamp: new Date().toISOString(),
        status: "filled",
        pnl: pnl,
        pnlPercentage: pnlPercentage,
      }

      // Add to order history
      setOrders((prev) => [closingOrder, ...prev])

      // Add to PnL history
      setPnlHistory((prev) => [
        ...prev,
        {
          id: uuidv4(),
          positionId: positionToClose.id,
          entryPrice: positionToClose.entryPrice,
          exitPrice: currentPrice,
          amount: positionToClose.amount,
          leverage: positionToClose.leverage,
          pnl: pnl,
          pnlPercentage: pnlPercentage,
          timestamp: new Date().toISOString(),
        },
      ])

      // Remove the position
      setPositions((prev) => prev.filter((p) => p.id !== positionId))
    }
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2">
            <img src="/images/crypto-logo.png" alt="CryptoTrade Logo" className="h-8 w-auto" />
            <h1 className="text-lg font-semibold">Futures Trading</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="hidden md:block">
              <div className="text-sm text-muted-foreground">Realized PnL</div>
              <div className={`font-bold ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
              </div>
            </div>
            <Select defaultValue="btc">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Market" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="btc">BTC/USDT</SelectItem>
                <SelectItem value="eth">ETH/USDT</SelectItem>
                <SelectItem value="sol">SOL/USDT</SelectItem>
                <SelectItem value="ada">ADA/USDT</SelectItem>
                <SelectItem value="dot">DOT/USDT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>BTC/USDT Perpetual</CardTitle>
                  <CardDescription>Futures Contract • 0.01% Maker / 0.05% Taker</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={timeframe === "1H" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe("1H")}
                  >
                    1H
                  </Button>
                  <Button
                    variant={timeframe === "4H" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe("4H")}
                  >
                    4H
                  </Button>
                  <Button
                    variant={timeframe === "1D" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe("1D")}
                  >
                    1D
                  </Button>
                  <Button
                    variant={timeframe === "1W" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeframe("1W")}
                  >
                    1W
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[400px]">
                <PriceChart timeframe={timeframe} onPriceUpdate={handlePriceUpdate} />
              </CardContent>
            </Card>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Futures Trading</CardTitle>
                </CardHeader>
                <CardContent>
                  <FuturesTradingForm currentPrice={currentPrice} onPlaceOrder={handlePlaceOrder} />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderBook currentPrice={currentPrice} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentTrades currentPrice={currentPrice} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Market Depth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-sm text-muted-foreground">Market depth chart coming soon</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Trading Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="positions">
                <TabsList>
                  <TabsTrigger value="positions">Positions</TabsTrigger>
                  <TabsTrigger value="orders">Order History</TabsTrigger>
                  <TabsTrigger value="pnl">PnL History</TabsTrigger>
                </TabsList>
                <TabsContent value="positions">
                  <PositionTable
                    positions={positions}
                    currentPrice={currentPrice}
                    onClosePosition={handleClosePosition}
                  />
                </TabsContent>
                <TabsContent value="orders">
                  <OrderHistory orders={orders} />
                </TabsContent>
                <TabsContent value="pnl">
                  {pnlHistory.length > 0 ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Realized PnL</div>
                        <div className={`text-2xl font-bold ${totalPnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
                        </div>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Entry Price</TableHead>
                            <TableHead>Exit Price</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Leverage</TableHead>
                            <TableHead>PnL</TableHead>
                            <TableHead>Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pnlHistory.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>BTC-USDT</TableCell>
                              <TableCell>${item.entryPrice.toLocaleString()}</TableCell>
                              <TableCell>${item.exitPrice.toLocaleString()}</TableCell>
                              <TableCell>{item.amount.toFixed(4)} BTC</TableCell>
                              <TableCell>{item.leverage}x</TableCell>
                              <TableCell className={item.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                                {item.pnl >= 0 ? "+" : ""}${item.pnl.toFixed(2)} ({item.pnlPercentage.toFixed(2)}%)
                              </TableCell>
                              <TableCell>
                                {new Date(item.timestamp).toLocaleString([], {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground">No PnL history yet</div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </ToastProvider>
  )
}

// Import Table components for PnL history
const Table = ({ children }) => <table className="w-full">{children}</table>
const TableHeader = ({ children }) => <thead>{children}</thead>
const TableBody = ({ children }) => <tbody>{children}</tbody>
const TableRow = ({ children }) => <tr>{children}</tr>
const TableHead = ({ children }) => <th className="text-left py-2 px-4 font-medium text-sm">{children}</th>
const TableCell = ({ children, className = "" }) => <td className={`py-2 px-4 text-sm ${className}`}>{children}</td>
