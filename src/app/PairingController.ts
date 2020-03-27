import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";
import { v4 as generateUUID } from "uuid";
import { AppThunk, RootState } from './store';
import { fire, FBApp } from './fire';
import { Result, ok, Ok, err, Err } from "neverthrow";
import { GameSnapshot } from "./game"
import { RemoteGameState } from "./appState"

/// Token to dispose of observable
interface DisposeToken {
  (): void
}

export class PairingController {
  fire: FBApp
  token?: DisposeToken
  constructor(fire: FBApp) {
    this.fire = fire
  }

  makeUUID(): string {
    return generateUUID().slice(0,4).toUpperCase();
  }

  // Open a brand new game
  openNewSession(
    playerName: string,
    observer: (result: Result<RemoteGameState, Error>) => void
  ) {
    const gameId = this.makeUUID();
    const args = {
      gameId: gameId,
      players: [playerName],
      fbGameId: undefined
    }
    this.createGame(args, (result) => {
      // todo handle error
      observer(result)
    });
  };

  // Join an existing game
  // TODO: should only succeed if the existing game isn't yet started
  joinExistingSession(
    gameId: string,
    playerName: string,
    observer: (result: Result<RemoteGameState, Error>) => void
  ) {
    this.getGame(gameId, (result) => {
      // todo handle error
      result.map(value => {
        const newGame = {
          gameId: gameId,
          fbGameId: value.fbGameId,
          players: value.players.concat([playerName])
        }
        this.updateGame(newGame)
        this.subscribeToGame(gameId, observer);
      });
    });
  }

  writeGameState(
    game: RemoteGameState
  ) {
    this.updateGame(game);
  }

  // stop listening to updates from the game
  cancel() {
    const token = this.token as DisposeToken
    if (token) {
      token();
    }
  }

  private createGame(action: RemoteGameState, observer: (result: Result<RemoteGameState, Error>) => void) {
    fire.database().ref('games').push({
      gameId: action.gameId,
      players: action.players
    }).then(() => {
      this.subscribeToGame(action.gameId, observer);
    });
  }

  private updateGame(newGame: RemoteGameState) {
    fire.database().ref('games/' + newGame.fbGameId).set(replaceUndefined(newGame));
  }

  private getGame(gameId: string, completion: (result: Result<RemoteGameState, Error>) => void) {
    console.log("Querying fire db for game with id", gameId);
    const ref = this.buildQuery(gameId)
    .once("value", snapshot => completion(this.unpackSnapshot(snapshot)));
  }

  private subscribeToGame(gameId: string, observer: (result: Result<RemoteGameState, Error>) => void) {
    console.log("Subscribing to fire db for game with id", gameId);
    const ref = this.buildQuery(gameId)
    .on("value", snapshot => observer(this.unpackSnapshot(snapshot)));
    // cancel any existing sub
    this.cancel();
    // set the cancellation token
    this.token = () => {
      this.dbRef().off("value", ref);
    }
  }

  private unpackSnapshot(snapshot: firebase.database.DataSnapshot): Result<RemoteGameState, Error> {
    if (snapshot.numChildren() > 1) return err(new Error("too many games. should be 1."));
    var out: Result<RemoteGameState, Error> = err(new Error("never found child"))
    snapshot.forEach((child) => {
      const key = child.key as string;
      if (!key) out = err(new Error("failed to get key"));
      const gameData = child.val().game
      var game
      if (gameData) {
        game = GameSnapshot.from(gameData);
      }
      console.log("parsed", game, "from", gameData)
      out = ok({
        gameId: child.val().gameId,
        players: child.val().players,
        game: game,
        fbGameId: key,
      })
    });
    console.log("unpacking response", out);
    return out;
  }

  private dbRef(): firebase.database.Reference {
    return fire.database().ref('games')
  }

  private buildQuery(gameId: string): firebase.database.Query {
    return this.dbRef()
      .orderByChild("gameId")
      .equalTo(gameId)
      .limitToLast(1)
  }
}

const replaceUndefined = (item: any) => {
   const str =  JSON.stringify(item, function (key, value) {return (value === undefined) ? null : value});
   return JSON.parse(str);
}
