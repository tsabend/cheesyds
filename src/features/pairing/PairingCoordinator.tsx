import React, { useState } from "react";
import {
  selectAppProgress
} from "../../app/appSlice"
import {
  AppProgress,
} from "../../app/appState"
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import LandingView from "./LandingView"
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
import { useSelector, useDispatch } from "react-redux";


const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
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
        return <LandingView/>;
      case AppProgress.Waiting:
        return <WaitingView isOwner={true} />
      case AppProgress.Joining:
        return <WaitingView isOwner={false} />
      case AppProgress.Loading:
        return <div style={{position: 'relative'}}>
        <CircularProgress className={classes.center} />
        </div>;
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
