import React from "react";
import {
  selectAppProgress
} from "../../app/appSlice"
import {
  AppProgress,
} from "../../app/appState"

import LandingView from "./LandingView"
import LoadingView from "./LoadingView"
import WaitingView from "./WaitingView"
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress
} from "@material-ui/core";
import GameView from "../cards/GameView"
import { useSelector } from "react-redux";


const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
    pairingRoot: {
      padding: theme.spacing(18, 2),
    },
    center: {
      textAlign: "center",
    }
  });

type PairingCoordinatorProps = {

} & WithStyles<typeof styles>;

const PairingCoordinator = ({ classes }: PairingCoordinatorProps) => {

  const progress: AppProgress = useSelector(selectAppProgress);
  const build = () => {
    switch (progress) {
      case AppProgress.Landing:
        return <div className={classes.pairingRoot}><LandingView/></div>
      case AppProgress.Waiting:
        return <div className={classes.pairingRoot}><WaitingView isOwner={true} /></div>
      case AppProgress.Joining:
        return <div className={classes.pairingRoot}><WaitingView isOwner={false} /></div>
      case AppProgress.Loading:
        return <LoadingView />;
      case AppProgress.Rejoining:
        return <LoadingView />;
      case AppProgress.GameStarted:
        return <GameView />
    }
  }

  return (
    <React.Fragment>
    {build()}
    </React.Fragment>
  );
};

export default withStyles(styles)(PairingCoordinator);
