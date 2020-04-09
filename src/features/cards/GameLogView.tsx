import React from "react";
import Typography from "@material-ui/core/Typography";
import GameSnapshot from "../../app/GameSnapshot"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import {
  selectMyPlayer,
  selectGameSnapshot,
} from "../../app/appSlice";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    turnSummary: {
      padding: "16px",
      backgroundColor: "#fff",
      color: "#000",
    },
  });

type GameLogViewProps = {

} & WithStyles<typeof styles>;

const GameLogView = ({ classes }: GameLogViewProps) => {
  const game: GameSnapshot = useSelector(selectGameSnapshot);
  const lastTurnSummary = game.lastTurnSummary
  const me = useSelector(selectMyPlayer);
  const player = game.currentPlayer();
  const itIsMyTurn = player === me;

  return (
    <Typography className={classes.turnSummary}>
    {lastTurnSummary || ""} {itIsMyTurn ? "Your move." : player.name + " is up now."}
    </Typography>
  );
};

export default withStyles(styles)(GameLogView);
