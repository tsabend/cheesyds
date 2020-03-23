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

type HandViewProps = {
  hand: Array<Card>;
} & WithStyles<typeof styles>;

const HandView = ({ hand, classes }: HandViewProps) => {

  return (
    <React.Fragment>
    {
      hand.map(card => {
        return <Grid item>
          <CardView card={card} key={card.index()} isEnabled={true}/>
        </Grid>
      })
    }
    </React.Fragment>
  );
};

export default withStyles(styles)(HandView);
