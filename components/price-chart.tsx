"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

// Initial price based on our previous mock data
const INITIAL_PRICE = 67890.45

export function PriceChart({ timeframe = "1H" }) {
  const [data, setData] = useState([])
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE)
  const [priceChange, setPriceChange] = useState(0)
  const wsRef = useRef(null)
  const dataPointsRef = useRef(60) // Number of data points to show based on timeframe
  const initializedRef = useRef(false)

  // Set number of data points based on timeframe
  useEffect(() => {
    switch (timeframe) {
      case "1H":
        dataPointsRef.current = 60
        break
      case "4H":
        dataPointsRef.current = 240
        break
      case "1D":
        dataPointsRef.current = 288 // Every 5 minutes
        break
      case "1W":
        dataPointsRef.current = 168 // Hourly for a week
        break
      default:
        dataPointsRef.current = 60
    }

    // Reset data when timeframe changes
    if (initializedRef.current) {
      generateInitialData()
    }
  }, [timeframe])

  // Generate initial historical data
  const generateInitialData = useCallback(() => {
    const newData = []
    const now = new Date()
    let basePrice = INITIAL_PRICE

    // Generate data points going backward from now
    for (let i = dataPointsRef.current; i >= 0; i--) {
      const time = new Date(now)

      // Adjust time based on timeframe
      switch (timeframe) {
        case "1H":
          time.setSeconds(time.getSeconds() - i * 60) // Every minute
          break
        case "4H":
          time.setMinutes(time.getMinutes() - i * 4) // Every 4 minutes
          break
        case "1D":
          time.setMinutes(time.getMinutes() - i * 5) // Every 5 minutes
          break
        case "1W":
          time.setHours(time.getHours() - i) // Every hour
          break
        default:
          time.setSeconds(time.getSeconds() - i * 60)
      }

      // Create realistic price movements
      const volatility = 0.0005 // Lower for more realistic movements
      const randomFactor = (Math.random() * 2 - 1) * volatility
      basePrice = basePrice * (1 + randomFactor)

      newData.push({
        time: time.toISOString(),
        price: Number.parseFloat(basePrice.toFixed(2)),
        volume: Math.floor(Math.random() * 10 + 5), // Random volume
      })
    }

    setData(newData)
    setCurrentPrice(Number.parseFloat(basePrice.toFixed(2)))
  }, [timeframe])

  // Simulate WebSocket connection for real-time price updates
  useEffect(() => {
    // Only initialize once
    if (!initializedRef.current) {
      // Generate initial data
      generateInitialData()
      initializedRef.current = true
    }

    // Set up simulated WebSocket
    const intervalId = setInterval(() => {
      // Simulate price movement
      const volatility = 0.0008 // Adjust for more/less movement
      const direction = Math.random() > 0.5 ? 1 : -1
      const change = direction * Math.random() * volatility * currentPrice
      const newPrice = Number.parseFloat((currentPrice + change).toFixed(2))

      // Calculate percentage change
      const percentChange = Number.parseFloat((((newPrice - currentPrice) / currentPrice) * 100).toFixed(2))

      // Update state
      setCurrentPrice(newPrice)
      setPriceChange(percentChange)

      // Update chart data
      setData((prevData) => {
        const now = new Date().toISOString()
        const newData = [
          ...prevData.slice(1),
          {
            time: now,
            price: newPrice,
            volume: Math.floor(Math.random() * 10 + 5),
          },
        ]
        return newData
      })
    }, 1000) // Update every second for simulation

    wsRef.current = intervalId

    // Clean up interval on unmount
    return () => {
      if (wsRef.current) {
        clearInterval(wsRef.current)
      }
    }
  }, [generateInitialData])

  // Format time label based on timeframe
  const formatTimeLabel = (time) => {
    const date = new Date(time)
    switch (timeframe) {
      case "1H":
      case "4H":
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
      case "1D":
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
      case "1W":
        return `${date.getMonth() + 1}/${date.getDate()}`
      default:
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`
    }
  }

  return (
    <div className="h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-2xl font-bold">${currentPrice.toLocaleString()}</span>
          <span className={`ml-2 ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
            {priceChange >= 0 ? "+" : ""}
            {priceChange}%
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Volume: {Math.floor(Math.random() * 1000 + 500).toLocaleString()} BTC
        </div>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={formatTimeLabel} minTickGap={30} />
          <YAxis
            domain={["dataMin - 100", "dataMax + 100"]}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={80}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
            labelFormatter={(label) => `Time: ${new Date(label).toLocaleTimeString()}`}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorPrice)"
            isAnimationActive={false} // Disable animation for smoother updates
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
