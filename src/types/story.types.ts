/**
 * TypeScript Type Definitions für Story-Daten
 * Import diese Types in deinen Komponenten
 */

export type AnimationType = 'lottie' | 'video';
export type AnimationPosition =
  | 'overlay'
  | 'background'
  | 'character'
  | 'center';

export interface Animation {
  type: AnimationType;
  source: string;
  position: AnimationPosition;
  loop?: boolean;
  autoPlay?: boolean;
  speed?: number;
}

export interface Character {
  name: string;
  sprite: string;
  animation?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextScene: string;
  animation?: string;
  requiresInventory?: boolean;
  condition?: string;
}

export interface Scene {
  id: string;
  title: string;
  background: string;
  animations?: Animation[];
  character?: Character;
  text: string;
  sound?: string;
  choices: Choice[];
  onEnter?: string; // Event beim Betreten der Phase
  onExit?: string; // Event beim Verlassen der Phase
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  usable?: boolean;
}

export interface PlayerData {
  name: string;
  currentScene: string;
  visitedScenes: string[];
  choices: string[];
  wishesGranted: number;
  stats?: Record<string, number>;
}

export interface Inventory {
  maxSlots: number;
  items: InventoryItem[];
}

export interface StoryData {
  scenes: Record<string, Scene>;
  inventory: Inventory;
  playerData: PlayerData;
  metadata?: {
    version: string;
    title: string;
    author: string;
    description: string;
  };
}

/**
 * Events die in der Story getriggert werden können
 */
export enum StoryEvent {
  SCENE_ENTER = 'scene_enter',
  SCENE_EXIT = 'scene_exit',
  CHOICE_MADE = 'choice_made',
  ITEM_COLLECTED = 'item_collected',
  ITEM_USED = 'item_used',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
}

/**
 * Sound Types
 */
export enum SoundType {
  BACKGROUND = 'background',
  EFFECT = 'effect',
  VOICE = 'voice',
}

export interface Sound {
  name: string;
  type: SoundType;
  file: string;
  loop?: boolean;
  volume?: number;
}
