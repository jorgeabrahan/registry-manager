import { useEffect, useState } from 'react'

export const useCurrentDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000 * 60 * 60) // Update date every hour

    return () => {
      clearInterval(timer)
    }
  }, [])

  return {
    currentDate,
    currentDay: currentDate.getDate(),
    currentMonth: currentDate.getMonth(),
    currentYear: currentDate.getFullYear()
  }
}
