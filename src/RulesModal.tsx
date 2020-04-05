import React from "react";

import {
  withStyles,
  createStyles,
  Theme,
  WithStyles,
  StyleRules
} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Slide from "@material-ui/core/Slide";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CancelIcon from '@material-ui/icons/Cancel';
import AppBar from "@material-ui/core/AppBar";

const styles: (theme: Theme) => StyleRules<string> = _ =>
createStyles({
  spacer: {
    flex: 1,
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type RulesModalProps = {
  open: boolean;
  onClose: () => void;
} & WithStyles<typeof styles>;

const RulesModal = ({ open, onClose, classes }: RulesModalProps) => {
  return (<div>
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition as any}>
    <AppBar position={'sticky'}>
    <Toolbar>
    <Typography variant={'h6'}>Rules</Typography>
    <div className={classes.spacer}></div>
    <IconButton
    edge="start"
    color="inherit"
    aria-label="menu"
    onClick={() => { onClose(); }}
    >
    <CancelIcon />
    </IconButton>
    </Toolbar>
    </AppBar>
    <List>
    <ListItem >
    <ListItemText primary='Goal' secondary='Get rid of all your cards. It is in the same family as Uno.'/>
    </ListItem>
    <Divider />
    <ListItem >
    <ListItemText primary='Set Up' secondary='Each player is dealt 9 cards: 3 in hand, 3 face down, 3 face up.'/>
    </ListItem>
    <Divider />
    <ListItem >
    <ListItemText primary='Game Play' secondary={`Players take turns rotating clockwise. On a player\'s turn, they play cards and then draw until they have at least 3 cards in their hand. If the player has no legal moves (or if they decide it's strategically adventageous), they pick up the pile of in play cards. When there are no more cards to draw, a player's hand is empty, they play from their piles. When their piles and hand are both empty, they are out. The first person out is the winner and will pick a punishment for the loser (the last person remaining).`}/>
    </ListItem>
    <Divider />
    <ListItem>
    <ListItemText primary='What Cards Can You Play?' secondary='You can play anything if there are no cards in play. Otherwise, you need to play a card whose face value (i.e 2, 3, Jack) is higher than the last played card. Aces are high. Additionally, the following cards have special rules.'/>
    </ListItem>
    <ListItem>
    <ListItemText primary='10 and 2 - wild' secondary='10s and 2s are both wild and can be played on a card of any value. If a 10 is played, the in play pile is cleared and removed from the game. Whenever the pile is cleared, the player who cleared it goes again.'/>
    </ListItem>
    <ListItem>
    <ListItemText primary='7 - invert' secondary='When a 7 is played, the next player must play a card lower than a 7 (or a wild).'/>
    </ListItem>
    <ListItem>
    <ListItemText primary='8 - skip' secondary='8 skips the next player.'/>
    </ListItem>
    <ListItem>
    <ListItemText primary='Playing Multiple Cards At Once' secondary='You may play as many cards of the same face value (i.e 2, 3, Jack) at a time as you want. If the card has special effects, they will all be applied (i.e 3 8s skips 3 times).'/>
    </ListItem>
    <ListItem>
    <ListItemText primary='Four or More of a Kind' secondary='If you play 4 or more of a kind at once, it clears the board.'/>
    </ListItem>
    <ListItem>
    <ListItemText primary={`The Devil's Hand`} secondary='If a player plays 3 (or more) 6s at once, the next player has to pick up the in play pile and their turn is skipped.'/>
    </ListItem>
    <Divider />
    <ListItem>
    <ListItemText primary='Punishment' secondary='If you bring the shame of loss upon yourself, you will receive your just deserts by the hands of the winner.'/>
    </ListItem>
    </List>
    </Dialog>
    </div>
  );
}

export default withStyles(styles)(RulesModal);
