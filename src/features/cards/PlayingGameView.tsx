import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import CardView from "./CardView"
import HandView from "./HandView"
import PilesView from "./PilesView"
import { Player } from "../../app/player"
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
  submitCards,
  selectMe,
  selectRemoteGame,
  selectTurn,
  selectGameSnapshot,
  pickUpCards
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type PlayingGameViewProps = {

} & WithStyles<typeof styles>;

const PlayingGameView = ({ classes }: PlayingGameViewProps) => {
  const dispatch = useDispatch();
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const remoteGame = useSelector(selectRemoteGame);
  const turn = useSelector(selectTurn);
  const myName = useSelector(selectMe);
  const me = game.players.find(player => player.name === myName);
  const player = game.currentPlayer();
  const itIsMyTurn = () => {
    return player === me;
  }

  const inPlayPile = () => {
    const card = game.topOfInPlayPile()
    if (card) {
      return <div>
      <p>In Play Pile:</p>
      <CardView card={card}
      isEnabled={false}
      />
      </div>
    }
    else {
      return <div><Typography>No cards in play</Typography></div>;
    }
  }

  const buildMyBoard = () => {
    if (me) {
      return <React.Fragment>
      <Grid container alignItems="center" justify="center" spacing={3}>
      <p>Hand:</p>
      <HandView hand={me.board.hand} />
      </Grid>
      <Grid container alignItems="center" justify="center" spacing={3}>
      <p>Board:</p>
      <PilesView piles={me.board.piles} isEnabled={me.isEliminatingPiles()} />
      </Grid>
      {itIsMyTurn() &&
        <React.Fragment>
        <Button
        className={classes.button}
        aria-label="Submit turn"
        onClick={ () => remoteGame && dispatch(submitCards(turn.cardsToSubmit, remoteGame)) }
        >
        SUBMIT
        </Button>
        <Button
        className={classes.button}
        aria-label="Forfeit turn"
        onClick={ () => remoteGame && dispatch(pickUpCards(remoteGame)) }
        >
        PICK UP
        </Button>
        </React.Fragment>
      }
        </React.Fragment>
    }
    return <p>You're out</p>;
  }

  const buildUpNextView = () => {
    const upcoming = game.upcomingPlayers().map(player => {
      return <React.Fragment>
      <Grid container alignItems="center" justify="center" spacing={3}>
      <Typography>{player.name}</Typography>
      <PilesView piles={player.board.piles} isEnabled={false} />
      </Grid>
      </React.Fragment>
    });
    return <React.Fragment>
    <p>Playing Next</p>
    {upcoming}
    </React.Fragment>
  }

  return (
    <React.Fragment>
    <p>{player.name}'s Turn</p>
    {inPlayPile()}
    <div>
    {buildMyBoard()}
    </div>
    {buildUpNextView()}
    </React.Fragment>
  );
};

export default withStyles(styles)(PlayingGameView);
