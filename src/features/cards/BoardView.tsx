import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import HandView from "./HandView"
import VaultView from "./VaultView"
import GameSnapshot from "../../app/GameSnapshot"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import {
  submitCards,
  selectMyPlayer,
  selectRemoteGame,
  selectGameSnapshot,
  pickUpCards
} from "../../app/appSlice";
import Card from "../../app/card";
import { canPlay } from "../../app/rule";

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
    mainTitle: {
      padding: "16px",
    },
    turnSummary: {
      padding: "16px",
      backgroundColor: "#fff",
      color: "#000",
    },
    myTurnButtonsBox: {
      margin: "8px",
    }
  });

type BoardViewProps = {
} & WithStyles<typeof styles>;

const BoardView = ({ classes }: BoardViewProps) => {
  const dispatch = useDispatch();
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const remoteGame = useSelector(selectRemoteGame);
  const me = useSelector(selectMyPlayer);
  const player = game.currentPlayer();
  const itIsMyTurn = player === me;

  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const topOfInPlayPile = game.topOfInPlayPile();
  const cardWasTapped = (card: Card) => {
    if (!itIsMyTurn) return;
    const isFaceDownVault = player.board.faceDownVault.includes(card);
    debugger
    if (isFaceDownVault) {
      setSelectedCards([card]);
      return
    }
    const isSameType = selectedCards[0]?.faceValue === card.faceValue;
    const canPlayOnTop = canPlay(card.faceValue, topOfInPlayPile?.faceValue);

    if (isSelected(card)) {
      setSelectedCards(selectedCards.filter((_card) => card !== _card));
    }
    else if (!canPlayOnTop) {
      setSelectedCards([]);
    }
    else if (!isSameType) {
      setSelectedCards([card]);
    }
    else {
      setSelectedCards(selectedCards.concat([card]));
    }
  }

  const isSelected = (card: Card): boolean => {
    return selectedCards.includes(card);
  }
  const buildMyBoard = () => {
    if (me) {
      return <React.Fragment>
      <VaultView
       board={me.board}
       cardWasTapped={cardWasTapped}
       isSelected={isSelected}
       isEnabled={me.isEliminatingPiles()}
       width={me.board.hand.length === 0 ? 80 : 60}
       />
      <HandView
      hand={me.board.sortedHand()}
      cardWasTapped={cardWasTapped}
      isSelected={isSelected}
      />
      {itIsMyTurn &&
        <Box className={classes.myTurnButtonsBox}>
        <Button
        className={classes.button}
        color={'primary'}
        variant={'contained'}
        aria-label="Submit turn"
        disabled={selectedCards.length === 0}
        onClick={ () => {
          if (remoteGame) {
            dispatch(submitCards(selectedCards, remoteGame)) }
            setSelectedCards([]);
          }
        }
        >
        SUBMIT
        </Button>
        <Button
        className={classes.button}
        color={'primary'}
        disabled={topOfInPlayPile === undefined}
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

  return (
    <React.Fragment>
    {buildMyBoard()}
    </React.Fragment>
  );
};

export default withStyles(styles)(BoardView);
