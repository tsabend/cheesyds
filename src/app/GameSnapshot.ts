import {
  Card,
  FaceValue,
  getRule,
  Rule,
  Suit,
} from "./card";
import { Player } from "./player";
import { Turn } from "./turn";
import { Deck } from "./deck"

export default class GameSnapshot {
  players: Player[];
  deck: Deck;
  currentPlayerIndex: number;
  inPlayPile: Card[];
  isInReverse: boolean;
  winner?: Player;

  static from(data: any): GameSnapshot {
    debugger;
    const players = data.players.map((playerData: any) => Player.from(playerData));
    const deck = Deck.from(data.deck);
    const rawInPlayPile = data.inPlayPile;
    const inPlayPile = rawInPlayPile ? rawInPlayPile.map((cardData: any) => Card.from(cardData)) : [];
    const currentPlayerIndex = data.currentPlayerIndex;
    const isInReverse = data.isInReverse;
    const winner = data.winner;
    return new GameSnapshot(
      players,
      deck,
      inPlayPile,
      currentPlayerIndex,
      isInReverse,
      winner,
    );
  }

  constructor(players: Player[],
              deck: Deck,
              inPlayPile: Card[],
              currentPlayerIndex: number,
              isInReverse: boolean,
              winner?: Player,
            ) {
    this.players = players;
    this.deck = deck;
    this.inPlayPile = inPlayPile;
    this.currentPlayerIndex = currentPlayerIndex;
    this.isInReverse = isInReverse;
    this.winner = winner;
  }

  copy(): GameSnapshot {
    return new GameSnapshot(
      Array.from(this.players.map((player) => player.copy())),
      this.deck.copy(),
      Array.from(this.inPlayPile),
      this.currentPlayerIndex,
      this.isInReverse,
      this.winner,
    );
  }

  isOver(): boolean {
    return this.players.length === 1;
  }

  loser(): Player | undefined {
    if (this.isOver()) {
      return this.players[0];
    }
    return undefined;
  }

  upcomingPlayers(): Player[] {
    let out: Player[] = [];
    for (let i = 1; i < this.players.length; i++) {
        const p = this.players[this.playerIndexSkipping(i)];
        out.push(p);
    }
    return out;
  }

  nextPlayerIndex(): number {
    return this.playerIndexSkipping(1);
  }

  playerIndexSkipping(n: number): number {
    return (this.currentPlayerIndex + n) % this.players.length;
  }

  currentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  nextPlayer(): Player {
    return this.players[this.nextPlayerIndex()];
  }

  topOfInPlayPile(): Card | undefined {
    if (this.inPlayPile.length > 0) {
      return this.inPlayPile[this.inPlayPile.length - 1];
    }
    return undefined;
  }

  isCurrentPlayer(player: Player): boolean {
    return this.players[this.currentPlayerIndex] === player;
  }

  finishTurn(moveForwardsBy: number) {
    debugger;
    const currentPlayer = this.currentPlayer();
    if (currentPlayer.isOut()) {
      this.players = this.players.filter((player) => player !== currentPlayer);
      if (!this.winner) {
        this.winner = currentPlayer;
      }
    }
    else {
      this.currentPlayerIndex = this.playerIndexSkipping(moveForwardsBy);
    }
  }
}
