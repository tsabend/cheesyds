import React, { useState, useEffect } from "react";
import {
  selectAppState,
  joinGameAsync,
  startOpenHandedGame,
  quitGame,
} from "./app/appSlice";
import { AppProgress } from "./app/appState";
import { useSelector, useDispatch } from "react-redux";
import PairingCoordinator from "./features/pairing/PairingCoordinator";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Drawer from '@material-ui/core/Drawer';
import RulesModal from './RulesModal'
import {
  createMuiTheme,
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  StyleRules
} from "@material-ui/core/styles";
import {
  MuiThemeProvider,
  CssBaseline,
  ListItem,
  ListItemText,
  List,
  ListItemIcon,
  Divider,

} from "@material-ui/core";
import purple from "@material-ui/core/colors/purple";
import red from "@material-ui/core/colors/red";

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: "#fff"
    },
    warning: red,
    background: {
      default: "#fff"
    }
  }
});

const styles: (theme: Theme) => StyleRules<string> = _ =>
createStyles({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navButton: {
    margin: '0px 0.25rem',
  },
  quitButton: {
    backgroundColor: theme.palette.warning.main,
  },
  app: {
    textAlign: "center"
  },
  appLogo: {
    height: "40vmin",
    pointerEvents: "none",
    "@media (prefers-reduced-motion: no-preference) ": {
      animation: "App-logo-float infinite 3s ease-in-out"
    }
  },
  appHeader: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)"
  },
  toolbar: theme.mixins.toolbar,
  appLink: {
    color: "rgb(112, 76, 182)"
  },
  list: {
    width: 250,
  },
});

type AppProps = {} & WithStyles<typeof styles>;

const App = ({ classes }: AppProps) => {
  useEffect(() => {
    const session = appState.session;
    if (appState.progress === AppProgress.Rejoining && session) {
      dispatch(joinGameAsync(session.id, appState.me));
    }
    if (isDebug) {
      setIsDebug(false);
      dispatch(startOpenHandedGame())
    }
  })
  const [isDebug, setIsDebug] = useState(false)

  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const id = appState.session?.id;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const toggleDrawer = (open: boolean) => (event: any) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    console.log("setting drawer open=", open);
    setIsDrawerOpen(open);
  };

  const drawer = () => (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
      <div className={classes.toolbar} />
        <List>
          <Divider />
          {['Rules'].map((text, _) => (
            <ListItem
            button
            key={text}
            onClick={() => setIsRulesModalOpen(true)}
            >
              <ListItemIcon>{<AssignmentIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );


  return (
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <div className={classes.app}>
    <RulesModal open={isRulesModalOpen} onClose={() => setIsRulesModalOpen(false)}/>
    <AppBar position="static">
      <Drawer anchor={"left"} open={isDrawerOpen} onClose={toggleDrawer(false)}>
        {drawer()}
      </Drawer>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => { dispatch(toggleDrawer(true)); }}
          >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>CheezyD</Typography>
        {id &&
          <Button
          className={classes.navButton}
          variant="contained"
          color="default"
          disableRipple={true}
          disableElevation={true}
          >
          {id}
          </Button>
        }
        {id &&
          <Button
          className={classes.quitButton}
          variant="contained"
          color="inherit"
          onClick={ () => dispatch(quitGame(appState)) }
          >
          QUIT
          </Button>
        }
      </Toolbar>
    </AppBar>
    <div className={classes.root}>
    <PairingCoordinator />
    </div>
    </div>

    </MuiThemeProvider>
  );
}

export default withStyles(styles)(App);
