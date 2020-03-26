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
  cancelGame,
  startGame,
  selectPairingPlayers,
  selectRemoteGameId
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type WaitingViewProps = {
  isOwner: boolean,
} & WithStyles<typeof styles>;

const WaitingView = ({ classes, isOwner }: WaitingViewProps) => {
  const dispatch = useDispatch();
  const players = useSelector(selectPairingPlayers);
  const gameId = useSelector(selectRemoteGameId);

  const playerList = () => {
    return players.map(player => {
      return <Typography>{player}</Typography>;
    });
  }

  const startButton = () => {
    if (!isOwner) return "";
    return <Button
      type="submit"
      disabled={!canStartGame}
      onClick={ (e) => { dispatch(startGame()) }}
      >
      {canStartGame ? "Start Game" : "Waiting for at least 2 players"}
    </Button>
  }

  const canStartGame = players.length > 1;

  return (
    <Grid container alignItems="center" justify="center" spacing={4}>
      <Grid item>
        <FormControl>
          <Typography>Players In Game:</Typography>
          {playerList()}
          {startButton()}
          <Button onClick={(e) => {
            dispatch(cancelGame())
            }
          }>
          Cancel
          </Button>
        </FormControl>
      </Grid>
      <Grid item>
        <FormControl>
          <Typography>Invite Friends by Sharing This Code</Typography>
          <Typography>{gameId}</Typography>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(WaitingView);
