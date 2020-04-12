import React, { useState, useEffect } from "react";
import GamePilesView from "./GamePilesView";
import GameSnapshot from "../../app/GameSnapshot"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectGameSnapshot,
  selectMe
} from "../../app/appSlice";
import UpNextView from "./UpNextView";
import PunishmentListView from "./PunishmentListView";
import BoardView from "./BoardView";
import GameLogView from "./GameLogView";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    root: {
      backgroundColor: "green",
      width: "100%",
      color: "#fff",
    },
    flash: {
      backgroundColor: "white",
    }
  });

type PlayingGameViewProps = {

} & WithStyles<typeof styles>;

const PlayingGameView = ({ classes }: PlayingGameViewProps) => {
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const me: string = useSelector(selectMe);

  useEffect(() => {
    if (game.currentPlayer().name === me && needsFlashing) {
      // Lol, refactor this
      setNeedsFlashing(false);
      setTimeout(() => {
        setIsFlashing(true);
        setTimeout(() => {
          setIsFlashing(false);
          setTimeout(() => {
            setIsFlashing(true);
            setTimeout(() => {
              setIsFlashing(false);
            }, 100);
          }, 100);
        }, 100);
      }, 100);
    }
    else if (game.currentPlayer().name !== me) {
      setNeedsFlashing(true);
    }
  })

  const [isFlashing, setIsFlashing] = useState(false);
  const [needsFlashing, setNeedsFlashing] = useState(false);

  return (
    <Box className={[classes.root, isFlashing ? classes.flash : ""].join(" ")}>
    <GameLogView />
    <GamePilesView deck={game.deck.cards} inPlayPile={game.inPlayPile} />
    <div>
    <BoardView />
    </div>
    <UpNextView upcomingPlayers={game.upcomingPlayers()} />
    <PunishmentListView punishments={game.punishments} />
    </Box>
  );
};

export default withStyles(styles)(PlayingGameView);
