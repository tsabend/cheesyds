import React from "react";
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
  });

type PlayingGameViewProps = {

} & WithStyles<typeof styles>;

const PlayingGameView = ({ classes }: PlayingGameViewProps) => {
  const game: GameSnapshot = useSelector(selectGameSnapshot);

  return (
    <Box className={classes.root}>
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
