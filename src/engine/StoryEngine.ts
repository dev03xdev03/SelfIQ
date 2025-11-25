/**
 * Story Engine - Verwaltet die Story-Logik und Phasen-Übergänge
 */

import { detectGender, Gender } from '../utils/genderDetection';

export interface Choice {
  id: string;
  text: string;
  nextScene: string;
  animation?: string;
  requiresInventory?: boolean;
}

export interface Animation {
  type?: string;
  source: string;
  position: string;
}

export interface Character {
  name: string;
  sprite: string;
  animation?: string;
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
}

export interface StoryData {
  scenes: Record<string, Scene>;
  inventory: {
    maxSlots: number;
    items: any[];
  };
  playerData: {
    name: string;
    gender?: Gender;
    currentScene: string;
    visitedScenes: string[];
    choices: string[];
    wishesGranted: number;
  };
}

export class StoryEngine {
  private storyData: StoryData;
  private currentScene: Scene | null = null;

  constructor(storyData: StoryData) {
    this.storyData = storyData;
    // Detect gender from player name if not already set
    if (storyData.playerData.name && !storyData.playerData.gender) {
      this.storyData.playerData.gender = detectGender(
        storyData.playerData.name,
      );
    }
    this.loadScene(storyData.playerData.currentScene);
  }

  /**
   * Get player's detected gender
   */
  getPlayerGender(): Gender {
    return this.storyData.playerData.gender || 'neutral';
  }

  /**
   * Set player name and auto-detect gender
   */
  setPlayerName(name: string): void {
    this.storyData.playerData.name = name;
    this.storyData.playerData.gender = detectGender(name);
  }

  /**
   * Lädt eine Phase anhand ihrer ID
   */
  loadScene(sceneId: string): Scene | null {
    const scene = this.storyData.scenes[sceneId];
    if (!scene) {
      console.error(`Scene ${sceneId} not found`);
      return null;
    }

    this.currentScene = scene;

    // Phase zu besuchten Phasen hinzufügen
    if (!this.storyData.playerData.visitedScenes.includes(sceneId)) {
      this.storyData.playerData.visitedScenes.push(sceneId);
    }

    this.storyData.playerData.currentScene = sceneId;

    return scene;
  }

  /**
   * Verarbeitet eine Wahl des Spielers
   */
  makeChoice(choiceId: string): Scene | null {
    if (!this.currentScene) {
      console.error('No current scene loaded');
      return null;
    }

    const choice = this.currentScene.choices.find((c) => c.id === choiceId);
    if (!choice) {
      console.error(`Choice ${choiceId} not found in current scene`);
      return null;
    }

    // Prüfe Inventar-Anforderungen
    if (
      choice.requiresInventory &&
      this.storyData.inventory.items.length === 0
    ) {
      console.warn('Choice requires inventory item');
      return null;
    }

    // Speichere die Wahl
    this.storyData.playerData.choices.push(choiceId);

    // Lade nächste Phase
    return this.loadScene(choice.nextScene);
  }

  /**
   * Gibt die aktuelle Phase zurück
   */
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Gibt die Story-Daten zurück
   */
  getStoryData(): StoryData {
    return this.storyData;
  }

  /**
   * Fügt ein Item zum Inventar hinzu
   */
  addInventoryItem(item: any): boolean {
    if (
      this.storyData.inventory.items.length >= this.storyData.inventory.maxSlots
    ) {
      console.warn('Inventory full');
      return false;
    }
    this.storyData.inventory.items.push(item);
    return true;
  }

  /**
   * Entfernt ein Item aus dem Inventar
   */
  removeInventoryItem(itemId: string): boolean {
    const index = this.storyData.inventory.items.findIndex(
      (i) => i.id === itemId,
    );
    if (index === -1) {
      return false;
    }
    this.storyData.inventory.items.splice(index, 1);
    return true;
  }

  /**
   * Prüft ob eine Phase bereits besucht wurde
   */
  hasVisitedScene(sceneId: string): boolean {
    return this.storyData.playerData.visitedScenes.includes(sceneId);
  }

  /**
   * Speichert den aktuellen Progress
   */
  saveProgress(): string {
    return JSON.stringify(this.storyData);
  }

  /**
   * Lädt gespeicherten Progress
   */
  loadProgress(saveData: string): void {
    try {
      this.storyData = JSON.parse(saveData);
      this.loadScene(this.storyData.playerData.currentScene);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  }
}
