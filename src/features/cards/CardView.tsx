import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import {
  selectCard,
  selectTurn
} from "../../app/appSlice";
import {
  Suit,
  FaceValue,
  Card
} from "../../app/card";
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    suit: {
      fontSize: "12px",
      fontFamily: "'Courier New', Courier, monospace"
    },
    button: {
      border: "1px black solid"
    },
    selected: {
      border: "1px red solid"
    },
    faceValue: {
      color: "rgb(112, 76, 182)",
      appearance: "none",
      background: "none",
      fontSize: "calc(16px + 2vmin)",
      paddingLeft: "12px",
      paddingRight: "12px",
      paddingBottom: "4px",
      cursor: "pointer",
      backgroundColor: "rgba(112, 76, 182, 0.1)",
      borderRadius: "2px",
      transition: "all 0.15s",
      outline: "none",
      border: "2px solid transparent",
      textTransform: "none",
      "&:hover": {
        border: "2px solid rgba(112, 76, 182, 0.4)"
      },
      "&:focus": {
        border: "2px solid rgba(112, 76, 182, 0.4)"
      },
      "&:active": {
        backgroundColor: "rgba(112, 76, 182, 0.2)"
      }
    },
  });

type CardViewProps = {
  card: Card;
  isEnabled: boolean;
} & WithStyles<typeof styles>;

const CardView = ({ card, isEnabled, classes }: CardViewProps) => {
  const dispatch = useDispatch();
  const turn = useSelector(selectTurn);

  return (
    <Button
     className={[classes.button, turn.isSelected(card) ? classes.selected : ""].join(" ")}
     onClick={() => {
         if (isEnabled) {
           dispatch(selectCard(card))
         }
       }
     }
     >
    <Typography className={classes.suit} variant="body1">
      { FaceValue[card.faceValue] } of { card.suit }
    </Typography>
    </Button>
  );
};

export default withStyles(styles)(CardView);
