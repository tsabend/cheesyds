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
    ace_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -2px -1px",
   },
    two_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -75px -1px",
    },
    three_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -148px -1px",
    },
    four_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -220px -1px",
    },
    five_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -294px -1px",
    },
    six_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -366px -1px",
    },
    seven_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -440px -1px",
    },
    eight_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -512px -1px",
    },
    nine_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -586px -1px",
    },
    ten_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -658px -1px",
    },
    jack_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -732px -1px",
    },
    queen_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -804px -1px",
    },
    king_clubs: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -878px -1px",
    },
    ace_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -2px -99px",
    },
    two_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -75px -99px",
    },
    three_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -148px -99px",
    },
    four_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -220px -99px",
    },
    five_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -294px -99px",
    },
    six_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -366px -99px",
    },
    seven_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -440px -99px",
    },
    eight_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -512px -99px",
    },
    nine_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -586px -99px",
    },
    ten_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -658px -99px",
    },
    jack_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -732px -99px",
    },
    queen_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -804px -99px",
    },
    king_hearts: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -878px -99px",
    },
    ace_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -2px -197px",
    },
    two_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -75px -197px",
    },
    three_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -148px -197px",
    },
    four_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -220px -197px",
    },
    five_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -294px -197px",
    },
    six_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -366px -197px",
    },
    seven_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -440px -197px",
    },
    eight_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -512px -197px",
    },
    nine_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -586px -197px",
    },
    ten_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -658px -197px",
    },
    jack_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -732px -197px",
    },
    queen_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -804px -197px",
    },
    king_spades: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -878px -197px",
    },
    ace_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -2px -295px",
    },
    two_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -75px -295px",
    },
    three_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -148px -295px",
    },
    four_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -220px -295px",
    },
    five_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -294px -295px",
    },
    six_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -366px -295px",
    },
    seven_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -440px -295px",
    },
    eight_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -512px -295px",
    },
    nine_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -586px -295px",
    },
    ten_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -658px -295px",
    },
    jack_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -732px -295px",
    },
    queen_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -804px -295px",
    },
    king_diamonds: {
     width: "71px",
     height: "97px",
     background: "url(http://dobsondev.com/wp-content/uploads/2015/04/windows-playing-cards.png) -878px -295px",
    },
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
    <React.Fragment>
    <Button
     className={[classes.button, turn.isSelected(card) ? classes.selected : ""].join(" ")}
     onClick={() => {
         if (isEnabled) {
           dispatch(selectCard(card))
         }
       }
     }
     >
     <div className={classes[card.className()]}></div>
    </Button>
    </React.Fragment>
  );
};

export default withStyles(styles)(CardView);
