import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import CssBaseline from '@mui/material/CssBaseline'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import NextNprogress from 'nextjs-progressbar'
import { SessionProvider } from 'next-auth/react'
import Header from '../components/Header'
import AppContext from '../store/AppContext'
import io from 'socket.io-client'
let socket
export default function MyApp(props) {
  const [hasSocketInitialize, setHasSocketInitialize] = React.useState(false)
  //starts the socket connection
  React.useEffect(() => {
    console.count()
    const initializeSocket = async () => {
      socketInitializer()
    }
    initializeSocket()
    return () => {}
  }, [])

  //initializes the socket connection
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()
    socket.on('connect', () => {
      console.log('connected with id ', socket.id)
      setHasSocketInitialize(true)
    })
  }
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props

  return (
    <AppContext.Provider value={{ socket }}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SessionProvider
          session={session}
          refetchInterval={10}
          // refetchInterval={5 * 60}
          refetchOnWindowFocus
        >
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <NextNprogress options={{ showSpinner: false }} />
          <Header />
          <Component {...pageProps} />
        </SessionProvider>
      </LocalizationProvider>
    </AppContext.Provider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}
