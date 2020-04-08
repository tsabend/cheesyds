import Card from "./card";
import { Deck } from "./deck";
import { Player } from "./player";

export default class GameSnapshot {
  players: Player[];
  deck: Deck;
  currentPlayerIndex: number;
  inPlayPile: Card[];
  punishments: string[];
  lastTurnSummary?: string;
  winner?: Player;

  static from(data: any): GameSnapshot {
    const players = data.players.map((playerData: any) => Player.from(playerData));
    const deck = Deck.from(data.deck);
    const rawInPlayPile = data.inPlayPile;
    const inPlayPile = rawInPlayPile ? rawInPlayPile.map((cardData: any) => Card.from(cardData)) : [];
    const currentPlayerIndex = data.currentPlayerIndex;
    const punishments = data.punishments || [];
    const lastTurnSummary = data.lastTurnSummary;
    const winner = data.winner;
    return new GameSnapshot(
      players,
      deck,
      inPlayPile,
      currentPlayerIndex,
      punishments,
      lastTurnSummary,
      winner,
    );
  }

  constructor(players: Player[],
              deck: Deck,
              inPlayPile: Card[],
              currentPlayerIndex: number,
              punishments: string[],
              lastTurnSummary?: string,
              winner?: Player,
            ) {
    this.players = players;
    this.deck = deck;
    this.inPlayPile = inPlayPile;
    this.currentPlayerIndex = currentPlayerIndex;
    this.punishments = punishments;
    this.lastTurnSummary = lastTurnSummary;
    this.winner = winner;
  }

  copy(): GameSnapshot {
    return new GameSnapshot(
      Array.from(this.players.map((player) => player.copy())),
      this.deck.copy(),
      Array.from(this.inPlayPile),
      this.currentPlayerIndex,
      this.punishments,
      this.lastTurnSummary,
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
    const currentPlayer = this.currentPlayer();
    if (currentPlayer.isOut()) {
      this.players = this.players.filter((player) => player !== currentPlayer);
      if (!this.winner) {
        this.winner = currentPlayer;
      }
      // typically if we're out we don't increment currentPlayerIndex because
      // the next player will be moved back an index position by the filter
      // but we need to go back to 0 if the last player in the array goes out
      if (this.currentPlayerIndex === this.players.length) this.currentPlayerIndex = 0;
    }
    else {
      this.currentPlayerIndex = this.playerIndexSkipping(moveForwardsBy);
    }
    if (this.currentPlayer() === undefined) {
      debugger;
    }
  }
}
