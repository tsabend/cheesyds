import React from "react";
import CardView from "./CardView"
import Card from "../../app/card"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box
} from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    faceDown: {
      marginTop: "-8px",
      marginLeft: "-8px",
      position: 'absolute',
    },
    faceUp: {
      position: 'absolute',
    },
    stackContainer: {
      position: 'relative',
      height: '100px',
      width: '60px',
      padding: '8px 44px',
      display: 'table-cell',
    },
    container: {
      width: '312px',
      margin: '0 auto',
      position: 'relative',
    },

  });

type PilesViewProps = {
  piles: Array<Array<Card>>;
  isEnabled: boolean;
  cardWasTapped: (card: Card) => void;
  isSelected: (card: Card) => boolean;
  width: number;
} & WithStyles<typeof styles>;

const PilesView = ({ cardWasTapped, isSelected, piles, width, isEnabled, classes }: PilesViewProps) => {

  return (
    <Box className={classes.container}>
    {piles.map(pile => {
        if (pile.length === 1) {
          return <Box className={classes.stackContainer}>
          <div className={classes.faceUp}>
          <CardView
          card={pile[0]}
          key={pile[0].index()}
          cardWasTapped={cardWasTapped}
          isSelected={isSelected(pile[0])}
          isEnabled={isEnabled}
          width={width}
          />
          </div>
          </Box>
        }
        if (pile.length === 2) {
          return <Box className={classes.stackContainer}>
          <div className={classes.faceDown}>
          <CardView
          card={pile[0]}
          key={pile[0].index()}
          cardWasTapped={cardWasTapped}
          isSelected={isSelected(pile[0])}
          isEnabled={isEnabled}
          width={width}
          isFaceDown={true}
          />
          </div>
          <div className={classes.faceUp}>
          <CardView
          card={pile[1]}
          key={pile[1].index()}
          cardWasTapped={cardWasTapped}
          isSelected={isSelected(pile[1])}
          isEnabled={isEnabled}
          width={width}
          />
          </div>
          </Box>
        }
        return "";
    })
    }
    </Box>
  );
};

export default withStyles(styles)(PilesView);
