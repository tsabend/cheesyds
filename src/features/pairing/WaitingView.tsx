import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";

import { useSelector, useDispatch } from "react-redux";
import {
  cancelGame,
  startGameAsync,
  selectPairingPlayers,
  selectRemoteGameId,
  selectRemoteGame,
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
  });

type WaitingViewProps = {
  isOwner: boolean,
} & WithStyles<typeof styles>;

const WaitingView = ({ isOwner }: WaitingViewProps) => {
  const dispatch = useDispatch();
  const players = useSelector(selectPairingPlayers);
  const gameId = useSelector(selectRemoteGameId);
  const game = useSelector(selectRemoteGame);

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
      onClick={ () => { game && dispatch(startGameAsync(game)) }}
      >
      {canStartGame ? "Start Game" : "Waiting for at least 2 players"}
    </Button>
  }

  const canStartGame = players.length > 1;

  return (
    <Grid container alignItems="center" justify="center" spacing={4}>
      <Grid item xs={12}>
      <FormControl>
      <Typography>Invite Friends by Sharing This Code</Typography>
      <Typography>{gameId}</Typography>
      </FormControl>
      </Grid>
      <Grid item xs={12}>
        <FormControl>
          <Typography>Players In Game:</Typography>
          {playerList()}
          {startButton()}
          <Button onClick={() => {
            dispatch(cancelGame())
            }
          }>
          Cancel
          </Button>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(WaitingView);
