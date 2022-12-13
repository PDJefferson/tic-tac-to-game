import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import TextField from '@mui/material/TextField'
import * as React from 'react'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { Grid } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Image from 'next/image'
import myImg from '../public/google_icon.svg'

export default function Register({ acceptLanguage }) {
  const [goodAlert, setGoodAlert] = React.useState('')
  const [badAlert, setBadAlert] = React.useState('')
  const [loading, setLoading] = React.useState('')
  const [disableButton, setDisableButton] = React.useState(false)
  const router = useRouter()

  const onKeyPress = async (event) => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      onClick(event)
    }
  }

  const onClickGoogle = async (e) => {
    e.preventDefault()
    const result = await signIn('google')
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item sx={{ mt: 2, mb: 2 }}></Grid>
      <Box
        sx={{
          width: 400,
          // backgroundColor: '#f6f8fa',
          border: 1,
          borderColor: '#afb8c1',
          mb: 3,
          // mt: 2,
          borderRadius: '6px',
        }}
      >
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item sx={{ mt: 2 }}>
            <Typography variant="h5">Create your account</Typography>
          </Grid>
          <Grid item sx={{}}>
            <Button
              onClick={onClickGoogle}
              variant="contained"
              disabled={disableButton}
              sx={{
                textTransform: 'none',
                mt: 4,
                mb: 4,
              }}
            >
              <Image priority src={myImg} width={100} height={35} alt="logo" />
              <Typography variant="h5" fontFamily="revert" sx={{ mr: 5 }}>
                Google
              </Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
        >
          {loading && (
            <Grid item sx={{ mt: 1 }}>
              <CircularProgress />
            </Grid>
          )}

          {badAlert && (
            <Grid sx={{ m: 1 }} item>
              <Alert severity="error">
                There was an error creating your account!
              </Alert>
            </Grid>
          )}
          {goodAlert && (
            <Grid sx={{ m: 1 }} item>
              <Alert severity="success">User successfully created!</Alert>
            </Grid>
          )}
        </Grid>
      </Box>
    </Grid>
  )
}

export async function getServerSideProps(context) {
  let acceptLanguage = context.req.headers['accept-language'].split(',')[0]
  // console.log(acceptLanguage)
  const session = await getSession({ req: context.req })

  // const { query } = context

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { acceptLanguage: JSON.stringify(acceptLanguage) },
  }
}
