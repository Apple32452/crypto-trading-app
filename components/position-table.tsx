"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function PositionTable({ positions = [], currentPrice, onClosePosition }) {
  const [positionsWithPnL, setPositionsWithPnL] = useState([])
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const handleClosePosition = (position) => {
    setSelectedPosition(position)
    setIsDialogOpen(true)
  }

  const confirmClosePosition = () => {
    if (selectedPosition) {
      onClosePosition(selectedPosition.id)
      setIsDialogOpen(false)
      setSelectedPosition(null)
    }
  }

  if (positionsWithPnL.length === 0) {
    return <div className="text-center py-8 text-sm text-muted-foreground">You have no open positions</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Entry Price</TableHead>
            <TableHead>Mark Price</TableHead>
            <TableHead>PnL (Unrealized)</TableHead>
            <TableHead className="text-right">Close</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positionsWithPnL.map((position) => (
            <TableRow key={position.id}>
              <TableCell>
                <div className="flex items-center">
                  <Badge
                    className={position.side === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClosePosition(position)}
                  className={
                    position.pnl >= 0
                      ? "text-green-600 border-green-600 hover:bg-green-50"
                      : "text-red-600 border-red-600 hover:bg-red-50"
                  }
                >
                  Close Position
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Position</DialogTitle>
            <DialogDescription>Are you sure you want to close this position?</DialogDescription>
          </DialogHeader>

          {selectedPosition && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-sm">Position:</div>
                <div className="text-sm font-medium">
                  {selectedPosition.side === "buy" ? "Long" : "Short"} BTC-USDT {selectedPosition.leverage}x
                </div>

                <div className="text-sm">Size:</div>
                <div className="text-sm font-medium">{selectedPosition.amount.toFixed(4)} BTC</div>

                <div className="text-sm">Entry Price:</div>
                <div className="text-sm font-medium">${selectedPosition.entryPrice.toLocaleString()}</div>

                <div className="text-sm">Exit Price:</div>
                <div className="text-sm font-medium">${currentPrice.toLocaleString()}</div>

                <div className="text-sm">Realized PnL:</div>
                <div className={`text-sm font-medium ${selectedPosition.pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${selectedPosition.pnl.toFixed(2)} ({selectedPosition.pnlPercentage.toFixed(2)}%)
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmClosePosition}
              className={selectedPosition?.pnl >= 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              Confirm Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
