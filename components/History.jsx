import React from 'react'
import { Typography, Grid, Box } from '@mui/material'
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
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import AppContext from '../store/AppContext'
import { getData5 } from '../routes/api/users'

export default function History({ data, again, setAgain }) {
  const { data: session } = useSession(AppContext)
  const router = useRouter()
  const [history, setHistory] = React.useState([])
  React.useEffect(() => {
    const data2 = JSON.parse(data)
    setHistory(data2)
  }, [data])
  React.useEffect(() => {
    if (again) {
      runFunc()
      setAgain(false)
    }
  }, [again])

  const runFunc = async () => {
    if (session) {
      let hold = await getData5()
      setHistory(hold.data)
    }
  }

  return (
    <Box>
      <Typography color="white" sx={{ mb: 2 }}>
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
                {row.userWin === 'true' && <AddIcon sx={{ color: 'green' }} />}
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
      <Grid
        container
        direction="row"
        sx={{ backgroundColor: '#36454F', mb: 5 }}
      >
        <PermMediaIcon sx={{ color: 'grey', mt: 1, mb: 1, ml: 15 }} />
        <Typography sx={{ color: 'white', textAlign: 'center', mt: 1, ml: 2 }}>
          Game Archive
        </Typography>
      </Grid>
    </Box>
  )
}
