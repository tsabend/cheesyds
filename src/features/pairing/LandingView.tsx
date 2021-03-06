import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box,
} from "@material-ui/core";

import { useDispatch } from "react-redux";
import {
  startPairingAsync,
  startGameVsCPU,
  startOpenHandedGame,
  joinGameAsync,
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
  });

type LandingViewProps = {

} & WithStyles<typeof styles>;

const LandingView = (_: LandingViewProps) => {
  const dispatch = useDispatch();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const isJoining = gameCode.length > 0
  const buttonText = isJoining ? "Join Game" : "Start a New Game"

  const playComputerButton = () => {
    const isDebug = false;
    if (!isDebug) return ""
    return <Box>
    <Button
      type="submit"
      onClick={ () => { dispatch(startOpenHandedGame()) }}
      >
      {"Play Open Handed"}
    </Button>
    <Button
      type="submit"
      onClick={ () => { dispatch(startGameVsCPU()) }}
      >
      {"Play Against the Computer"}
    </Button>
    </Box>
  }

  return (
    <Grid container alignItems="center" justify="center">
      {/* Name input*/}
      <Grid item xs={12}>
        <FormControl>
          <Input id="player-name" aria-describedby="player-name-helper-text"
          onChange={e => setPlayerName(e.target.value)}
          />
          <FormHelperText id="player-name-helper-text">Enter your player name</FormHelperText>
        </FormControl>
      </Grid>
      {/* Join form */}
      <Grid item xs={12}>
      <FormControl>
      <InputLabel htmlFor="landing-code-input">Optional</InputLabel>
      <Input id="landing-code-input" aria-describedby="landing-code-helper-text"
      onChange={e => setGameCode(e.target.value)}
      />
      <FormHelperText id="landing-code-helper-text">Enter code above</FormHelperText>
      </FormControl>
      </Grid>
      {/* Start button */}
      <Grid item xs={12}>
        <Button
         type="submit"
         disabled={playerName.length === 0}
         onClick={() => {
           if (isJoining) {
             dispatch(joinGameAsync(gameCode, playerName));
           }
           else {
             dispatch(startPairingAsync(playerName))
           }
         }}>
        {buttonText}
        </Button>
        {playComputerButton()}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(LandingView);
