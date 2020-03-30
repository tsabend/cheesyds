import React from "react";
import PlayingGameView from "./PlayingGameView"
import GameOverView from "./GameOverView"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectGameSnapshot,
} from "../../app/appSlice";
import GameSnapshot from "../../app/GameSnapshot"

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
  });

type GameViewProps = {

} & WithStyles<typeof styles>;

const GameView = (_: GameViewProps) => {
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
