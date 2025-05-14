"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Bitcoin, ChevronDown, ChevronUp, EclipseIcon as Ethereum, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Updated to reflect current Bitcoin price
export function AssetTable({ currentPrice = 103636.1 }) {
  // Mock data for the asset table with updated Bitcoin price
  const [assets, setAssets] = useState([
    {
      id: 1,
      name: "Bitcoin",
      symbol: "BTC",
      icon: Bitcoin,
      amount: 0.75,
      price: currentPrice,
      change: 4.3,
    },
    {
      id: 2,
      name: "Ethereum",
      symbol: "ETH",
      icon: Ethereum,
      amount: 5.2,
      price: 2476.11,
      change: -2.5,
    },
    {
      id: 3,
      name: "USD Coin",
      symbol: "USDC",
      icon: DollarSign,
      amount: 3000,
      price: 1.0,
      change: 0.01,
    },
  ])

  const [sortColumn, setSortColumn] = useState("value")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [sellAmount, setSellAmount] = useState(0)

  // Update Bitcoin price when currentPrice prop changes
  useEffect(() => {
    setAssets((prev) => prev.map((asset) => (asset.symbol === "BTC" ? { ...asset, price: currentPrice } : asset)))
  }, [currentPrice])

  // Calculate values based on current prices
  const assetsWithValues = assets.map((asset) => ({
    ...asset,
    value: asset.amount * asset.price,
  }))

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedAssets = [...assetsWithValues].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // Calculate total portfolio value
  const totalValue = sortedAssets.reduce((sum, asset) => sum + asset.value, 0)

  const handleSellAsset = (asset) => {
    setSelectedAsset(asset)
    setSellAmount(asset.amount / 2) // Default to selling half
    setIsDialogOpen(true)
  }

  const confirmSellAsset = () => {
    if (selectedAsset && sellAmount > 0 && sellAmount <= selectedAsset.amount) {
      // Calculate profit/loss
      const initialInvestment = selectedAsset.amount * (selectedAsset.price / (1 + selectedAsset.change / 100))
      const currentValue = sellAmount * selectedAsset.price
      const profitLoss = currentValue - initialInvestment * (sellAmount / selectedAsset.amount)

      // Update asset amount
      setAssets((prev) =>
        prev.map((asset) => (asset.id === selectedAsset.id ? { ...asset, amount: asset.amount - sellAmount } : asset)),
      )

      // Close dialog
      setIsDialogOpen(false)
      setSelectedAsset(null)

      // In a real app, you would show a toast notification here
      console.log(`Sold ${sellAmount} ${selectedAsset.symbol} for $${(sellAmount * selectedAsset.price).toFixed(2)}`)
      console.log(`Profit/Loss: $${profitLoss.toFixed(2)}`)
    }
  }

  return (
    <div>
      <div className="mb-4 p-4 bg-muted/30 rounded-lg">
        <div className="text-sm text-muted-foreground">Total Portfolio Value</div>
        <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Asset</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
              Amount
              {sortColumn === "amount" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("value")}>
              Value
              {sortColumn === "value" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("price")}>
              Price
              {sortColumn === "price" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("change")}>
              24h
              {sortColumn === "change" &&
                (sortDirection === "asc" ? (
                  <ChevronUp className="inline ml-1 h-4 w-4" />
                ) : (
                  <ChevronDown className="inline ml-1 h-4 w-4" />
                ))}
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <asset.icon className="h-5 w-5" />
                  <span>{asset.symbol}</span>
                </div>
              </TableCell>
              <TableCell>{asset.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
              <TableCell className="text-right">${asset.price.toLocaleString()}</TableCell>
              <TableCell className={`text-right ${asset.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                <div className="flex items-center justify-end">
                  {asset.change >= 0 ? (
                    <ChevronUp className="mr-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(asset.change)}%
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => handleSellAsset(asset)}>
                  Sell
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sell {selectedAsset?.symbol}</DialogTitle>
            <DialogDescription>Enter the amount you want to sell</DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">Available:</div>
                  <div className="text-sm font-medium">
                    {selectedAsset.amount} {selectedAsset.symbol}
                  </div>

                  <div className="text-sm">Current Price:</div>
                  <div className="text-sm font-medium">${selectedAsset.price.toLocaleString()}</div>

                  <div className="text-sm">Total Value:</div>
                  <div className="text-sm font-medium">${selectedAsset.value.toLocaleString()}</div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sell-amount" className="text-sm font-medium">
                    Amount to Sell:
                  </label>
                  <input
                    id="sell-amount"
                    type="number"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(Number(e.target.value))}
                    min="0.0001"
                    max={selectedAsset.amount}
                    step="0.0001"
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm">You will receive:</div>
                  <div className="text-lg font-bold">${(sellAmount * selectedAsset.price).toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSellAsset} className="bg-green-600 hover:bg-green-700">
              Confirm Sell
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
