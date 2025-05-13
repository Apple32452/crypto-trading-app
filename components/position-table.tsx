"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown, X } from "lucide-react"

export function PositionTable({ positions = [], currentPrice, onClosePosition }) {
  const [positionsWithPnL, setPositionsWithPnL] = useState([])

  // Calculate PnL for each position based on current price
  useEffect(() => {
    if (positions.length > 0 && currentPrice) {
      const updatedPositions = positions.map((position) => {
        const priceDiff =
          position.side === "buy" ? currentPrice - position.entryPrice : position.entryPrice - currentPrice

        const pnl = priceDiff * position.amount * position.leverage
        const pnlPercentage = (priceDiff / position.entryPrice) * 100 * position.leverage

        return {
          ...position,
          currentPrice,
          pnl,
          pnlPercentage,
        }
      })

      setPositionsWithPnL(updatedPositions)
    } else {
      setPositionsWithPnL([])
    }
  }, [positions, currentPrice])

  if (positionsWithPnL.length === 0) {
    return <div className="text-center py-8 text-sm text-muted-foreground">You have no open positions</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Position</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Entry Price</TableHead>
          <TableHead>Mark Price</TableHead>
          <TableHead>PnL</TableHead>
          <TableHead className="text-right">Close</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positionsWithPnL.map((position) => (
          <TableRow key={position.id}>
            <TableCell>
              <div className="flex items-center">
                <Badge className={position.side === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {position.side === "buy" ? (
                    <ArrowUp className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDown className="mr-1 h-3 w-3" />
                  )}
                  {position.leverage}x
                </Badge>
                <span className="ml-2">BTC-USDT</span>
              </div>
            </TableCell>
            <TableCell>{position.amount.toFixed(4)} BTC</TableCell>
            <TableCell>${position.entryPrice.toLocaleString()}</TableCell>
            <TableCell>${currentPrice.toLocaleString()}</TableCell>
            <TableCell className={position.pnl >= 0 ? "text-green-600" : "text-red-600"}>
              ${position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onClosePosition(position.id)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
