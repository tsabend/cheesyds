import React from "react";
import Typography from "@material-ui/core/Typography";
import VaultView from "./VaultView"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  GridList,
  GridListTile,
  useMediaQuery,
  useTheme
} from "@material-ui/core";
import { Player } from "../../app/player";

const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    upNextListRoot: {
      marginTop:"32px",
      verticalAlign: "bottom",
      overflowY: "hidden",
    },
    upNextList: {
      color: "black",
      overflowY: "hidden",
      paddingBottom: "100px",
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    upNextListItem: {
      margin: "0px 32px",
      backgroundColor: "lightGray",
      border: "1px black solid",
    },
    upNowListItem: {
      margin: "0px 32px",
      backgroundColor: "green",
      border: "1px black solid",
    },
  });

type UpNextViewProps = {
  upcomingPlayers: Player[];
} & WithStyles<typeof styles>;

const UpNextView = ({ classes, upcomingPlayers }: UpNextViewProps) => {
  const sm = useMediaQuery(useTheme().breakpoints.down('sm'));
  const xs = useMediaQuery(useTheme().breakpoints.down('xs'));

  const buildUpNextView = () => {
    var cols
    if (xs) {
      cols = 1.1
    }
    else if (sm) {
      cols = 2.1
    }
    else {
      cols = 3.1
    }
    return <div className={classes.upNextListRoot}>
    <GridList className={classes.upNextList} cellHeight={"auto"} cols={cols} spacing={0}>
    {upcomingPlayers.map((player, index) => {
      const makeHeader = (index: number) => {
        switch (index) {
          case 0:
          return player.name + " - Up Next";
          case 1:
          return player.name + " - In the Hole";
          default:
          return player.name;
        }
      }
      return <GridListTile className={classes.upNextListItem} cols={1}>
      children={<div >
        <Typography variant="h6">{makeHeader(index)}</Typography>
      <Typography>{player.numberOfCards()} cards in hand</Typography>
      <Typography>piles:</Typography>
      <VaultView
        vault={player.board.vault}
        cardWasTapped={() => {}}
        isSelected={() => { return false }}
        isEnabled={false}
        width={50}
      />
      </div>
    }
      </GridListTile>
    })}
    </GridList>
    </div>
  }

  return (
    <React.Fragment>
    {buildUpNextView()}
    </ React.Fragment>
  );
};

export default withStyles(styles)(UpNextView);
