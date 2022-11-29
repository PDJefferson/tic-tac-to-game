import React from 'react'
import { signOut } from 'next-auth/react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  AppBar,
  Toolbar,
  Divider,
  Grid,
  Button,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useSession } from 'next-auth/react'
import ListItemIcon from '@mui/material/ListItemIcon'
import Image from 'next/image'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTheme } from '@mui/material/styles'

function DrawerAppBar() {
  const theme = useTheme()
  const { data: session } = useSession()
  const router = useRouter()

  const [whichRoute, setWhichRoute] = React.useState({
    home: false,
    game: false,
  })

  React.useEffect(() => {
    if (router.pathname === '/') {
      setWhichRoute((prevState) => ({
        ...prevState,
        home: true,
        game: false,
      }))
    } else if (router.pathname === '/game') {
      setWhichRoute((prevState) => ({
        ...prevState,
        game: true,
        home: false,
      }))
    } else {
      setWhichRoute((prevState) => ({
        ...prevState,
        home: false,
        game: false,
      }))
    }
  }, [router])

  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [drawerOpenUser, setDrawerOpenUser] = React.useState(false)

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleDrawerToggleUser = () => {
    setDrawerOpenUser(!drawerOpenUser)
  }

  const navItems = [
    {
      text: 'Home',
      as: '/',
      href: '/',
      selected: whichRoute.home,
      disabled: false,
    },
    {
      text: 'Tic Tac Toe',
      as: '/game',
      href: '/game',
      selected: whichRoute.game,
      disabled: false,
    },
  ]

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <List sx={{ mt: -1, mb: -1 }}>
        {navItems.map((item) => {
          return (
            <ListItem key={item.text} disablePadding divider>
              <ListItemButton
                disabled={item.disabled}
                selected={item.selected}
                component={Link}
                href={item.href}
              >
                <ListItemText primary={item.text} sx={{ ml: 2 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  const drawerUser = (
    <Box
      onClick={handleDrawerToggleUser}
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
        textAlign: 'center',
      }}
    >
      <List sx={{ mt: -1, mb: -1 }}>
        <ListItem
          disablePadding
          divider
          onClick={() =>
            signOut({
              // redirect: false,
              callbackUrl: `${process.env.NEXTAUTH_URL}`,
            })
          }
        >
          <ListItemButton>
            <ListItemText primary="Sign out" sx={{ ml: 2 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        elevation={0}
        position="static"
        color="inherit"
        enableColorOnDark
        sx={{
          marginTop: -0.7,
          marginBottom: -1.5,
          height: 80,
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{ marginRight: -1.3 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {session && (
            <Grid sx={{ marginLeft: 'auto' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggleUser}
                sx={{ mr: 1 }}
              >
                {session.user.image ? (
                  <Image
                    priority
                    src={session.user.image}
                    width={40}
                    height={40}
                    alt="user image"
                  />
                ) : (
                  <AccountCircleIcon sx={{ fontSize: 35 }} />
                )}
              </IconButton>
            </Grid>
          )}
          {router.pathname === '/signin' && !session && (
            <Grid sx={{ marginLeft: 'auto' }}>
              <Typography variant="body1" fontWeight="500">
                New?
                <Link
                  as="/register"
                  href="/register"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      ml: 1,
                      fontWeight: 500,
                    }}
                    size="large"
                    color="success"
                  >
                    Create an account.
                  </Button>
                </Link>
              </Typography>
            </Grid>
          )}
          {router.pathname === '/register' && !session && (
            <Grid sx={{ marginLeft: 'auto' }}>
              <Typography variant="body1" fontWeight="500">
                Already have an account?
                <Link
                  as="/signin"
                  href="/signin"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="text"
                    sx={{
                      textTransform: 'none',
                      ml: 1,
                      fontWeight: 500,
                    }}
                    size="large"
                    color="success"
                  >
                    Sign in
                  </Button>
                </Link>
              </Typography>
            </Grid>
          )}
          {router.pathname !== '/register' &&
            router.pathname !== '/signin' &&
            !session && (
              <Grid sx={{ marginLeft: 'auto' }}>
                <Link
                  as="/signin"
                  href="/signin"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    variant="text"
                    sx={{ textTransform: 'none' }}
                    color="success"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link
                  as="/register"
                  href="/register"
                  style={{ textDecoration: 'none' }}
                >
                  <Button
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: 'none', ml: 1, mr: 1 }}
                  >
                    Sign up
                  </Button>
                </Link>
                {/* <TbMathSymbols size={23} color="#8a0c17" /> */}
              </Grid>
            )}
        </Toolbar>
      </AppBar>
      <Divider />
      <Box component="nav" sx={{}}>
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 200,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={drawerOpenUser}
          anchor="right"
          onClose={handleDrawerToggleUser}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 200,
            },
          }}
        >
          {session && drawerUser}
        </Drawer>
      </Box>
    </Box>
  )
}

export default DrawerAppBar
