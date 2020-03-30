import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress,
  FormControl,
  FormHelperText
} from "@material-ui/core";
import GameSnapshot from "../../app/GameSnapshot"
import { useSelector, useDispatch } from "react-redux";
import {
  selectGameSnapshot,
  selectMe,
  savePunishment,
  playAgain,
  selectRemoteGame,
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    root: {
      paddingTop: '64px',
      height: '600px',
      backgroundColor: "green",
      width: "100%",
      color: "#fff"
    },
    text: {
      color: "#fff",
    },
  });

type GameOverViewProps = {
} & WithStyles<typeof styles>;

const GameOverView = ({ classes }: GameOverViewProps) => {
  const dispatch = useDispatch();
  const remoteGame = useSelector(selectRemoteGame);
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const player = game.currentPlayer();
  const myName = useSelector(selectMe);
  const iWon = game.winner?.name === myName;
  const [punishment, setPunishment] = useState("");
  const [punishmentHasBeenGiven, setPunishmentHasBeenGiven] = useState(false);
  const loserName = game.loser()?.name || "";
  const winnerName = game.winner?.name || "";

  const buildPunishment = () => {
    if (punishmentHasBeenGiven) return "";
    if (iWon) {
      return <Grid container alignItems="center" justify="center" spacing={1}>
      <Grid item xs={12}>
      <FormControl>
      <Input id="punishment" aria-describedby="punishment-helper-text"
      onChange={e => setPunishment(e.target.value)}
      className={classes.text}
      />
      <FormHelperText
      id="punishment-helper-text"
      className={classes.text}
      >
      Devise {loserName}'s Punishment</FormHelperText>
      </FormControl>
      </Grid>
      <Grid item xs={12}>
      <Button
      type="submit"
      color={'primary'}
      variant={'contained'}
      onClick={() => {
        if (!remoteGame) return;
        dispatch(savePunishment(punishment, remoteGame));
        setPunishmentHasBeenGiven(true);
      }}>
      PUNISH THEM
      </Button>
      </Grid>
      </Grid>
    }
    else {
      return <Typography variant={'h6'}>
        Waiting for {winnerName} to punish {loserName}
      </Typography>
    }
  }

  const buildPlayAgainButtons = () => {
    if (!punishmentHasBeenGiven) return "";
    return <Grid container alignItems="center" justify="center" spacing={1}>
    <Grid item xs={12}>
      <Button
       type="submit"
       color={'primary'}
       variant={'contained'}
       disabled={punishment.length === 0}
       onClick={() => {
         if (!remoteGame) return;
         dispatch(playAgain(remoteGame));
       }}>
      PLAY AGAIN
      </Button>
    </Grid>
    </Grid>
  }

  return (
    <div className={classes.root}>
    <Typography variant={'h5'}>GAME OVER.</Typography>
    <p>{loserName} lost</p>
    <p>{winnerName} will decide their punishment</p>
    {buildPunishment()}
    {buildPlayAgainButtons()}
    </div>
  );
};

export default withStyles(styles)(GameOverView);
