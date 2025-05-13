"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowUp, ArrowDown, AlertCircle } from "lucide-react"

export function FuturesTradingForm({ currentPrice, onPlaceOrder }) {
  const [orderType, setOrderType] = useState("market")
  const [side, setSide] = useState("buy")
  const [price, setPrice] = useState(currentPrice)
  const [amount, setAmount] = useState(0.01)
  const [leverage, setLeverage] = useState(10)
  const [total, setTotal] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(25000)
  const [reduceOnly, setReduceOnly] = useState(false)
  const [postOnly, setPostOnly] = useState(false)
  const [sliderValue, setSliderValue] = useState(25)

  // Update price when currentPrice changes
  useEffect(() => {
    if (orderType === "market") {
      setPrice(currentPrice)
    }
  }, [currentPrice, orderType])

  // Calculate total value
  useEffect(() => {
    const calculatedTotal = price * amount
    setTotal(calculatedTotal)
  }, [price, amount])

  // Handle slider change
  const handleSliderChange = (value) => {
    setSliderValue(value[0])
    const newAmount = Number.parseFloat(((availableBalance * value[0]) / 100 / price / leverage).toFixed(4))
    setAmount(newAmount)
  }

  // Handle amount change
  const handleAmountChange = (e) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setAmount(value)
      const newSliderValue = Math.min(100, ((value * price * leverage) / availableBalance) * 100)
      setSliderValue(newSliderValue)
    }
  }

  // Handle price change
  const handlePriceChange = (e) => {
    const value = Number.parseFloat(e.target.value)
    if (!isNaN(value)) {
      setPrice(value)
    }
  }

  // Handle order submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const order = {
      type: orderType,
      side,
      price: orderType === "market" ? currentPrice : price,
      amount,
      leverage,
      total: orderType === "market" ? currentPrice * amount : total,
      reduceOnly,
      postOnly: orderType === "limit" ? postOnly : false,
      timestamp: new Date().toISOString(),
    }

    onPlaceOrder(order)

    // Reset form or show confirmation
    if (orderType === "market") {
      setAmount(0.01)
      setSliderValue(25)
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={orderType} onValueChange={setOrderType} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="limit">Limit</TabsTrigger>
          <TabsTrigger value="stop">Stop</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            variant="outline"
            className={`w-full ${side === "buy" ? "bg-green-50 hover:bg-green-100 text-green-600 border-green-600" : "bg-transparent"}`}
            onClick={() => setSide("buy")}
          >
            <ArrowUp className="mr-1 h-4 w-4" />
            Buy/Long
          </Button>
          <Button
            variant="outline"
            className={`w-full ${side === "sell" ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-600" : "bg-transparent"}`}
            onClick={() => setSide("sell")}
          >
            <ArrowDown className="mr-1 h-4 w-4" />
            Sell/Short
          </Button>
        </div>

        <TabsContent value="market" className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Price (USDT)</div>
            <Input type="text" value={`${currentPrice.toLocaleString()} (Market)`} disabled />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Amount (BTC)</div>
            <Input type="number" value={amount} onChange={handleAmountChange} step="0.001" min="0.001" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Leverage</span>
              <span>{leverage}x</span>
            </div>
            <Select value={leverage.toString()} onValueChange={(value) => setLeverage(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10, 20, 50, 100].map((lev) => (
                  <SelectItem key={lev} value={lev.toString()}>
                    {lev}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Size</span>
              <span>Available: {availableBalance.toLocaleString()} USDT</span>
            </div>
            <Slider value={[sliderValue]} max={100} step={1} onValueChange={handleSliderChange} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch id="reduce-only" checked={reduceOnly} onCheckedChange={setReduceOnly} />
            <Label htmlFor="reduce-only">Reduce Only</Label>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm mb-2">
              <span>Order Value:</span>
              <span>${(total * leverage).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Margin:</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <Button
            className={`w-full ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            onClick={handleSubmit}
          >
            {side === "buy" ? "Buy/Long" : "Sell/Short"} BTC
          </Button>
        </TabsContent>

        <TabsContent value="limit" className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Price (USDT)</div>
            <Input type="number" value={price} onChange={handlePriceChange} />
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Amount (BTC)</div>
            <Input type="number" value={amount} onChange={handleAmountChange} step="0.001" min="0.001" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Leverage</span>
              <span>{leverage}x</span>
            </div>
            <Select value={leverage.toString()} onValueChange={(value) => setLeverage(Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select leverage" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10, 20, 50, 100].map((lev) => (
                  <SelectItem key={lev} value={lev.toString()}>
                    {lev}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total (USDT)</span>
              <span>Available: {availableBalance.toLocaleString()} USDT</span>
            </div>
            <Input type="text" value={total.toLocaleString()} disabled />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="reduce-only-limit" checked={reduceOnly} onCheckedChange={setReduceOnly} />
            <Label htmlFor="reduce-only-limit">Reduce Only</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="post-only" checked={postOnly} onCheckedChange={setPostOnly} />
            <Label htmlFor="post-only">Post Only</Label>
          </div>

          <Button
            className={`w-full ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
            onClick={handleSubmit}
          >
            {side === "buy" ? "Buy/Long" : "Sell/Short"} BTC
          </Button>
        </TabsContent>

        <TabsContent value="stop" className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-muted rounded-md">
            <AlertCircle className="h-5 w-5 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Stop orders coming soon</span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
