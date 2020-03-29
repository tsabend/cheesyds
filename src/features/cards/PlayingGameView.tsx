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
  CircularProgress,
  List,
  ListItem,
  GridList,
  GridListTile
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
    emptyPile: {
        width: "73px",
        height: "97px",
        border: "2px black solid",
        margin: "auto",
    },
    upNextList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    }
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
      return <div>
      <div className={classes.emptyPile}>
      <Typography>
      Cards in Play
      </Typography>
      </div>
      </div>


    }
  }

  const buildMyBoard = () => {
    if (me) {
      return <React.Fragment>
      <HandView hand={me.board.hand} />
      <PilesView piles={me.board.piles} isEnabled={me.isEliminatingPiles()} />
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
      return <GridListTile>
      <Typography>{player.name} - {player.numberOfCards()} cards in hand</Typography>
      <PilesView piles={player.board.piles} isEnabled={false} />
      </GridListTile>
    });
    return <GridList className={classes.upNextList} cols={6}>
    {upcoming}
    </GridList>
  }

  return (
    <React.Fragment>
    {buildUpNextView()}
    <p>{player.name}'s Turn</p>
    {inPlayPile()}
    <div>
    {buildMyBoard()}
    </div>
    </React.Fragment>
  );
};

export default withStyles(styles)(PlayingGameView);
