import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import {
  Suit,
  FaceValue
} from "../../app/card";
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
    suit: {
      fontSize: "12px",
      fontFamily: "'Courier New', Courier, monospace"
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
  suit: string;
  faceValue: number;
} & WithStyles<typeof styles>;

const CardView = ({ suit, faceValue, classes }: CardViewProps) => {

  return (
    <React.Fragment>
    <Typography className={classes.suit} variant="body1">
      { FaceValue[faceValue] } of { suit }
    </Typography>
    </React.Fragment>
  );
};

export default withStyles(styles)(CardView);
