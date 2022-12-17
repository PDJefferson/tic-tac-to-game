import React from 'react'

export default function useTimeComponent({ duration, onFinish, roomCode }) {
  const [showComponent, setShowComponent] = React.useState(true)
  const [timeRemaining, setTimeRemaining] = React.useState(duration)
  //updates time remaining every second it goes
  React.useEffect(() => {
    if (timeRemaining === 0) {
      setShowComponent(false)
      onFinish(roomCode)
    }
    const timer = setTimeout(() => {
      setTimeRemaining((prevTime) => prevTime - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeRemaining])

  return [showComponent, timeRemaining]
}
