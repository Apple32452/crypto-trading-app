"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export function OrderHistory({ orders = [] }) {
  if (orders.length === 0) {
    return <div className="text-center py-8 text-sm text-muted-foreground">No order history</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Side</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Badge variant="outline">{order.type}</Badge>
            </TableCell>
            <TableCell className={order.side === "buy" ? "text-green-600" : "text-red-600"}>
              {order.side === "buy" ? "Buy" : "Sell"}
            </TableCell>
            <TableCell>${order.price.toLocaleString()}</TableCell>
            <TableCell>{order.amount.toFixed(4)} BTC</TableCell>
            <TableCell>${order.total.toLocaleString()}</TableCell>
            <TableCell>{format(new Date(order.timestamp), "HH:mm:ss")}</TableCell>
            <TableCell>
              <Badge className="bg-green-100 text-green-800">Filled</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
