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
  topOfInPlayPile: Card | undefined;
} & WithStyles<typeof styles>;

const GamePilesView = ({ classes, deck, topOfInPlayPile }: GamePilesViewProps) => {
  const inPlayPile = () => {
    if (topOfInPlayPile) {
      return <div>
      <CardView card={topOfInPlayPile}
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
    {drawPile()}
    </Grid>
    <Grid item>
    {inPlayPile()}
    </Grid>
    </Grid>
    </Box>
  );
};

export default withStyles(styles)(GamePilesView);
