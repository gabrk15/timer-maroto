"use client"

import { useEffect, useState } from 'react'

export default function Home() {
  const [timer, setTimer] = useState({
    min: "00",
    sec: "00"
  })
  const [isRunning, setIsRunning] = useState(false)
  const [limit, setLimit] = useState({
    min: "00",
    sec: "30"
  })

  useEffect(() => {
    if (!isRunning) return

    const getProgress = (currentTiming: any) => {
      const currentMin = Number(currentTiming.min)
      const currentSec = Number(currentTiming.sec)
      if (currentSec === 59 && currentMin === 59) {
        return {
          min: 0,
          sec: 0
        }
      }
      if (currentSec === 59 && currentMin < 59) {
        return {
          min: currentMin + 1,
          sec: 0
        }
      }
      if (currentSec < 60 && currentMin < 60) {
        return {
          min: currentMin,
          sec: currentSec + 1
        }
      }

      return {
        min: 0,
        sec: 0
      }
    }

    const validateLimit = (currentTiming: any, currentLimit: any) => {
      if (
        (Number(currentTiming.min) === Number(currentLimit.min)) &&
        (Number(currentTiming.sec) === Number(currentLimit.sec))
      ) {
        return true
      }
      if (
        (Number(currentTiming.min) >= Number(currentLimit.min)) &&
        (Number(currentTiming.sec) > Number(currentLimit.sec))
      ) {
        return false
      }
      return true
    }

    const parseTimingValue = (currentTiming: any) => {
      let parsedTiming = {
        min: `${currentTiming.min}`,
        sec: `${currentTiming.sec}`,
      }
      
      if (currentTiming.sec < 10) {
        parsedTiming.sec = `0${currentTiming.sec}`
      }
      if (currentTiming.min < 10) {
        parsedTiming.min = `0${currentTiming.min}`
      }

      return parsedTiming
    }

    const interval = setInterval(() => {
      setTimer((prevState) => {
        const newProgress = getProgress(prevState)
        const parsedProgress = parseTimingValue(newProgress)
        validateLimit(parsedProgress, limit)

        if (!validateLimit(parsedProgress, limit)) {
          setIsRunning(false)
          return prevState
        }

        return parsedProgress
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, limit])

  return (
    <main className="flex min-h-screen flex-col justify-center items-center gap-4 p-2">
      <div className="font-bold text-xl">
        {timer.min}:{timer.sec}
      </div>
      <button onClick={() => setIsRunning(true)}>Play</button>
      <button onClick={() => setIsRunning(false)}>Stop</button>
      <button 
        onClick={() => {
          setTimer({ min: "00", sec: "00" })
          setIsRunning(true)
        }}
      >Restart</button>
    </main>
  )
}
