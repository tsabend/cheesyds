import React from "react";
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
  CircularProgress,
  Box,
} from "@material-ui/core";


const styles: (theme: Theme) => StyleRules<string> = _ =>
  createStyles({
    loadingView: {
       height: '24rem',
       display: "flex",
       margin: '0 auto',
       flexDirection: "column",
       justifyContent: "center"
    },
  });

type LoadingViewProps = {

} & WithStyles<typeof styles>;

const LoadingView = ({ classes }: LoadingViewProps) => {

  return (
    <Box className={classes.loadingView}>
    <CircularProgress className={classes.center} />
    </Box>
  );
};

export default withStyles(styles)(LoadingView);
