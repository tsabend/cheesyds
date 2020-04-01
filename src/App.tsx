import React, { useState } from "react";
import {
  selectRemoteGameId
} from "./app/appSlice";
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

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: "#fff"
    },
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
  const dispatch = useDispatch();
  const gameId = useSelector(selectRemoteGameId);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(true);
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
        {gameId &&
          <Button variant="contained" color="default">{gameId}</Button>
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
