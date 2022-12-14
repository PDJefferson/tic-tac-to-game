import { createTheme } from "@mui/material"
export const disableButtonTheme = createTheme({
    palette: {
      action: {
        disabledBackground: 'gray',
        disabled: 'white',
      },
    },
})