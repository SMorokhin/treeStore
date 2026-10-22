type TreeId = string | number;

interface TreeItem {
  id: Readonly<TreeId>;
  parent: TreeId | null;
  label: string;
  children: TreeItem[];
}

type RawTreeItem = Omit<TreeItem, "children">;

type Tree = Record<TreeId, TreeItem>;

function buildTree(items: RawTreeItem[]): Tree {
  const nodes: Tree = {};

  for (const item of items) {
    nodes[item.id] = { ...item, children: [] };
  }

  const tree: Tree = {};

  for (const item of items) {
    const node = nodes[item.id];

    if (!node) {
      continue;
    }

    const parent = item.parent === null ? undefined : nodes[item.parent];

    if (parent && parent !== node) {
      parent.children.push(node);
      continue;
    }

    tree[node.id] = node;
  }

  return tree;
}

function findItem(id: TreeId, tree: Tree): TreeItem | undefined {
  const stack = Object.values(structuredClone(tree));

  while (stack.length > 0) {
    const current = stack.pop();

    if (current && String(current.id) === String(id)) {
      return current;
    }

    const { children } = current;

    if (children && Array.isArray(children)) {
      for (let i = children.length - 1; i >= 0; i--) {
        const node = children[i];

        if (node && String(node.id) === String(id)) {
          return node;
        }

        stack.push(node);
      }
    }
  }
}

// TODO: по-хорошему не хранить раздвоенное состояние (tree и rawItems), а оперировать только с деревом. Добавить метод для разоврачивания дерева в плоский список
export class TreeStore {
  private tree: Tree = {};
  private rawItems: RawTreeItem[] = [];

  constructor(data: RawTreeItem[]) {
    this.setItems(data);
  }

  getAll(): RawTreeItem[] {
    return this.rawItems;
  }

  getItem(id: string): RawTreeItem | undefined {
    const target = findItem(id, this.tree);

    if (target) {
      const { children, ...rest } = target;
      return rest;
    } else {
      return undefined;
    }
  }

  getChildren(id: string): RawTreeItem[] {
    const target = findItem(id, this.tree);

    if (target && target.children) {
      return target.children.map((child) => {
        const { children, ...rest } = child;
        return rest;
      });
    }

    return [];
  }

  getAllChildren(id: string): RawTreeItem[] {
    const result = [];
    const target = findItem(id, this.tree);

    if (target && target.children) {
      const node = structuredClone(target);
      const stack = node.children;

      while (stack.length > 0) {
        const current = stack.pop();
        const { children, ...item } = current ?? {};

        result.push(item);

        if (children) {
          for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
          }
        }
      }
    }

    return result;
  }

  getAllParents(id: string): RawTreeItem[] {
    const target = findItem(id, this.tree);
    const result: RawTreeItem[] = [];

    if (target) {
      let { children, ...current } = target;
      const rawItemsMap = this.rawItems.reduce<Record<TreeId, RawTreeItem>>(
        (acc, el) => {
          acc[el.id] = el;
          return acc;
        },
        {},
      );

      while (current) {
        result.push(current);
        current = rawItemsMap[current.parent];
      }
    }

    return result;
  }

  setItems(data: RawTreeItem[]): void {
    this.rawItems = data;

    this.tree = buildTree(data);
  }

  addItem(item: RawTreeItem): void {
    this.setItems([...this.rawItems, item]);
  }

  removeItem(id: TreeId): void {
    const target = findItem(id, this.tree);

    if (target) {
      const removableIdxMap = {
        [target.id]: target.id,
      };

      const stack = target.children;

      while (stack.length > 0) {
        const current = stack.pop();

        if (current) {
          removableIdxMap[current?.id] = current.id;

          if (current.children) {
            for (let i = current.children.length - 1; i >= 0; i--) {
              stack.push(current.children[i]);
            }
          }
        }
      }

      this.setItems(this.rawItems.filter((item) => !removableIdxMap[item.id]));
    }
  }

  updateItem(item: RawTreeItem): void {
    const targetId = this.rawItems.findIndex(
      (value) => String(value.id) === String(item.id),
    );
    console.log("targetId", targetId);

    if (targetId !== -1) {
      const newItems = this.rawItems.toSpliced(targetId, 1, item);
      this.setItems(newItems);
    }
  }
}
