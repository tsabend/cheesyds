import React, { useState } from "react";

import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";


const styles: (theme: Theme) => StyleRules<string> = theme =>
createStyles({

});

type CardSVGProps = {
  className: string;
  width: number;
  name: string;
} & WithStyles<typeof styles>;

const CardSVG = ({ name, className, width, classes }: CardSVGProps) => {

  const src = (): string => {
    return require("cardsJS/cards/" + name + ".svg");
  }
  const aspectRatio = 4/3
  const widthStyle = width + 'px'
  const heightStyle = width * aspectRatio + 'px'
  return (
     <img className={className}
     style={{width: widthStyle, height: heightStyle}}
      src={src()}/>
  );
};

export default withStyles(styles)(CardSVG);
