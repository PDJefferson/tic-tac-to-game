import React from 'react'
import { Modal, Box, Typography, TextField, Grid, Button } from '@mui/material'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 450,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

export default function CustomModal({ setIsModalOpen, isModalOpen, joinRoom }) {
  const [newRoom, setNewRoom] = React.useState('')
  return (
    <Modal
      closeAfterTransition
      open={isModalOpen}
      onClose={setIsModalOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h4"
          component="h4"
          align="center"
          textAlign="center"
          margin={2}
        >
          ENTER ROOM NAME
        </Typography>
        <TextField
          fullWidth
          id="filled-basic"
          label="new room"
          value={newRoom}
          variant="filled"
          onChange={(e) => setNewRoom(e.target.value)}
        />
        <Grid container spacing={2} marginTop={2} justifyContent="space-around">
          <Grid item>
            <Button
              variant="contained"
              onClick={(e) => setIsModalOpen(false)}
              color="warning"
            >
              RETURN
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => joinRoom(newRoom)}
              type="submit"
              variant="contained"
              color="success"
            >
              CREATE
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}
