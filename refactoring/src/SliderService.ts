// SliderService - Portiert aus legacy/web/slider.js

export class SliderService {
  private frames: Record<number, string> = {};
  private count = 0;
  private current = 0;

  /**
   * Dekodiert Slider-Code (z.B. "ab; cd,ef; abc,de")
   */
  decode(str: string): void {
    this.reset();
    
    const cleanStr = str.toUpperCase().replace(/\s/g, "").replace(/\n/g, "");
    const tokenList = cleanStr.split(";");

    for (let i = 0; i < tokenList.length; i++) {
      const subtokenList = tokenList[i].split(",");
      
      // Sortiere jeden Subtoken alphabetisch
      for (let j = 0; j < subtokenList.length; j++) {
        const tokenChars = subtokenList[j].split("").sort();
        subtokenList[j] = tokenChars.join("").replace(/\s/g, "");
      }
      
      subtokenList.sort();
      const code = subtokenList.join("_").replace(/\s/g, "");
      this.addFrame(code);
    }
  }

  /**
   * Fügt einen neuen Frame hinzu
   */
  addFrame(frameCode: string): void {
    this.frames[this.count] = frameCode;
    this.count++;
    this.current = this.count;
  }

  /**
   * Setzt den Slider zurück
   */
  reset(): void {
    this.frames = {};
    this.count = 0;
    this.current = 0;
  }

  /**
   * Holt Frame-Code nach Index
   */
  getNameFromIndex(index: number): string {
    return this.frames[index] || "";
  }

  /**
   * Geht zum nächsten Frame
   */
  getNextFrame(): string {
    if (this.current >= this.count - 1) {
      return "";
    }
    this.current++;
    return this.frames[this.current];
  }

  /**
   * Geht zum vorherigen Frame
   */
  getPreviousFrame(): string {
    if (this.current <= 0) {
      return "";
    }
    this.current--;
    return this.frames[this.current];
  }

  /**
   * Gibt aktuelle Frame-Anzahl zurück
   */
  getSize(): number {
    return this.count;
  }

  /**
   * Gibt aktuellen Frame-Index zurück
   */
  getCurrentIndex(): number {
    return this.current;
  }

  /**
   * Setzt aktuellen Frame-Index
   */
  setCurrentFrame(index: number): void {
    if (index >= 0 && index < this.count) {
      this.current = index;
    }
  }

  /**
   * Prüft ob nächster Frame verfügbar ist
   */
  hasNext(): boolean {
    return this.current < this.count - 1;
  }

  /**
   * Prüft ob vorheriger Frame verfügbar ist
   */
  hasPrevious(): boolean {
    return this.current > 0;
  }
}
