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
  CircularProgress
} from "@material-ui/core";
import {
  GameSnapshot
} from "../../app/game"
import { useSelector, useDispatch } from "react-redux";
import {
  selectGameSnapshot,
} from "./gameSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type GameOverViewProps = {

} & WithStyles<typeof styles>;

const GameOverView = ({ classes }: GameOverViewProps) => {

  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const loserName = () => {
    const loser = game.loser();
    if (loser) {
      return loser.name;
    }
    return "No one?";
  }

  const winnerName = () => {
    const winner = game.winner;
    if (winner) {
      return winner.name;
    }
    return "No one?";
  }

  return (
    <React.Fragment>
    <p>GAME OVER. </p>
    <p>{loserName()} lost</p>
    <p>{winnerName()} will decide your punishment</p>
    </React.Fragment>
  );
};

export default withStyles(styles)(GameOverView);
