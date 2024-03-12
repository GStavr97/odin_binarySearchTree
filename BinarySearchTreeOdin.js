class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(array) {
    if (array.length < 1) {
      this.root = null;
    } else {
      this.arr = [...new Set(array.sort((a, b) => a - b))];
      this.buildTree(array);
    }
  }

  buildTree(array) {
    let mid = Math.floor(array.length / 2);
    let queue = [];

    this.root = new Node(array[mid]);
    queue.unshift(array.slice(0, mid));
    queue.unshift(array.slice(mid + 1, array.length));

    while (queue.length > 0) {
      queue.filter((item) => item != "undefined");
      if (Number.isInteger(queue[queue.length - 1])) {
        let itemIns = queue.pop();
        this.insert(itemIns);
      } else {
        if (queue[queue.length - 1].length > 0) {
          let arr = queue.pop();
          queue.unshift(arr[Math.floor(arr.length / 2)]);

          if (arr.length > 0) {
            queue.unshift(
              arr.filter((item) => item != arr[Math.floor(arr.length / 2)])
            );
          }
        } else {
          queue.pop();
        }
      }
    }
  }

  insert(value) {
    let tmp = this.root;

    while (tmp != null) {
      if (tmp.data > value) {
        if (tmp.left == null) {
          tmp.left = new Node(value);
          break;
        } else {
          tmp = tmp.left;
        }
      } else if (tmp.data < value) {
        if (tmp.right == null) {
          tmp.right = new Node(value);
          break;
        } else {
          tmp = tmp.right;
        }
      }
    }
  }

  find(value) {
    let tmp = this.root;

    if (tmp.data == value) {
      return tmp;
    }

    while (!(tmp.left == null && tmp.right == null)) {
      if (tmp.data > value) {
        if (tmp.left != null) {
          tmp = tmp.left;
        }
      } else if (tmp.data < value) {
        if (tmp.right != null) {
          tmp = tmp.right;
        }
      } else {
        return tmp;
      }
    }
    if (tmp.data == value) {
      return tmp;
    }
    return false;
  }

  delete(value) {
    let tmp = this.root;
    let prev = this.root;

    if (this.find(value).left == null && this.find(value).right == null) {
      while (tmp.data != value) {
        if (tmp.data > value) {
          prev = tmp;
          tmp = tmp.left;
        } else {
          prev = tmp;
          tmp = tmp.right;
        }
        if (prev.data > value) {
          prev.left = null;
        } else {
          prev.right = null;
        }
      }
    } else if (
      (this.find(value).left != null && this.find(value).right == null) ||
      (this.find(value).left == null && this.find(value).right != null)
    ) {
      while (tmp.data != value) {
        if (tmp.data > value) {
          prev = tmp;
          tmp = tmp.left;
        } else {
          prev = tmp;
          tmp = tmp.right;
        }
      }
      if (prev.data > value) {
        if (tmp.left != null) {
          prev.left = tmp.left;
        } else {
          prev.left = tmp.right;
        }
      } else {
        if (tmp.left != null) {
          prev.right = tmp.left;
        } else {
          prev.right = tmp.right;
        }
      }
    } else if (
      this.find(value).left != null &&
      this.find(value).right != null
    ) {
      let prev = this.root;
      let curr = this.root.right;

      while (curr.left !== null) {
        prev = curr;
        curr = curr.left;
      }
      if (prev !== this.root) {
        prev.left = curr.right;
      } else {
        prev.right = curr.right;
      }
      this.root.data = curr.data;
      return this.root;
    }
  }

  levelOrder() {
    let queue = [];
    let lorder = [];
    queue.push(this.root);

    while (queue.length > 0) {
      let tmp = queue.shift();
      lorder.push(tmp.data);
      if (tmp.left != null) {
        queue.push(tmp.left);
      }
      if (tmp.right != null) {
        queue.push(tmp.right);
      }
    }
    return lorder;
  }

  inOrder(node = this.root) {
    if (this.root == null) return;

    let values = [];
    let inorder = [];
    let tmp = this.find(node);

    while (tmp != null || values.length > 0) {
      while (tmp != null) {
        values.push(tmp);
        tmp = tmp.left;
      }
      tmp = values.pop();
      inorder.push(tmp.data);
      tmp = tmp.right;
    }
    return inorder;
  }

  preOrder(node = this.root) {
    if (this.root == null) return;

    let preorder = [];
    let values = [];
    let tmp = this.find(node);

    while (tmp != null || values.length > 0) {
      while (tmp != null) {
        preorder.push(tmp.data);
        if (tmp.right != null) {
          values.push(tmp.right);
        }
        tmp = tmp.left;
      }
      tmp = values.pop();
    }
    return preorder;
  }

  postOrder(node = this.root) {
    if (this.root == null) return;

    let preorder = [];
    let values = [];
    let tmp = this.find(node);

    while (tmp != null || values.length > 0) {
      while (tmp != null) {
        preorder.push(tmp.data);
        if (tmp.left != null) {
          values.push(tmp.left);
        }

        tmp = tmp.right;
      }
      tmp = values.pop();
    }
    return preorder.reverse();
  }

  depth(value) {
    let tmp = this.root;
    let depth = 0;
    while (tmp.data != value) {
      if (value > tmp.data) {
        tmp = tmp.right;
        depth++;
      } else {
        tmp = tmp.left;
        depth++;
      }
    }
    return depth;
  }

  height(value) {
    //if value is in leaf node then return zero
    if (this.find(value).left == null && this.find(value).right == null)
      return 0;
    //get all leaf nodes
    let leafs = this.preOrder(value);
    for (let i = 0; i < leafs.length; i++) {
      if (
        !(this.find(leafs[i]).left == null && this.find(leafs[i]).right == null)
      ) {
        leafs.splice(leafs.indexOf(leafs[i]), 1);
      }
    }

    for (let i = 0; i < leafs.length; i++) {
      leafs[i] = this.depth(leafs[i]) - this.depth(value);
    }

    return Math.max(...leafs);
  }

  isBalanced() {
    if (this.root == null) return true;
    let nodes = this.preOrder();
    let arr = [];

    for (let i = 1; i < nodes.length; i++) {
      if (
        this.find(nodes[i]).left == null &&
        this.find(nodes[i]).right == null
      ) {
        arr.push(this.depth(nodes[i]));
      }
    }
    arr = [...new Set(arr.sort())];

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i + 1] != arr[i] + 1) return false;
    }
    return true;
  }

  rebalance() {
    //read the values and call function with said values
    this.arr = this.inOrder();
    this.root = null;
    this.buildTree(this.arr);
  }
}

let tree1 = new Tree([12, 3, 2, 9, 10, 8, 21, 11, 1, 3]);
console.log(tree1.isBalanced());
