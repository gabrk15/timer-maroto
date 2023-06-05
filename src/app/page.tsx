"use client"

import { useEffect, useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { BsPauseFill } from 'react-icons/bs'
import { VscDebugRestart } from 'react-icons/vsc'

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
    <main className="flex min-h-screen flex-col justify-center items-center gap-4 p-2 bg-zinc-900">
      <div className="font-bold text-3xl text-white">
        {timer.min}:{timer.sec}
      </div>

      <div className="flex justify-center items-center gap-4">
        <div onClick={() => setIsRunning(prevState => !prevState)}>
          {
            isRunning ? 
              <BsPauseFill size={50} className="text-red-600 cursor-pointer" /> 
              : 
              <BsFillPlayFill size={50} className="text-green-600 cursor-pointer" /> 
          }
        </div>
        <div 
          onClick={() => {
            setTimer({ min: "00", sec: "00" })
            setIsRunning(true)
          }}
          className="mr-1"
        >
          <VscDebugRestart size={40} className="text-blue-700 cursor-pointer" />
        </div>
      </div>

      {/* <div className="flex gap-2">
        <input 
          type="number" 
          className="w-16 border-2 border-white outline-0 rounded-md bg-zinc-900 text-xl text-white text-center font-bold py-3 px-4"
          min={0}
          max={59}
          maxLength={2}
          value={Number(limit.min) < 10 ? `${Number(limit.min)}` : limit.min}
          onChange={(event) => {
            setLimit((prevState) => {
              return {
                ...prevState,
                min: event.currentTarget?.value ? String(event.currentTarget?.value) : "00"
              }
            })
          }}
        />
        <input 
          type="number" 
          className="w-16 border-2 border-white outline-0 rounded-md bg-zinc-900 text-xl text-white text-center font-bold py-3 px-4"
          min={0}
          max={59}
          maxLength={2}
          value={Number(limit.sec) < 10 ? `${Number(limit.sec)}` : limit.sec}
          onChange={(event) => {
            setLimit((prevState) => {
              return {
                ...prevState,
                sec: event.currentTarget?.value ? String(event.currentTarget?.value) : "00"
              }
            })
          }}  
        />
      </div> */}
    </main>
  )
}
