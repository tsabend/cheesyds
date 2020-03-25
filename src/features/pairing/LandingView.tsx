import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import FormGroup from "@material-ui/core/FormGroup";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

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

type LandingViewProps = {

} & WithStyles<typeof styles>;

const LandingView = ({ classes }: LandingViewProps) => {

  return (
    <React.Fragment>
    <Grid container alignItems="center" justify="center" spacing={4}>
    <Grid item>
    <Button onClick={(e) => {
      console.log("WHABAM")
      }
    }>
    Start New Landing
    </Button>
    </Grid>
    <Grid item>
    <FormControl>
      <InputLabel htmlFor="my-input">Landing Code</InputLabel>
      <Input id="my-input" aria-describedby="my-helper-text" />
      <FormHelperText id="my-helper-text">Enter code above</FormHelperText>
      <Button type="submit" onClick={ (e) => {
        console.log(e.target)
      }}>Join</Button>
    </FormControl>
    </Grid>
    </Grid>
    </React.Fragment>
  );
};

export default withStyles(styles)(LandingView);
