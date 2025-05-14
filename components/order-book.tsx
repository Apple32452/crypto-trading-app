"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

export function OrderBook({ currentPrice = 103636.1 }) {
  const [asks, setAsks] = useState([])
  const [bids, setBids] = useState([])

  // Generate order book based on current price
  useEffect(() => {
    const generateOrderBook = () => {
      const newAsks = []
      const newBids = []

      const basePrice = currentPrice

      // Generate asks (sell orders)
      for (let i = 1; i <= 8; i++) {
        const price = basePrice + i * basePrice * 0.0001
        const amount = Math.random() * 2
        const total = price * amount

        newAsks.push({
          price,
          amount,
          total,
        })
      }

      // Generate bids (buy orders)
      for (let i = 1; i <= 8; i++) {
        const price = basePrice - i * basePrice * 0.0001
        const amount = Math.random() * 2
        const total = price * amount

        newBids.push({
          price,
          amount,
          total,
        })
      }

      // Sort asks in ascending order (lowest first)
      newAsks.sort((a, b) => a.price - b.price)

      // Sort bids in descending order (highest first)
      newBids.sort((a, b) => b.price - a.price)

      setAsks(newAsks)
      setBids(newBids)
    }

    generateOrderBook()
  }, [currentPrice])

  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 text-sm font-medium text-red-500">Asks (Sell)</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Price (USDT)</TableHead>
              <TableHead className="w-1/3 text-right">Amount (BTC)</TableHead>
              <TableHead className="w-1/3 text-right">Total (USDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asks.map((ask, index) => (
              <TableRow key={index}>
                <TableCell className="text-red-500">{ask.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{ask.amount.toFixed(4)}</TableCell>
                <TableCell className="text-right">{ask.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="py-2 px-4 bg-muted rounded-md flex justify-between items-center">
        <span className="text-lg font-bold">{currentPrice.toLocaleString()}</span>
        <span className="text-xs text-muted-foreground">${currentPrice.toLocaleString()}</span>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-green-500">Bids (Buy)</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Price (USDT)</TableHead>
              <TableHead className="w-1/3 text-right">Amount (BTC)</TableHead>
              <TableHead className="w-1/3 text-right">Total (USDT)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((bid, index) => (
              <TableRow key={index}>
                <TableCell className="text-green-500">{bid.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{bid.amount.toFixed(4)}</TableCell>
                <TableCell className="text-right">{bid.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
