import React from "react";
import Grid from "@material-ui/core/Grid";
import CardView from "./CardView"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box,
  Tooltip,
} from "@material-ui/core";
import Card from "../../app/card";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    emptyPile: {
      width: "100px",
      height: "133px",
      border: "2px black solid",
      margin: "auto",
    },
    gamePiles: {
      margin: "32px 0px 64px 0px",
    },
  });

type GamePilesViewProps = {
  deck: Card[];
  inPlayPile: Card[];
} & WithStyles<typeof styles>;

const GamePilesView = ({ classes, deck, inPlayPile }: GamePilesViewProps) => {

  const estimateString = (cards: Card[]): string | undefined => {
    if (cards.length === 0) return undefined;
    if (cards.length < 10) return "Fewer than 10 cards.";
    if (cards.length < 20) return "More than 10 cards.";
    if (cards.length < 50) return "More than 20 cards.";
    return "Too many cards to count.";
  }
  const drawPileTitle = estimateString(deck) || "Draw Pile (empty)";
  const playPileTitle = estimateString(inPlayPile) || "Cards In Play (empty)";;
  const topOfInPlayPile = (): Card | undefined => {
    if (inPlayPile.length > 0) {
      return inPlayPile[inPlayPile.length - 1];
    }
    return undefined;
  }

  const inPlayPileView = () => {
    const topCard = topOfInPlayPile()
    if (topCard) {
      return <div>
      <CardView card={topCard}
      cardWasTapped={() => {}}
      isSelected={false}
      isEnabled={false}
      />
      </div>
    }
    else {
      return <div className={classes.emptyPile}></div>
    }
  }

  const drawPile = () => {
    const card = deck[0];
    if (card) {
      return <div>
      <CardView card={card}
      cardWasTapped={() => {}}
      isSelected={false}
      isEnabled={false}
      isFaceDown={true}
      />
      </div>
    }
    else {
      return <div className={classes.emptyPile}></div>
    }
  }

  return (
    <Box className={classes.gamePiles}><Grid container alignItems="center" justify="center" spacing={4}>
    <Grid item>
    <Tooltip title={drawPileTitle}>
    {drawPile()}
    </Tooltip>
    </Grid>
    <Grid item>
    <Tooltip title={playPileTitle}>
    {inPlayPileView()}
    </Tooltip>
    </Grid>
    </Grid>
    </Box>
  );
};

export default withStyles(styles)(GamePilesView);
