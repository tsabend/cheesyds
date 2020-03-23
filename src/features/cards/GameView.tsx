import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import HandView from "./HandView"
import PilesView from "./PilesView"
import {
  Suit,
  FaceValue,
  Card
} from "../../app/card"
import {
  Game,
  GameBuilder
} from "../../app/game"
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
  submit,
  selectGame
} from "./gameSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type GameViewProps = {

} & WithStyles<typeof styles>;

const GameView = ({ classes }: GameViewProps) => {
  const dispatch = useDispatch();
  const game = useSelector(selectGame);

  const build = () => {

    return game.players.map(player => {
      const isCurrentPlayer = game.isCurrentPlayer(player);
      return <div>
        <p>Player: {player.name} {isCurrentPlayer ? "is current player" : ""}</p>
        <Grid container xs={12} alignItems="center" justify="center" spacing={3}>
        <p>Hand:</p>
        <HandView hand={player.board.hand} />
        <p>Board:</p>
        <PilesView piles={player.board.piles} />
        </Grid>
        {
          isCurrentPlayer && // && is a trick to get conditional rendering working
          <Button
          className={classes.button}
          aria-label="Decrement value"
          onClick={() => dispatch(submit())}
          >
          SUBMIT
          </Button>
        }
      </div>
    })
  }

  return (
    <React.Fragment>
    { build() }
    </React.Fragment>
  );
};

export default withStyles(styles)(GameView);
