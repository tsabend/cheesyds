import { err, ok, Result } from "neverthrow";
import { v4 as generateUUID } from "uuid";
import { Session } from "./appState";
import { FBApp, fire } from "./fire";
import GameSnapshot from "./GameSnapshot";
import { Player } from "./player";
/// Token to dispose of observable
interface DisposeToken {
  (): void;
}

export class PairingController {
  fire: FBApp;
  token?: DisposeToken;
  constructor(fire: FBApp) {
    this.fire = fire;
  }

  makeUUID(): string {
    return generateUUID().slice(0, 4).toUpperCase();
  }

  // Open a brand new game
  openNewSession(
    playerName: string,
    observer: (result: Result<Session, Error>) => void,
  ) {
    const id = this.makeUUID();
    const args = {
      id,
      players: [playerName],
    };
    this.createGame(args, (result) => {
      // todo handle error
      observer(result);
    });
  };

  // Join an existing game
  // TODO: should only succeed if the existing game isn't yet started
  joinExistingSession(
    id: string,
    playerName: string,
    observer: (result: Result<Session, Error>) => void,
  ) {
    this.getGame(id, (result) => {
      if (result.isErr()) {
        observer(result);
        return;
      }
      result.map((value) => {
        if (value.game) {
          // if your joining a game you were already in,
          // make yourself human and then listen to changes
          const match = value.players.find(name => name === playerName)
          if (match) {
            const playingMatch = value.game.players.find(player => player.name === playerName)
            if (playingMatch?.isComputer) {
              this.markPlayerAsHuman(playerName, value);
            }
            this.subscribeToGame(id, observer)
            return value;
          }
          else {
            observer(err(new Error("Attempting to join a started game you were never in.")))
          }
        }
        // add yourself to the game.
        const newGame = {
          id,
          players: value.players.concat([playerName]),
        };
        this.updateGame(newGame);
        this.subscribeToGame(id, observer);
        return value;
      });
    });
  }

  writeSessionState(
    session: Session,
  ) {
    this.updateGame(session);
  }

  quit(playerName: string, game?: Session) {
    this.cancel()
    if (game) {
      this.markPlayerAsComputer(playerName, game);
    }
  }

  // stop listening to updates from the game
  cancel() {
    const token = this.token as DisposeToken;
    if (token) {
      token();
    }
  }

  private markPlayerAsHuman(playerName: string, session: Session) {
    const newPlayers = session.game?.players.map(player => {
      if (player.name === playerName) {
        return new Player(player.name, player.board, false);
      }
      else {
        return player.copy();
      }
    })
    fire.database()
    .ref("games/" + session.id + "/game/players")
    .set(replaceUndefined(newPlayers)).then(() => {
      fire.database()
      .ref("games/" + session.id + "/game/lastTurnSummary")
      .set(playerName + " rejoined the game. Welcome home " + playerName + ".");
    });
  }

  private markPlayerAsComputer(playerName: string, session: Session) {
    const newPlayers = session.game?.players.map(player => {
      if (player.name === playerName) {
        return new Player(player.name, player.board, true);
      }
      else {
        return player.copy();
      }
    })
    fire.database()
    .ref("games/" + session.id + "/game/players")
    .set(replaceUndefined(newPlayers)).then(() => {
      fire.database()
      .ref("games/" + session.id + "/game/lastTurnSummary")
      .set(playerName + " left the game. They will be replaced by a computer until they rejoin.")
    });
  }

  private createGame(action: Session, observer: (result: Result<Session, Error>) => void) {
    fire.database().ref("games").child(action.id).set({
      id: action.id,
      players: action.players,
    }).then(() => {
      this.subscribeToGame(action.id, observer);
    });
  }

  private updateGame(session: Session) {
    fire.database().ref("games/" + session.id).set(replaceUndefined(session));
  }

  private getGame(id: string, completion: (result: Result<Session, Error>) => void) {
    console.log("Querying fire db for game with id", id);
    fire.database()
    .ref("games")
    .child(id)
    .once("value", (snapshot) => completion(this.unpackSnapshot(snapshot)));
  }

  private subscribeToGame(id: string, observer: (result: Result<Session, Error>) => void) {
    console.log("Subscribing to fire db for game with id", id);

    const ref = fire.database()
    .ref("games")
    .child(id)
    .on("value", (snapshot) => observer(this.unpackSnapshot(snapshot)));
    // cancel any existing sub
    this.cancel();
    // set the cancellation token
    this.token = () => {
      this.dbRef().off("value", ref);
    };
  }

  private unpackSnapshot(snapshot: firebase.database.DataSnapshot): Result<Session, Error> {
    const sessionData = snapshot.val();
    if (!sessionData) return err(new Error("never found child"));
    return ok({
      id: sessionData.id,
      players: sessionData.players,
      game: GameSnapshot.from(sessionData.game),
    });
  }

  private dbRef(): firebase.database.Reference {
    return fire.database().ref("games");
  }
}

const replaceUndefined = (item: any) => {
   const str =  JSON.stringify(item, function (_, value) {return (value === undefined) ? null : value; });
   return JSON.parse(str);
};
