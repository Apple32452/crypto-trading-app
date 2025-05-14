"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

export function RecentTrades({ currentPrice = 103636.1 }) {
  const [trades, setTrades] = useState([])

  // Generate recent trades based on current price
  useEffect(() => {
    const generateRecentTrades = () => {
      const newTrades = []
      const basePrice = currentPrice
      const now = new Date()

      for (let i = 0; i < 15; i++) {
        const isBuy = Math.random() > 0.5
        const priceChange = Math.random() * basePrice * 0.0002 - basePrice * 0.0001
        const price = basePrice + priceChange
        const amount = Math.random() * 0.5

        const tradeTime = new Date(now)
        tradeTime.setSeconds(now.getSeconds() - i * 30)

        newTrades.push({
          price,
          amount,
          total: price * amount,
          time: tradeTime,
          type: isBuy ? "buy" : "sell",
        })
      }

      setTrades(newTrades)
    }

    generateRecentTrades()

    // Update trades every 10 seconds
    const intervalId = setInterval(() => {
      const isBuy = Math.random() > 0.5
      const priceChange = Math.random() * currentPrice * 0.0002 - currentPrice * 0.0001
      const price = currentPrice + priceChange
      const amount = Math.random() * 0.5

      setTrades((prev) => [
        {
          price,
          amount,
          total: price * amount,
          time: new Date(),
          type: isBuy ? "buy" : "sell",
        },
        ...prev.slice(0, -1),
      ])
    }, 10000)

    return () => clearInterval(intervalId)
  }, [currentPrice])

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
        {trades.map((trade, index) => (
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
