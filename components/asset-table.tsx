"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bitcoin, ChevronDown, ChevronUp, EclipseIcon as Ethereum, DollarSign } from "lucide-react"

// Mock data for the asset table
const assets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC",
    icon: Bitcoin,
    amount: 0.75,
    value: 50917.84,
    price: 67890.45,
    change: 4.3,
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH",
    icon: Ethereum,
    amount: 5.2,
    value: 12875.75,
    price: 2476.11,
    change: -2.5,
  },
  {
    id: 3,
    name: "USD Coin",
    symbol: "USDC",
    icon: DollarSign,
    amount: 3000,
    value: 3000,
    price: 1.0,
    change: 0.01,
  },
]

export function AssetTable() {
  const [sortColumn, setSortColumn] = useState("value")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedAssets = [...assets].sort((a, b) => {
    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
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
                {asset.change >= 0 ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                {Math.abs(asset.change)}%
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
