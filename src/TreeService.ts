// TreeService - Portiert aus legacy/web/tree.js

export class TreeNodeImpl {
  label = "";
  left: TreeNodeImpl | null = null;
  right: TreeNodeImpl | null = null;
  root: TreeNodeImpl | null = null;

  constructor(tree: TreeService, root?: TreeNodeImpl) {
    this.root = root || null;
    tree.setCurrentNode(this);
  }

  getRoot(): TreeNodeImpl | null {
    return this.root;
  }

  setRight(node: TreeNodeImpl): void {
    this.right = node;
  }

  setLeft(node: TreeNodeImpl): void {
    this.left = node;
  }

  getRight(): TreeNodeImpl | null {
    return this.right;
  }

  getLeft(): TreeNodeImpl | null {
    return this.left;
  }

  setLabel(label: string): void {
    this.label = label;
  }

  getLabel(): string {
    return this.label;
  }
}

export class TreeService {
  private count = 0;
  private current: TreeNodeImpl;
  private root: TreeNodeImpl;
  private maxLevel = 0;
  private levelNames: Record<number, string[]> = {};

  constructor() {
    this.root = new TreeNodeImpl(this);
    this.current = this.root;
  }

  increment(): void {
    this.count++;
  }

  getCurrentNode(): TreeNodeImpl {
    return this.current;
  }

  getRoot(): TreeNodeImpl {
    return this.root;
  }

  setCurrentNode(node: TreeNodeImpl): void {
    this.current = node;
  }

  getSize(): number {
    return this.count;
  }

  getMaxLevel(): number {
    return this.maxLevel;
  }

  /**
   * Dekodiert Tree-Code (z.B. "((A,B),C)")
   */
  decode(str: string): TreeNodeImpl {
    const cleanStr = str.toUpperCase();
    const originalAllSetsNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    const dict = [',', ')', '('].concat(originalAllSetsNames);

    this.reset();

    for (let i = 0; i < cleanStr.length; i++) {
      const token = cleanStr[i];
      
      if (!dict.includes(token)) {
        throw new Error(`Invalid token: ${token}`);
      }

      const lastNode = this.getCurrentNode();

      switch (token) {
        case '(':
          this.getCurrentNode().setLeft(new TreeNodeImpl(this, lastNode));
          this.count++;
          break;

        case ')':
          this.setCurrentNode(this.getCurrentNode().getRoot()!);
          const name = this.getCurrentNode().getLeft()!.getLabel() + 
                      this.getCurrentNode().getRight()!.getLabel();
          this.getCurrentNode().setLabel(name);
          break;

        case ',':
          const root = this.getCurrentNode().getRoot()!;
          this.setCurrentNode(root);
          root.setRight(new TreeNodeImpl(this, root));
          this.count++;
          break;

        default:
          this.getCurrentNode().setLabel(token);
          break;
      }
    }

    this.levelsSearch();
    return this.root;
  }

  /**
   * Durchsucht Level der Baumstruktur
   */
  levelsSearch(): void {
    let C = [this.getRoot()];
    let count = 0;
    let level = 0;
    let F = C;

    while (count < this.getSize()) {
      C = F;
      F = [];
      const labels: string[] = [];

      for (const node of C) {
        if (node.getRight()) {
          F.push(node.getRight()!);
        }
        if (node.getLeft()) {
          F.push(node.getLeft()!);
        }

        labels.push(node.getLabel());
        count++;
      }

      this.levelNames[level] = labels;
      level++;
      this.maxLevel = level;
    }
    this.maxLevel--;
  }

  /**
   * Holt Namen vom Level (invertiert für UI)
   */
  getNameFromLevel(level: number): string {
    const invertedLevel = this.maxLevel - level;

    if (invertedLevel === this.maxLevel) {
      return "";
    }

    const list: string[] = [];
    const names = this.levelNames[invertedLevel] || [];

    for (const name of names) {
      if (name.length > 1) {
        const sortedName = name.split("").sort().join("");
        list.push(sortedName);
      }
    }

    list.sort();
    return list.length > 0 ? "_" + list.join("_") : "";
  }

  /**
   * Setzt Tree zurück
   */
  private reset(): void {
    this.count = 0;
    this.maxLevel = 0;
    this.levelNames = {};
    this.root = new TreeNodeImpl(this);
    this.current = this.root;
  }
}
