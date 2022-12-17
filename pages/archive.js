import Data from '../models/Data'
import React from 'react'
import { getSession } from 'next-auth/react'
import { Typography, Grid, Box, IconButton } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import ContrastIcon from '@mui/icons-material/Contrast'
import ComputerIcon from '@mui/icons-material/Computer'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import PermMediaIcon from '@mui/icons-material/PermMedia'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useRouter } from 'next/router'

export default function Archive({ data }) {
  const router = useRouter()
  const [history, setHistory] = React.useState([])
  React.useEffect(() => {
    const data2 = JSON.parse(data)
    setHistory(data2)
  }, [data])
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ backgroundColor: 'black' }}
    >
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{ ml: 10, mt: 2 }}
      >
        <IconButton
          onClick={() => {
            router.push({
              pathname: '/game',
            })
          }}
        >
          <KeyboardReturnIcon sx={{ color: 'white', fontSize: 40 }} />
        </IconButton>
      </Grid>
      <Box>
        <Typography
          color="white"
          sx={{ mb: 3, mt: -6, textAlign: 'center' }}
          variant="h4"
        >
          Game Archive
        </Typography>
        <Table
          sx={{ minWidth: 250, width: 400 }}
          size="small"
          aria-label="a dense table"
        >
          <TableBody>
            {history.map((row, i) => (
              <TableRow
                key={i}
                onClick={() => {
                  router.push({
                    pathname: '/displayhistory',
                    query: { pid: row._id },
                  })
                }}
                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell sx={{ color: 'white' }} align="left">
                  {row.modality === 'online' && (
                    <PermIdentityIcon sx={{ color: 'green' }} />
                  )}
                  {row.modality === 'pvc' && (
                    <ComputerIcon sx={{ color: 'green' }} />
                  )}
                </TableCell>
                <TableCell sx={{ color: 'white' }} align="left">
                  {row.modality === 'online' && row.opponent.name}
                  {row.modality === 'pvc' && row.difficulty}
                </TableCell>
                <TableCell sx={{ color: 'white' }} align="right">
                  {row.userWin === 'true' && (
                    <AddIcon sx={{ color: 'green' }} />
                  )}
                  {row.userWin === 'false' && (
                    <RemoveIcon sx={{ color: 'red' }} />
                  )}
                  {row.userWin === 'tie' && <ContrastIcon sx={{}} />}
                </TableCell>

                <TableCell sx={{ color: 'white' }}>
                  <FindInPageIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Grid>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/game',
        permanent: false,
      },
    }
  }

  const getData = await Data.find({ user: session.user23._id })
    .sort({ dateUnix: -1 })
    .populate({
      path: 'opponent',
      select: 'name',
    })

  return { props: { data: JSON.stringify(getData) } }
}
