import ClearIcon from '@mui/icons-material/Clear'
import classes from '../../styles/OComponent.module.css'
import { GAME_SETTINGS } from '../../constants/game'
export default function OComponent() {
  return <i className={classes.circle} id={GAME_SETTINGS.O_USER}></i>
}
