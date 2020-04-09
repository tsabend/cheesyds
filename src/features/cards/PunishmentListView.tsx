import React from "react";
import Typography from "@material-ui/core/Typography";
import {
  withStyles,
  Theme,
  StyleRules,
  createStyles,
  WithStyles,
} from "@material-ui/core";

const styles: (theme: Theme) => StyleRules<string> = _ => createStyles({});

type PunishmentListViewProps = {
  punishments: string[];
} & WithStyles<typeof styles>;

const PunishmentListView = ({ punishments }: PunishmentListViewProps) => {

  const punishmentList = () => {
    if (punishments.length === 0) return "";
    return <div>
    <Typography variant={"h3"}>Punishments</Typography>
    <ul>
    {punishments.map(punishment => {
      return <li>
      <p>{punishment}</p>
      </li>
    })}
    </ul>
    </div>
  }

  return (
    <React.Fragment>
    {punishmentList()}
    </React.Fragment>
  );
};

export default withStyles(styles)(PunishmentListView);
