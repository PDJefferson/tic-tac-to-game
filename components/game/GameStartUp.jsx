import { GAME_SETTINGS } from '../../constants/game'
import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CardActionArea,
} from '@mui/material'
import { useWindowSize } from '../../hooks/use-WindowsSize'
import { RESPONSIVE_LAYOUT } from '../../constants/responsive'
export default function GameStartUp({ modality, setModality }) {
  const [curWidth, curHeight] = useWindowSize()
  let responsiveNess = React.useMemo(() => {
    return curWidth <= RESPONSIVE_LAYOUT.SM_SCREEN_WIDTH
      ? { width: '200px', height: '200px' }
      : curWidth >= RESPONSIVE_LAYOUT.LG_SCREEN_WIDTH
      ? { width: '18vw', height: '240px' }
      : { width: '16vw', height: '200px' }
  }, [curWidth])
  return (
    <Grid container spacing={2} justifyContent="center" direction="row">
      <Grid
        container
        item
        alignItems="center"
        xs={12}
        md={4}
        lg={4}
        sm={12}
        direction="column"
      >
        <Card variant="elevation">
          <CardActionArea
            sx={{
              minWidth: responsiveNess.width,
              minHeight: responsiveNess.height,
              backgroundColor: 'gray',
            }}
            onClick={(e) =>
              setTimeout(() => {
                setModality(GAME_SETTINGS.PLAYER_VS_PLAYER)
              }, 500)
            }
          >
            <CardContent>
              <Typography
                textAlign="center"
                sx={{ fontSize: 18 }}
                color="text.primary"
                gutterBottom
                variant="body2"
              >
                Player vs. Player
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        xs={12}
        md={4}
        sm={12}
        direction="column"
      >
        <Card variant="elevation">
          <CardActionArea
            sx={{
              minWidth: responsiveNess.width,
              minHeight: responsiveNess.height,
              backgroundColor: 'gray',
            }}
            onClick={(e) =>
              setTimeout(() => {
                setModality(GAME_SETTINGS.PLAYER_VS_COMPUTER)
              }, 500)
            }
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.primary"
                gutterBottom
                variant="body2"
              >
                Player vs. Computer
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Grid
        container
        item
        alignItems="center"
        xs={12}
        md={4}
        sm={12}
        direction="column"
      >
        <Card variant="elevation">
          <CardActionArea
            sx={{
              minWidth: responsiveNess.width,
              minHeight: responsiveNess.height,
              backgroundColor: 'gray',
            }}
            onClick={(e) =>
              setTimeout(() => {
                setModality(GAME_SETTINGS.ONLINE)
              }, 500)
            }
          >
            <CardContent>
              <Typography
                sx={{ fontSize: 18 }}
                color="text.primary"
                gutterBottom
                variant="body2"
              >
                Play Online
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Grid>
  )
}
