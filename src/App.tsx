import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import GameView from "./features/cards/GameView";
import PairingCoordinator from "./features/pairing/PairingCoordinator";
import { fire } from './app/fire';
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

const styles: (theme: Theme) => StyleRules<string> = theme =>
createStyles({
  root: {

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
  appLink: {
    color: "rgb(112, 76, 182)"
  }
});

type AppProps = {} & WithStyles<typeof styles>;

const App = ({ classes }: AppProps) => {
  const [messages, setMessages] = useState(Array<any>())

  useEffect(() => {
    console.log("USE EFFECT CALLED")
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
        /* Update React state when message is added at Firebase Database */
        let message = { text: snapshot.val(), id: snapshot.key };
        setMessages([message].concat(messages));
      })
    }, []);
   const addMessage = (e: any) => {
     e.preventDefault(); // <- prevent form submit from reloading the page
     /* Send the message to Firebase */
     const m = e.target.elements[0].value
     fire.database().ref('messages').push( m );
     e.target.elements[0].value = ''; // <- clear the input
   }

  return (
    <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <div className={classes.app}>
    <header className={classes.appHeader}>
    <p>CheesyD</p>
    <PairingCoordinator />
    </header>
    </div>
    <React.Fragment>
    <form onSubmit={(e) => {
        addMessage(e);
      }
    }>

    <input type="text" />
    <input type="submit"/>
    <ul>
    { /* Render the list of messages */
      messages.map( message => <li key={message.id}>{message.text}</li> )
    }
    </ul>
    </form>
    </React.Fragment>
    </MuiThemeProvider>
  );
}

export default withStyles(styles)(App);

// const App = ({ classes }: AppProps) => (
//   <MuiThemeProvider theme={theme}>
//     <CssBaseline />
//     <div className={classes.app}>
//       <header className={classes.appHeader}>
//         <img src={logo} className={classes.appLogo} alt="logo" />
//         <Counter />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <span>
//           <span>Learn </span>
//           <a
//             className={classes.appLink}
//             href="https://reactjs.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React
//           </a>
//           <span>, </span>
//           <a
//             className={classes.appLink}
//             href="https://redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux
//           </a>
//           <span>, </span>
//           <a
//             className={classes.appLink}
//             href="https://redux-toolkit.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Redux Toolkit
//           </a>
//           <span>, </span>
//           <a
//             className={classes.appLink}
//             href="https://react-redux.js.org/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             React Redux
//           </a>
//           <span>, and </span>
//           <a
//             className={classes.appLink}
//             href="https://material-ui.com/"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Material-UI
//           </a>
//         </span>
//       </header>
//     </div>
//   </MuiThemeProvider>
// );
