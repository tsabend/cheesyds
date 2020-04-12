import React from "react";
import CardView from "./CardView"
import Card from "../../app/card"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  Box,
  Tooltip
} from "@material-ui/core";
import { PlayerBoard } from "../../app/player";

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

type VaultViewProps = {
  board: PlayerBoard;
  isEnabled: boolean;
  cardWasTapped: (card: Card) => void;
  isSelected: (card: Card) => boolean;
  width: number;
  showsHover: boolean;
} & WithStyles<typeof styles>;

const VaultView = ({ cardWasTapped, isSelected, board, width, isEnabled, showsHover, classes }: VaultViewProps) => {
  const canPlayFaceDown = isEnabled && board.faceUpVault.length === 0;

  const buildVault = () => {
    const vault = <Box className={classes.container}>
    {board.vault().map(pile => {

      if (pile[1]) {
        return <Box className={classes.stackContainer} key={pile.map(card => card.index()).join("_")}>
        <div className={classes.faceDown}>
        <CardView
        card={pile[0]}
        key={pile[0].index()}
        cardWasTapped={() => {}}
        isSelected={isSelected(pile[0])}
        isEnabled={canPlayFaceDown}
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
      if (pile[0]) {
        return <Box className={classes.stackContainer} key={pile.map(card => card.index()).join("_")}>
        <div className={classes.faceUp}>
        <CardView
        card={pile[0]}
        key={pile[0].index()}
        cardWasTapped={cardWasTapped}
        isSelected={isSelected(pile[0])}
        isEnabled={canPlayFaceDown}
        width={width}
        isFaceDown={true}
        />
        </div>
        </Box>
      }
      return "";
    })
  }
    </Box>
    if (!showsHover) return vault;
    return <Tooltip title={"Your Vault"} placement={"left"}>
    {vault}
    </Tooltip>

  }

  return (
    <React.Fragment>
    {buildVault()}
    </React.Fragment>
  );
};

export default withStyles(styles)(VaultView);
