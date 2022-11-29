import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import CssBaseline from '@mui/material/CssBaseline'

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers'
import NextNprogress from 'nextjs-progressbar'
import { SessionProvider } from 'next-auth/react'
import Header from '../components/Header'

export default function MyApp(props) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props
  return (
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
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}
