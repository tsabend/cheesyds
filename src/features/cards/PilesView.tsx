import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import CardView from "./CardView"
import {
  Suit,
  FaceValue,
  Card
} from "../../app/card"
import {
  GameSnapshot,
  GameBuilder
} from "../../app/game"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress
} from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type PilesViewProps = {
  piles: Array<Array<Card>>;
  isEnabled: boolean;
} & WithStyles<typeof styles>;

const PilesView = ({ piles, isEnabled, classes }: PilesViewProps) => {

  return (
    <Grid container alignItems="center" justify="center" spacing={1}>
    <Grid item xs={12}>
    <p>Piles:</p>
    </Grid>
    {
      piles.map(pile => {
        const length = pile.length;
        if (length === 0) {
          return "";
        }
        const card = length === 1 ? pile[0] : pile[1];
        return <Grid item>
        <CardView
        card={card}
         key={card.index()}
         isEnabled={isEnabled}
         />
        </Grid>
    })
    }
    </Grid>
  );
};

export default withStyles(styles)(PilesView);
