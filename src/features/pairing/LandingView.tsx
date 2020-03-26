import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  startPairingAsync,
  joinGameAsync,
} from "./pairingSlice"

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type LandingViewProps = {

} & WithStyles<typeof styles>;

const LandingView = ({ classes }: LandingViewProps) => {
  const dispatch = useDispatch();
  const getInputText = (id: string): string => {
    return (document.getElementById(id) as HTMLInputElement)?.value || "";
  }
  const getPlayerName = (): string => { return getInputText("player-name") }
  const getGameCode = (): string => { return getInputText("landing-code-input") }
  return (
    <Grid container alignItems="center" justify="center" spacing={4}>
      {/* Name input*/}
      <Grid item>
        <FormControl>
          <InputLabel htmlFor="player-name">Name</InputLabel>
          <Input id="player-name" aria-describedby="player-name-helper-text" />
          <FormHelperText id="player-name-helper-text">Enter your player name</FormHelperText>
        </FormControl>
      </Grid>
      {/* Start button */}
      <Grid item>
        <Typography>Get that D!</Typography>
        <Button type="submit" onClick={() => dispatch(startPairingAsync(getPlayerName()))}>
        Start New Game
        </Button>
      </Grid>
      {/* Join form */}
      <Grid item>
        <FormControl>
          <InputLabel htmlFor="landing-code-input">Game Code</InputLabel>
          <Input id="landing-code-input" aria-describedby="landing-code-helper-text" />
          <FormHelperText id="landing-code-helper-text">Enter code above</FormHelperText>
          <Button type="submit" onClick={ () => {
            dispatch(joinGameAsync(getGameCode(), getPlayerName()));
          }}>Join Existing Game</Button>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(LandingView);
