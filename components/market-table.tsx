"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Star } from "lucide-react"

// Mock data for the markets table
const markets = [
  {
    id: 1,
    name: "Bitcoin",
    symbol: "BTC/USDT",
    price: 67890.45,
    change: 4.3,
    volume: 12500000000,
    marketCap: 1320000000000,
    favorite: false,
  },
  {
    id: 2,
    name: "Ethereum",
    symbol: "ETH/USDT",
    price: 2476.11,
    change: -2.5,
    volume: 8500000000,
    marketCap: 290000000000,
    favorite: false,
  },
  {
    id: 3,
    name: "Solana",
    symbol: "SOL/USDT",
    price: 105.75,
    change: 8.2,
    volume: 3200000000,
    marketCap: 45000000000,
    favorite: false,
  },
  {
    id: 4,
    name: "Cardano",
    symbol: "ADA/USDT",
    price: 0.45,
    change: -1.3,
    volume: 950000000,
    marketCap: 15000000000,
    favorite: false,
  },
  {
    id: 5,
    name: "Polkadot",
    symbol: "DOT/USDT",
    price: 6.23,
    change: 3.7,
    volume: 750000000,
    marketCap: 7500000000,
    favorite: false,
  },
  {
    id: 6,
    name: "Ripple",
    symbol: "XRP/USDT",
    price: 0.52,
    change: 1.2,
    volume: 1800000000,
    marketCap: 27000000000,
    favorite: false,
  },
  {
    id: 7,
    name: "Dogecoin",
    symbol: "DOGE/USDT",
    price: 0.085,
    change: -0.8,
    volume: 950000000,
    marketCap: 11000000000,
    favorite: false,
  },
]

export function MarketTable() {
  const [sortColumn, setSortColumn] = useState("marketCap")
  const [sortDirection, setSortDirection] = useState("desc")
  const [favorites, setFavorites] = useState({})

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const sortedMarkets = [...markets].sort((a, b) => {
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
          <TableHead className="w-[50px]"></TableHead>
          <TableHead className="w-[150px]">Name</TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
            Price
            {sortColumn === "price" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="cursor-pointer" onClick={() => handleSort("change")}>
            24h Change
            {sortColumn === "change" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort("volume")}>
            24h Volume
            {sortColumn === "volume" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="text-right cursor-pointer hidden md:table-cell" onClick={() => handleSort("marketCap")}>
            Market Cap
            {sortColumn === "marketCap" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="inline ml-1 h-4 w-4" />
              ) : (
                <ChevronDown className="inline ml-1 h-4 w-4" />
              ))}
          </TableHead>
          <TableHead className="text-right">Trade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedMarkets.map((market) => (
          <TableRow key={market.id}>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(market.id)}>
                <Star
                  className={`h-4 w-4 ${favorites[market.id] ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
              </Button>
            </TableCell>
            <TableCell className="font-medium">
              <div>
                <div>{market.name}</div>
                <div className="text-xs text-muted-foreground">{market.symbol}</div>
              </div>
            </TableCell>
            <TableCell>${market.price.toLocaleString()}</TableCell>
            <TableCell className={market.change >= 0 ? "text-green-500" : "text-red-500"}>
              <div className="flex items-center">
                {market.change >= 0 ? <ChevronUp className="mr-1 h-4 w-4" /> : <ChevronDown className="mr-1 h-4 w-4" />}
                {Math.abs(market.change)}%
              </div>
            </TableCell>
            <TableCell className="text-right hidden md:table-cell">
              ${(market.volume / 1000000000).toFixed(1)}B
            </TableCell>
            <TableCell className="text-right hidden md:table-cell">
              ${(market.marketCap / 1000000000).toFixed(1)}B
            </TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="outline" className="h-8">
                Trade
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
