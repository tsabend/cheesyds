import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import CardView from "./CardView"
import HandView from "./HandView"
import PilesView from "./PilesView"
import {
  Suit,
  FaceValue,
  Card
} from "../../app/card"
import {
  GameSnapshot
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
  selectGameSnapshot,
  pickUp
} from "./gameSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type PlayingGameViewProps = {

} & WithStyles<typeof styles>;

const PlayingGameView = ({ classes }: PlayingGameViewProps) => {
  const dispatch = useDispatch();
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const player = game.currentPlayer();

  const inPlayPile = () => {
    const card = game.topOfInPlayPile()
    if (card) {
      return <div>
      <p>In Play Pile:</p>
      <CardView card={card} isEnabled={false}/>
      </div>
    }
    else {
      return <div></div>;
    }
  }

  return (
    <React.Fragment>
    {inPlayPile()}
    <div>
    <p>Player: {player.name}</p>
    <Grid container alignItems="center" justify="center" spacing={3}>
    <p>Hand:</p>
    <HandView hand={player.board.hand} />
    </Grid>
    <Grid container alignItems="center" justify="center" spacing={3}>
    <p>Board:</p>
    <PilesView piles={player.board.piles} isEnabled={player.isEliminatingPiles()} />
    </Grid>
    <Button
    className={classes.button}
    aria-label="Submit turn"
    onClick={() => dispatch(submit())}
    >
    SUBMIT
    </Button>
    <Button
    className={classes.button}
    aria-label="Forfeit turn"
    onClick={() => dispatch(pickUp())}
    >
    PICK UP
    </Button>
    </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(PlayingGameView);
