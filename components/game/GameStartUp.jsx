import { GAME_SETTINGS } from '../../constants/game'
import { Card, CardContent, Typography, Grid } from '@mui/material'
export default function GameStartUp({ modality, setModality }) {
  return (
    <Grid container spacing={1} justifyContent="center" direction="row">
      <Grid
        container
        item
        alignItems="center"
        xs={12}
        md={4}
        sm={12}
        direction="column"
      >
        <Card
          sx={{
            cursor: 'pointer',
            minWidth: 200,
            maxWidth: 370,
            minHeight: 200,
            backgroundColor: 'gray',
          }}
          variant="outlined"
          onClick={(e) => setModality(GAME_SETTINGS.PLAYER_VS_PLAYER)}
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              variant="body2"
            >
              <br></br>
              <br></br>
              Player vs. Player
            </Typography>
          </CardContent>
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
        <Card
          sx={{
            cursor: 'pointer',
            minWidth: 200,
            maxWidth: 370,
            minHeight: 200,
            backgroundColor: 'gray',
          }}
          onClick={(e) => setModality(GAME_SETTINGS.PLAYER_VS_COMPUTER)}
          variant="outlined"
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              variant="body2"
            >
              <br></br>
              <br></br>
              Player vs. Computer
            </Typography>
          </CardContent>
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
        <Card
          sx={{
            cursor: 'pointer',
            minWidth: 200,
            maxWidth: 370,
            minHeight: 200,
            backgroundColor: 'gray',
          }}
          onClick={(e) => setModality(GAME_SETTINGS.ONLINE)}
          variant="outlined"
        >
          <CardContent>
            <Typography
              sx={{ fontSize: 18 }}
              color="text.secondary"
              gutterBottom
              variant="body2"
            >
              <br></br>
              <br></br>
              Play Online
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
