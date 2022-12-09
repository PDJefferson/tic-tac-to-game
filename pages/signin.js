import { Button, Typography } from '@mui/material'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Grid } from '@mui/material'
import Box from '@mui/material/Box'
import Image from 'next/image'
import myImg from '../public/google_icon.svg'

export default function BasicTextFields() {
  const theme = useTheme()

  const [alert, setAlert] = React.useState(false)
  const [loading, setLoading] = React.useState('')

  const [disableButton, setDisableButton] = React.useState(false)

  const router = useRouter()

  const onKeyPress = async (event) => {
    if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      onClick(event)
    }
  }

  const onClickGoogle = async (event) => {
    event.preventDefault()

    setLoading(true)
    setDisableButton(true)

    const result = await signIn('google', {})
  }

  return (
    <Grid container direction="column" alignItems="center" justify="center">
      <Grid item sx={{ mt: 2, mb: 2 }}></Grid>
      <Box
        sx={{
          width: 700,
          // backgroundColor: '#f6f8fa',
          border: 1,
          borderColor: '#afb8c1',
          mb: 3,
          borderRadius: '6px',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justify="center"
          // sx={{ width: 400, border: 1, m: 2, mt: 4, borderRadius: '6px' }}
        >
          <Grid item sx={{ mt: 2 }}>
            <Typography variant="h5">Log in to your account</Typography>
          </Grid>
          <Grid item>
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
      </Box>
    </Grid>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}
