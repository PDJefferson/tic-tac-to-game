import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { GAME_SETTINGS } from '../../constants/game';
export default function XComponent() {
  return <CloseOutlinedIcon sx={{color:"white", height:"50px", width:"50px", padding:0, margin:0}} id={GAME_SETTINGS.X_USER}></CloseOutlinedIcon>
}
