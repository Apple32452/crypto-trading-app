"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for recent trades
const generateRecentTrades = () => {
  const trades = []
  const basePrice = 67890.45
  const now = new Date()

  for (let i = 0; i < 15; i++) {
    const isBuy = Math.random() > 0.5
    const priceChange = Math.random() * 20 - 10
    const price = basePrice + priceChange
    const amount = Math.random() * 0.5

    const tradeTime = new Date(now)
    tradeTime.setSeconds(now.getSeconds() - i * 30)

    trades.push({
      price,
      amount,
      total: price * amount,
      time: tradeTime,
      type: isBuy ? "buy" : "sell",
    })
  }

  return trades
}

const recentTrades = generateRecentTrades()

export function RecentTrades() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Price (USDT)</TableHead>
          <TableHead className="text-right">Amount (BTC)</TableHead>
          <TableHead className="text-right">Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentTrades.map((trade, index) => (
          <TableRow key={index}>
            <TableCell className={trade.type === "buy" ? "text-green-500" : "text-red-500"}>
              {trade.price.toFixed(2)}
            </TableCell>
            <TableCell className="text-right">{trade.amount.toFixed(4)}</TableCell>
            <TableCell className="text-right text-xs text-muted-foreground">
              {trade.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
