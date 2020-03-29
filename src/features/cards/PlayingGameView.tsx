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
  GridListTile,
  Box
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
    root: {
      backgroundColor: "green",
      width: "100%",
      color: "#fff"
    },
    button: {
      margin: "16px",
    },
    emptyPile: {
      width: "100px",
      height: "133px",
      border: "2px black solid",
      margin: "auto",
    },
    mainTitle: {
      color: "#fff",
    },
    upNextListRoot: {
      marginTop:"32px",
      verticalAlign: "bottom",
      overflowY: "hidden",
    },
    upNextList: {
      color: "black",
      overflowY: "hidden",
      paddingBottom: "100px",
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    upNextListItem: {
      margin: "0px 32px",
      backgroundColor: "lightGray",
      border: "1px black solid",
    },
    upNowListItem: {
      margin: "0px 32px",
      backgroundColor: "green",
      border: "1px black solid",
    },
    gamePiles: {
      margin: "0px 0px 64px 0px",
    },
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
  const itIsMyTurn = player === me;

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

  const drawPile = () => {
    const card = game.deck.cards[0];
    if (card) {
      return <div>
      <CardView card={card}
      isEnabled={false}
      isFaceDown={true}
      />
      </div>
    }
    else {
      return <div>
      <div className={classes.emptyPile}>
      <Typography>
      No Cards Left
      </Typography>
      </div>
      </div>
    }
  }

  const gamePiles = () => {
    return <Box className={classes.gamePiles}><Grid container alignItems="center" justify="center" spacing={0}>
    <Grid item xs={1}>
    {drawPile()}
    </Grid>
    <Grid item xs={1}>
    {inPlayPile()}
    </Grid>
    </Grid>
    </Box>
  }

  const buildMyBoard = () => {
    if (me) {
      return <React.Fragment>
      <PilesView piles={me.board.piles} isEnabled={me.isEliminatingPiles()} />
      <HandView hand={me.board.hand} />
      {itIsMyTurn &&
        <React.Fragment>
        <Button
        className={classes.button}
        color={'primary'}
        variant={'contained'}
        aria-label="Submit turn"
        onClick={ () => remoteGame && dispatch(submitCards(turn.cardsToSubmit, remoteGame)) }
        >
        SUBMIT
        </Button>
        <Button
        className={classes.button}
        color={'primary'}
        variant={'contained'}
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
    const cols = 4.7 // todo - make this dynamic on resize
    return <div className={classes.upNextListRoot}>
    <p><Typography className={classes.mainTitle} variant="h5">UP NEXT</Typography></p>
    <GridList className={classes.upNextList} cellHeight={"auto"} cols={cols} spacing={0}>
    {game.upcomingPlayers().map((player, index) => {
      return <GridListTile className={classes.upNextListItem} cols={1}>
      children={<div >
      <Typography variant="h6">{player.name}</Typography>
      <Typography>{player.numberOfCards()} cards in hand</Typography>
      <Typography>piles:</Typography>
      <PilesView piles={player.board.piles} isEnabled={false} /></div>
    }
      </GridListTile>
    })}
    </GridList>
    </div>
  }

  return (
    <Box className={classes.root}>
    <p><Typography className={classes.mainTitle} variant="h5">
    {itIsMyTurn ? "YOUR TURN" : "NOW PLAYING: " + player.name}
    </Typography></p>
    {gamePiles()}
    <div>
    {buildMyBoard()}
    </div>
    {buildUpNextView()}
    </Box>
  );
};

export default withStyles(styles)(PlayingGameView);
