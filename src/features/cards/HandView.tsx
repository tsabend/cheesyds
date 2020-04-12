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
  Tooltip,
} from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
  });

type HandViewProps = {
  hand: Array<Card>;
  isSelected: (card: Card) => boolean;
  cardWasTapped: (card: Card) => void;
} & WithStyles<typeof styles>;

const HandView = ({ isSelected, cardWasTapped, hand }: HandViewProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <span
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}
    >
    <Grid container alignItems="center" justify="center" spacing={1}>
    {
      hand.map((card, idx) => {
        const cardView = <Grid item>
          <CardView
          card={card}
          cardWasTapped={cardWasTapped}
          isSelected={isSelected(card)}
          key={card.index()}
          isEnabled={true}

          />
        </Grid>
          if (idx === 0) {
            return <Tooltip title="Your Hand" placement="left" open={open} arrow>
            {cardView}
            </Tooltip>
          }
          return cardView;
      })
    }
    </Grid>
    </span>
  );
};

export default withStyles(styles)(HandView);
