export type GameState = 'start' | 'instructions' | 'waiting' | 'playing' | 'result';

export type Player = {
  id: string;
  name: string;
  character?: string;
};

export type Character = {
  id: string;
  name: string;
  emoji: string;
  description: string;
};

export type GameResult = {
  date: string;
  times: number[];
};

export type TabType = 'solo' | 'party';

