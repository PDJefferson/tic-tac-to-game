import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'
export default function WaitingProgress({
  isBackDropShown,
  setIsBackdropShown,
}) {
  return (
    <Backdrop
      sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isBackDropShown}
      onClick={() => setIsBackdropShown(false)}
    >
      <CircularProgress />
    </Backdrop>
  )
}
