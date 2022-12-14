import { Snackbar, Alert } from "@mui/material";
import React from "react";

export default function AlertSnackBar({ typeMessage, passedMessage, removeData = () => {} }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    removeData();
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={typeMessage}
        sx={{ width: "100%" }}
      >
        {passedMessage}
      </Alert>
    </Snackbar>
  );
}