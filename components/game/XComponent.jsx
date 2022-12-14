import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { GAME_SETTINGS } from '../../constants/game';
import classes from '../../styles/XComponent.module.css'
export default function XComponent() {
  return <CloseOutlinedIcon className={classes['x-component']} id={GAME_SETTINGS.X_USER}></CloseOutlinedIcon>
}
