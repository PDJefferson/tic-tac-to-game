import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'
export default function WaitingProgress() {
  return (
    <Backdrop
      sx={{ color: 'black', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress />
    </Backdrop>
  )
}
