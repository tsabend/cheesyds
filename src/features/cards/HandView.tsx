import React from "react";
import Grid from "@material-ui/core/Grid";
import CardView from "./CardView"
import Card from "../../app/card"

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
  });

type HandViewProps = {
  hand: Array<Card>;
} & WithStyles<typeof styles>;

const HandView = ({ hand }: HandViewProps) => {

  return (
    <Grid container alignItems="center" justify="center" spacing={1}>
    <Grid item xs={12}>
    </Grid>
    {
      hand.map(card => {
        return <Grid item>
          <CardView
          card={card}
          key={card.index()}
          isEnabled={true}
          />
        </Grid>
      })
    }
    </Grid>
  );
};

export default withStyles(styles)(HandView);
