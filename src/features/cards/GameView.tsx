import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import PlayingGameView from "./PlayingGameView"
import GameOverView from "./GameOverView"
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
  selectGameSnapshot,
} from "../../app/appSlice";
import GameSnapshot from "../../app/GameSnapshot"

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type GameViewProps = {

} & WithStyles<typeof styles>;

const GameView = ({ classes }: GameViewProps) => {
  const game: GameSnapshot = useSelector(selectGameSnapshot);

  const build = () => {
    if (game.isOver()) {
      return <GameOverView />
    }
    else {
      return <PlayingGameView />
    }
  }
  return (
    <React.Fragment>
    {build()}
    </React.Fragment>
  );
};

export default withStyles(styles)(GameView);
