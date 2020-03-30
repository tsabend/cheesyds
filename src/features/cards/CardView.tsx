import React from "react";
import Button from "@material-ui/core/Button";

import {
  selectCard,
  selectTurn
} from "../../app/appSlice";
import Card from "../../app/card";
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,

} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import CardSVG from "./CardSVG";

const styles: (theme: Theme) => StyleRules<string> = _ =>
createStyles({
    suit: {
      fontSize: "12px",
      fontFamily: "'Courier New', Courier, monospace"
    },
    button: {
      padding: "0px",
    },
    card: {
      border: "2px transparent solid"
    },
    selected: {
      border: "2px red solid"
    },
  });

type CardViewProps = {
  card: Card;
  isEnabled: boolean;
  isFaceDown?: boolean;
  width?: number;
} & WithStyles<typeof styles>;

const CardView = ({ card, isEnabled, isFaceDown, width, classes }: CardViewProps) => {
  const dispatch = useDispatch();
  const turn = useSelector(selectTurn);
  const faceDown = isFaceDown || false;
  const enabled = faceDown ? false : isEnabled
  const cardName = faceDown ? "Red_Back" : card.svgName();
  const w = width || 100;
  return (
    <React.Fragment>
    <Button
     className={classes.button}
     onClick={() => {
         if (enabled) {
           dispatch(selectCard(card))
         }
       }
     }
     >
     <CardSVG
     className={[classes.card, turn.isSelected(card) ? classes.selected : ""].join(" ")}
     width={w}
     name={cardName} />
    </Button>
    </React.Fragment>
  );
};

export default withStyles(styles)(CardView);
