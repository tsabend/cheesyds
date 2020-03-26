import React, { useState } from "react";
import {
  PairingProgress,
  selectPairingProgress
} from "./pairingSlice"
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

import { useSelector, useDispatch } from "react-redux";


const styles: (theme: Theme) => StyleRules<string> = theme =>
  createStyles({
  });

type PairingCoordinatorProps = {

} & WithStyles<typeof styles>;

const PairingCoordinator = ({ classes }: PairingCoordinatorProps) => {

  const progress: PairingProgress = useSelector(selectPairingProgress);
  const build = () => {
    switch (progress) {
      case PairingProgress.Landing:
        return <LandingView/>;
      case PairingProgress.Waiting:
        return <WaitingView isOwner={true} />
      case PairingProgress.Joining:
        return <WaitingView isOwner={false} />
      case PairingProgress.Loading:
        return "Loading...";
    }
  }

  return (
    <React.Fragment>
    {build()}
    </React.Fragment>
  );
};

export default withStyles(styles)(PairingCoordinator);
