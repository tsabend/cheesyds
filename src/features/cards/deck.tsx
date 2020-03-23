import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import Card from "./card"
import {
  Suit,
  FaceValue,
  CardModel,
  DeckBuilder
} from "./deckBuilder"
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

type DeckProps = {

} & WithStyles<typeof styles>;

const Deck = ({ classes }: DeckProps) => {
  const build = () => {
    const builder = new DeckBuilder();
    const models = builder.buildDeck();
    return models.map(model => {
      return <Grid item>
        <Card suit={model.suit} faceValue={model.faceValue}/>
      </Grid>
    });
  }

  return (
    <React.Fragment>
    <Grid container xs={4} alignItems="center" justify="center" spacing={3}>
      {build()};
    </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(Deck);
