import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CardView from "./CardView"
import HandView from "./HandView"
import PilesView from "./PilesView"
import GameSnapshot from "../../app/GameSnapshot"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  GridList,
  GridListTile,
  Box,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  submitCards,
  selectMyPlayer,
  selectRemoteGame,
  selectTurn,
  selectGameSnapshot,
  selectLastTurnSummary,
  pickUpCards
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    root: {
      backgroundColor: "green",
      width: "100%",
      color: "#fff",
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
      padding: "16px",
    },
    turnSummary: {
      padding: "16px",
      backgroundColor: "#fff",
      color: "#000",
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
      margin: "32px 0px 64px 0px",
    },
    myTurnButtonsBox: {
      margin: "8px",
    }
  });

type PlayingGameViewProps = {

} & WithStyles<typeof styles>;

const PlayingGameView = ({ classes }: PlayingGameViewProps) => {
  const dispatch = useDispatch();
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const remoteGame = useSelector(selectRemoteGame);
  const lastTurnSummary = useSelector(selectLastTurnSummary);
  const turn = useSelector(selectTurn);
  const me = useSelector(selectMyPlayer);
  const player = game.currentPlayer();
  const itIsMyTurn = player === me;
  const sm = useMediaQuery(useTheme().breakpoints.down('sm'));
  const xs = useMediaQuery(useTheme().breakpoints.down('xs'));

  const inPlayPile = () => {
    const card = game.topOfInPlayPile()
    if (card) {
      return <div>
      <CardView card={card}
      isEnabled={false}
      />
      </div>
    }
    else {
      return <div className={classes.emptyPile}></div>
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
      return <div className={classes.emptyPile}></div>
    }
  }

  const gamePiles = () => {
    return <Box className={classes.gamePiles}><Grid container alignItems="center" justify="center" spacing={4}>
    <Grid item>
    {drawPile()}
    </Grid>
    <Grid item>
    {inPlayPile()}
    </Grid>
    </Grid>
    </Box>
  }

  const buildMyBoard = () => {
    if (me) {
      return <React.Fragment>
      <PilesView
       piles={me.board.piles}
       isEnabled={me.isEliminatingPiles()}
       width={me.board.hand.length === 0 ? 80 : 60}
       />
      <HandView hand={me.board.sortedHand()} />
      {itIsMyTurn &&
        <Box className={classes.myTurnButtonsBox}>
        <Button
        className={classes.button}
        color={'primary'}
        variant={'contained'}
        aria-label="Submit turn"
        disabled={turn.cardsToSubmit.length === 0}
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
        </Box>
      }
        </React.Fragment>
    }
    return <p>You're out</p>;
  }

  const buildUpNextView = () => {
    var cols
    if (xs) {
      cols = 1.1
    }
    else if (sm) {
      cols = 2.1
    }
    else {
      cols = 3.1
    }
    return <div className={classes.upNextListRoot}>
    <GridList className={classes.upNextList} cellHeight={"auto"} cols={cols} spacing={0}>
    {game.upcomingPlayers().map((player, index) => {
      const makeHeader = (index: number) => {
        switch (index) {
          case 0:
          return player.name + " - Up Next";
          case 1:
          return player.name + " - In the Hole";
          default:
          return player.name;
        }
      }
      return <GridListTile className={classes.upNextListItem} cols={1}>
      children={<div >
        <Typography variant="h6">{makeHeader(index)}</Typography>
      <Typography>{player.numberOfCards()} cards in hand</Typography>
      <Typography>piles:</Typography>
      <PilesView piles={player.board.piles} isEnabled={false} width={50} /></div>
    }
      </GridListTile>
    })}
    </GridList>
    </div>
  }

  const punishmentList = () => {
    if (game.punishments.length === 0) return "";
    return <div>
    <Typography variant={"h3"}>Punishments</Typography>
    <ul>
    {game.punishments.map(punishment => {
      return <li>
      <p>{punishment}</p>
      </li>
    })}
    </ul>
    </div>
  }

  return (
    <Box className={classes.root}>
    <Typography className={classes.turnSummary}>
    {lastTurnSummary || ""} {itIsMyTurn ? "Your move." : player.name + " is up now."}
    </Typography>
    {gamePiles()}
    <div>
    {buildMyBoard()}
    </div>
    {buildUpNextView()}
    {punishmentList()}
    </Box>
  );
};

export default withStyles(styles)(PlayingGameView);
