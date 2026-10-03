/* LC150 part 4: Binary Tree BFS, Binary Search Tree, Graph General, Graph BFS, Trie, Backtracking */
(function () {
  const R = String.raw;
  const TREE = "\n\n```cpp\n// Definition used by LeetCode:\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n```";
  LC150.add([
{
  n: 199, t: 'Binary Tree Right Side View', d: 'M', k: 9,
  s: "Imagine standing on the right side of a binary tree. Return the values of the nodes you can see, ordered from top to bottom." + TREE,
  i: 'root = [1,2,3,null,5,null,4]', o: '[1,3,4]',
  a: 'BFS, keep the last node of each level',
  why: "From the right, you see exactly the rightmost node of each level. A level-order traversal processes each level from left to right, so the last node handled on each level is the visible one.",
  ps: R`
if root is null: return []
queue = [root]; res = []
while queue:
    size = len(queue)
    for i in 0 .. size-1:
        node = pop front
        if i == size-1: res.add(node.val)
        push node.left and node.right if present
return res`,
  cpp: R`
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        vector<int> result;
        if (root == nullptr) {
            return result;
        }
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            // Everything in the queue right now is one level.
            int levelSize = q.size();
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                // The last node of each level is the one you see from the right.
                if (i == levelSize - 1) {
                    result.push_back(node->val);
                }
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
        }
        return result;
    }
};`,
  tc: 'O(n)', sc: 'O(w), where w is the widest level',
  test: R`assert((Solution().rightSideView(T({1,2,3,N_,5,N_,4}))==vector<int>{1,3,4})); assert((Solution().rightSideView(T({1,2,3,4,N_,N_,N_,5}))==vector<int>{1,3,4,5})); assert(Solution().rightSideView(nullptr).empty());`,
},
{
  n: 637, t: 'Average of Levels in Binary Tree', d: 'E', k: 9,
  s: "Given the `root` of a binary tree, return the average value of the nodes on each level, as an array." + TREE,
  i: 'root = [3,9,20,null,null,15,7]', o: '[3.00000,14.50000,11.00000]',
  a: 'BFS level by level',
  why: "A level-order traversal handles one level at a time. Sum each level's values, using a 64-bit sum to avoid overflow, and divide by the level's size.",
  ps: R`
queue = [root]
while queue:
    size = len(queue); sum = 0
    repeat size times:
        node = pop front; sum += node.val
        push its children
    res.add(sum / size)`,
  cpp: R`
class Solution {
public:
    vector<double> averageOfLevels(TreeNode* root) {
        vector<double> result;
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            // Everything in the queue right now is one level.
            int levelSize = q.size();
            long long sum = 0; // 64-bit so large values can't overflow
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                sum += node->val;
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
            result.push_back((double)sum / levelSize);
        }
        return result;
    }
};`,
  tc: 'O(n)', sc: 'O(w)',
  test: R`auto r=Solution().averageOfLevels(T({3,9,20,N_,N_,15,7})); assert(r.size()==3 && fabs(r[0]-3)<1e-9 && fabs(r[1]-14.5)<1e-9 && fabs(r[2]-11)<1e-9); auto r2=Solution().averageOfLevels(T({2147483647,2147483647,2147483647})); assert(fabs(r2[1]-2147483647.0)<1e-6);`,
},
{
  n: 102, t: 'Binary Tree Level Order Traversal', d: 'M', k: 9,
  s: "Given the `root` of a binary tree, return the level-order traversal of its values: level by level, from left to right." + TREE,
  i: 'root = [3,9,20,null,null,15,7]', o: '[[3],[9,20],[15,7]]',
  a: 'BFS with level sizes',
  why: "A queue visits nodes in breadth-first order. Recording the queue size at the start of each level tells you exactly how many nodes belong to that level.",
  ps: R`
queue = [root] if root
while queue:
    level = []
    repeat len(queue) times:
        node = pop front; level.add(node.val)
        push its children
    res.add(level)`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (root == nullptr) {
            return result;
        }
        queue<TreeNode*> q;
        q.push(root);
        while (!q.empty()) {
            // Everything in the queue right now is one level.
            int levelSize = q.size();
            vector<int> level;
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                level.push_back(node->val);
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
            result.push_back(level);
        }
        return result;
    }
};`,
  tc: 'O(n)', sc: 'O(w)',
  test: R`assert((Solution().levelOrder(T({3,9,20,N_,N_,15,7}))==vector<vector<int>>{{3},{9,20},{15,7}})); assert(Solution().levelOrder(nullptr).empty());`,
},
{
  n: 103, t: 'Binary Tree Zigzag Level Order Traversal', d: 'M', k: 9,
  s: "Given the `root` of a binary tree, return the zigzag level-order traversal of its values: the first level left to right, the next right to left, and so on, alternating." + TREE,
  i: 'root = [3,9,20,null,null,15,7]', o: '[[3],[20,9],[15,7]]',
  a: 'BFS + write each level in alternating direction',
  why: "Run a normal level-order BFS. On every other level, write each value at position `size - 1 - i` instead of `i`, so the level comes out reversed without an extra reverse step.",
  ps: R`
leftToRight = true
while queue:
    size = len(queue); level = array of size
    for i in 0 .. size-1:
        node = pop front
        level[leftToRight ? i : size-1-i] = node.val
        push its children
    res.add(level); leftToRight = !leftToRight`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if (root == nullptr) {
            return result;
        }
        queue<TreeNode*> q;
        q.push(root);
        bool leftToRight = true;
        while (!q.empty()) {
            int levelSize = q.size();
            vector<int> level(levelSize);
            for (int i = 0; i < levelSize; i++) {
                TreeNode* node = q.front();
                q.pop();
                // Fill the level from the front or from the back, alternating.
                int position = i;
                if (!leftToRight) {
                    position = levelSize - 1 - i;
                }
                level[position] = node->val;
                if (node->left != nullptr) {
                    q.push(node->left);
                }
                if (node->right != nullptr) {
                    q.push(node->right);
                }
            }
            result.push_back(level);
            leftToRight = !leftToRight;
        }
        return result;
    }
};`,
  tc: 'O(n)', sc: 'O(w)',
  test: R`assert((Solution().zigzagLevelOrder(T({3,9,20,N_,N_,15,7}))==vector<vector<int>>{{3},{20,9},{15,7}})); assert((Solution().zigzagLevelOrder(T({1,2,3,4,N_,N_,5}))==vector<vector<int>>{{1},{3,2},{4,5}}));`,
},
{
  n: 530, t: 'Minimum Absolute Difference in BST', d: 'E', k: 10,
  s: "Given the `root` of a binary search tree, return the minimum absolute difference between the values of any two different nodes." + TREE,
  i: 'root = [4,2,6,1,3]', o: '1',
  a: 'Inorder traversal, compare neighbors',
  why: "An inorder traversal of a BST visits the values in sorted order. In a sorted list, the smallest gap is always between two neighbors. So compare each value with the one visited just before it.",
  ps: R`
prev = none, best = infinity
inorder(node):
    if node is null: return
    inorder(node.left)
    if prev exists: best = min(best, node.val - prev)
    prev = node.val
    inorder(node.right)`,
  cpp: R`
class Solution {
    int best = INT_MAX;
    TreeNode* prev = nullptr; // the previous node in sorted (inorder) order

    void inorder(TreeNode* node) {
        if (node == nullptr) {
            return;
        }
        inorder(node->left);
        // Inorder visits values in sorted order, so compare with the previous one.
        if (prev != nullptr) {
            best = min(best, node->val - prev->val);
        }
        prev = node;
        inorder(node->right);
    }
public:
    int getMinimumDifference(TreeNode* root) {
        inorder(root);
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().getMinimumDifference(T({4,2,6,1,3}))==1 && Solution().getMinimumDifference(T({1,0,48,N_,N_,12,49}))==1 && Solution().getMinimumDifference(T({236,104,701,N_,227,N_,911}))==9);`,
},
{
  n: 230, t: 'Kth Smallest Element in a BST', d: 'M', k: 10,
  s: "Given the `root` of a binary search tree and an integer `k`, return the `k`-th smallest value (1-indexed) among all the node values." + TREE,
  i: 'root = [3,1,4,null,2], k = 1', o: '1',
  a: 'Iterative inorder, stop at k',
  why: "An inorder traversal visits a BST's values in increasing order, so the k-th node visited is the answer. Running the traversal iteratively with a stack lets you stop as soon as you reach it, after O(h + k) steps.",
  ps: R`
stack = [], cur = root
loop:
    while cur: push cur; cur = cur.left
    cur = pop()
    k -= 1
    if k == 0: return cur.val
    cur = cur.right`,
  cpp: R`
class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> st;
        TreeNode* current = root;
        while (true) {
            // Go as far left as possible (toward smaller values).
            while (current != nullptr) {
                st.push(current);
                current = current->left;
            }
            // Visit the next smallest node.
            current = st.top();
            st.pop();
            k--;
            if (k == 0) {
                return current->val;
            }
            // Then continue with its right subtree.
            current = current->right;
        }
    }
};`,
  tc: 'O(h + k)', sc: 'O(h)',
  test: R`assert(Solution().kthSmallest(T({3,1,4,N_,2}),1)==1 && Solution().kthSmallest(T({5,3,6,2,4,N_,N_,1}),3)==3 && Solution().kthSmallest(T({5,3,6,2,4,N_,N_,1}),6)==6);`,
},
{
  n: 98, t: 'Validate Binary Search Tree', d: 'M', k: 10,
  s: "Given the `root` of a binary tree, return `true` if it is a valid BST: every value in a node's left subtree is strictly smaller than the node's value, every value in its right subtree is strictly larger, and both subtrees are themselves BSTs." + TREE,
  i: 'root = [5,1,4,null,null,3,6]', o: 'false', e: 'The root is 5, but its right child is 4.',
  a: 'DFS with value bounds',
  why: "Checking a node against only its children is not enough. Every node must lie inside a range set by **all** of its ancestors. Pass `(low, high)` down the tree: going left tightens `high` to the node's value, and going right tightens `low`. Use 64-bit bounds so values like INT_MIN and INT_MAX still work.",
  ps: R`
valid(node, low, high):
    if node is null: return true
    if not (low < node.val < high): return false
    return valid(node.left, low, node.val) and valid(node.right, node.val, high)
return valid(root, -inf, +inf)`,
  cpp: R`
class Solution {
    // Every value in this subtree must be strictly between low and high.
    bool valid(TreeNode* node, long long low, long long high) {
        if (node == nullptr) {
            return true;
        }
        if (node->val <= low || node->val >= high) {
            return false;
        }
        // Going left lowers the upper bound. Going right raises the lower bound.
        return valid(node->left, low, node->val) && valid(node->right, node->val, high);
    }
public:
    bool isValidBST(TreeNode* root) {
        // 64-bit bounds, so nodes holding INT_MIN or INT_MAX still work.
        return valid(root, LLONG_MIN, LLONG_MAX);
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().isValidBST(T({2,1,3})) && !Solution().isValidBST(T({5,1,4,N_,N_,3,6})) && !Solution().isValidBST(T({5,4,6,N_,N_,3,7})) && Solution().isValidBST(T({2147483647})) && !Solution().isValidBST(T({2,2,2})));`,
},
{
  n: 200, t: 'Number of Islands', d: 'M', k: 11,
  s: "Given an `m × n` grid of `'1'` (land) and `'0'` (water), return the number of islands. An island is a group of land cells connected horizontally or vertically. Everything outside the grid is water.",
  i: 'grid = [["1","1","0","0","0"],\n         ["1","1","0","0","0"],\n         ["0","0","1","0","0"],\n         ["0","0","0","1","1"]]', o: '3',
  a: 'Flood fill (DFS)',
  why: "Scan every cell. Each time you find land that has not been visited yet, you have found a new island. Flood-fill it, turning every connected land cell into water, so it is never counted again.",
  ps: R`
count = 0
for each cell (r, c):
    if grid[r][c] == '1':
        count++
        sink(r, c)
sink(r, c):
    if out of bounds or grid[r][c] != '1': return
    grid[r][c] = '0'
    sink its 4 neighbors`,
  cpp: R`
class Solution {
    // Turn this cell, and all land connected to it, into water.
    void sink(vector<vector<char>>& grid, int r, int c) {
        bool outside = r < 0 || c < 0 || r >= (int)grid.size() || c >= (int)grid[0].size();
        if (outside || grid[r][c] != '1') {
            return;
        }
        grid[r][c] = '0';
        sink(grid, r + 1, c);
        sink(grid, r - 1, c);
        sink(grid, r, c + 1);
        sink(grid, r, c - 1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int count = 0;
        for (int r = 0; r < (int)grid.size(); r++) {
            for (int c = 0; c < (int)grid[0].size(); c++) {
                // Land we haven't sunk yet is a new island. Sink it so it isn't counted again.
                if (grid[r][c] == '1') {
                    count++;
                    sink(grid, r, c);
                }
            }
        }
        return count;
    }
};`,
  tc: 'O(m · n)', sc: 'O(m · n) recursion in the worst case',
  test: R`auto g=G({"11000","11000","00100","00011"}); assert(Solution().numIslands(g)==3); auto g2=G({"11110","11010","11000","00000"}); assert(Solution().numIslands(g2)==1);`,
},
{
  n: 130, t: 'Surrounded Regions', d: 'M', k: 11,
  s: "Given an `m × n` board of `'X'` and `'O'`, capture every region of `'O'` that is completely surrounded by `'X'` by flipping it to `'X'`. A region is surrounded unless one of its cells lies on the border.",
  i: 'board = [["X","X","X","X"],\n         ["X","O","O","X"],\n         ["X","X","O","X"],\n         ["X","O","X","X"]]',
  o: '[["X","X","X","X"],\n         ["X","X","X","X"],\n         ["X","X","X","X"],\n         ["X","O","X","X"]]',
  a: 'Mark the safe cells from the border',
  why: "A region survives only if it touches the border. Flood-fill from every border `'O'` and mark those cells as safe, for example with `'#'`. Every `'O'` left afterwards is surrounded, so flip it to `'X'`, then restore the `'#'` cells to `'O'`.",
  ps: R`
for each border cell that is 'O': mark(r, c)
mark(r, c): if in bounds and board[r][c] == 'O':
    board[r][c] = '#'; mark its 4 neighbors
for each cell:
    if 'O': set 'X'
    else if '#': set 'O'`,
  cpp: R`
class Solution {
    // Mark this 'O', and every 'O' connected to it, as safe ('#').
    void markSafe(vector<vector<char>>& board, int r, int c) {
        bool outside = r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size();
        if (outside || board[r][c] != 'O') {
            return;
        }
        board[r][c] = '#';
        markSafe(board, r + 1, c);
        markSafe(board, r - 1, c);
        markSafe(board, r, c + 1);
        markSafe(board, r, c - 1);
    }
public:
    void solve(vector<vector<char>>& board) {
        int m = board.size();
        int n = board[0].size();
        // Any region of 'O' that touches the border survives.
        for (int r = 0; r < m; r++) {
            markSafe(board, r, 0);
            markSafe(board, r, n - 1);
        }
        for (int c = 0; c < n; c++) {
            markSafe(board, 0, c);
            markSafe(board, m - 1, c);
        }
        // Every 'O' still left is surrounded, so capture it. Restore the safe ones.
        for (auto& row : board) {
            for (char& cell : row) {
                if (cell == '#') {
                    cell = 'O';
                } else {
                    cell = 'X';
                }
            }
        }
    }
};`,
  tc: 'O(m · n)', sc: 'O(m · n) recursion in the worst case',
  test: R`auto b=G({"XXXX","XOOX","XXOX","XOXX"}); Solution().solve(b); assert(b==G({"XXXX","XXXX","XXXX","XOXX"})); auto b2=G({"X"}); Solution().solve(b2); assert(b2==G({"X"})); auto b3=G({"OO","OO"}); Solution().solve(b3); assert(b3==G({"OO","OO"}));`,
},
{
  n: 133, t: 'Clone Graph', d: 'M', k: 11,
  s: "Given a reference to a node in a connected undirected graph, return a **deep copy** of the graph.\n\n```cpp\nclass Node {\npublic:\n    int val;\n    vector<Node*> neighbors;\n};\n```",
  i: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', o: '[[2,4],[1,3],[2,4],[1,3]]', e: 'Node 1 links to nodes 2 and 4, node 2 links to 1 and 3, and so on.',
  a: 'DFS with an original → copy map',
  why: "The map from each original node to its copy has two jobs. It lets you reuse a copy that already exists, and it stops the search from looping around cycles. Create the copy and put it in the map **before** you visit its neighbors.",
  ps: R`
copies = {}
clone(node):
    if node is null: return null
    if node in copies: return copies[node]
    c = new Node(node.val); copies[node] = c
    for nb in node.neighbors: c.neighbors.add(clone(nb))
    return c`,
  cpp: R`
class Solution {
    unordered_map<Node*, Node*> copies; // original node -> its copy
public:
    Node* cloneGraph(Node* node) {
        if (node == nullptr) {
            return nullptr;
        }
        // Already copied. This also stops us from looping around cycles.
        auto it = copies.find(node);
        if (it != copies.end()) {
            return it->second;
        }
        // Create and remember the copy BEFORE visiting the neighbors.
        Node* copy = new Node(node->val);
        copies[node] = copy;
        for (Node* neighbor : node->neighbors) {
            copy->neighbors.push_back(cloneGraph(neighbor));
        }
        return copy;
    }
};`,
  tc: 'O(V + E)', sc: 'O(V)',
  pre: R`class Node { public: int val; vector<Node*> neighbors; Node(int v): val(v) {} };`,
  test: R`vector<Node*> o; for(int i=1;i<=4;i++) o.push_back(new Node(i)); vector<vector<int>> adj={{2,4},{1,3},{2,4},{1,3}}; for(int i=0;i<4;i++) for(int j:adj[i]) o[i]->neighbors.push_back(o[j-1]);
  Node* c=Solution().cloneGraph(o[0]); map<int,Node*> seen; function<void(Node*)> walk=[&](Node* x){ if(seen.count(x->val)) { assert(seen[x->val]==x); return; } for(Node* q:o) assert(q!=x); seen[x->val]=x; for(Node* nb:x->neighbors) walk(nb); }; walk(c);
  assert(seen.size()==4); for(int i=1;i<=4;i++){ vector<int> ns; for(Node* nb:seen[i]->neighbors) ns.push_back(nb->val); assert(ns==adj[i-1]); } assert(Solution().cloneGraph(nullptr)==nullptr);`,
},
{
  n: 399, t: 'Evaluate Division', d: 'M', k: 11,
  s: "You are given `equations[i] = [A, B]` and `values[i]`, which mean A / B = values[i]. For each query `[C, D]`, return C / D, or `-1.0` if it cannot be determined. A variable that never appears in an equation is unknown, so even X / X returns `-1.0` for it.",
  i: 'equations = [["a","b"],["b","c"]], values = [2.0,3.0],\n        queries = [["a","c"],["b","a"],["a","e"],["a","a"],["x","x"]]',
  o: '[6.0,0.5,-1.0,1.0,-1.0]',
  a: 'Weighted graph + DFS',
  why: "Treat each variable as a node. A / B = k adds an edge A → B with weight k, and an edge B → A with weight 1 / k. The ratio C / D is the product of the weights along any path from C to D. Find one with a DFS, or return −1 if there is no path or either variable is unknown.",
  ps: R`
for each (a / b = k): g[a].add((b, k)); g[b].add((a, 1/k))
dfs(a, b, seen):
    if a == b: return 1
    seen.add(a)
    for (nb, w) in g[a] not in seen:
        r = dfs(nb, b, seen)
        if r > 0: return w * r
    return -1
answer each query with dfs, or -1 if a variable is unknown`,
  cpp: R`
class Solution {
    // graph[a] = list of (b, value), meaning a / b = value
    unordered_map<string, vector<pair<string, double>>> graph;

    // Product of the edge values on a path from a to b, or -1 if there is no path.
    double dfs(const string& a, const string& b, unordered_set<string>& visited) {
        if (a == b) {
            return 1.0;
        }
        visited.insert(a);
        for (auto& edge : graph[a]) {
            const string& neighbor = edge.first;
            double ratio = edge.second;
            if (visited.count(neighbor)) {
                continue;
            }
            double rest = dfs(neighbor, b, visited);
            if (rest > 0) {
                // a / b = (a / neighbor) * (neighbor / b)
                return ratio * rest;
            }
        }
        return -1.0;
    }
public:
    vector<double> calcEquation(vector<vector<string>>& equations,
                                vector<double>& values,
                                vector<vector<string>>& queries) {
        // Each equation a / b = v gives two edges: a -> b (v) and b -> a (1 / v).
        for (int i = 0; i < (int)equations.size(); i++) {
            const string& a = equations[i][0];
            const string& b = equations[i][1];
            graph[a].push_back({b, values[i]});
            graph[b].push_back({a, 1.0 / values[i]});
        }
        vector<double> answers;
        for (auto& query : queries) {
            const string& a = query[0];
            const string& b = query[1];
            // A variable we never saw can't be determined.
            if (!graph.count(a) || !graph.count(b)) {
                answers.push_back(-1.0);
                continue;
            }
            unordered_set<string> visited;
            answers.push_back(dfs(a, b, visited));
        }
        return answers;
    }
};`,
  tc: 'O(Q · (V + E))', sc: 'O(V + E)',
  test: R`vector<vector<string>> e={{"a","b"},{"b","c"}}, q={{"a","c"},{"b","a"},{"a","e"},{"a","a"},{"x","x"}}; vector<double> v={2.0,3.0}; auto r=Solution().calcEquation(e,v,q); vector<double> ex={6.0,0.5,-1.0,1.0,-1.0}; assert(r.size()==5); for(int i=0;i<5;i++) assert(fabs(r[i]-ex[i])<1e-9);`,
},
{
  n: 207, t: 'Course Schedule', d: 'M', k: 11,
  s: "There are `numCourses` courses labeled 0 to numCourses − 1. `prerequisites[i] = [a, b]` means you must take course `b` before course `a`. Return `true` if you can finish every course.",
  i: 'numCourses = 2, prerequisites = [[1,0]]', o: 'true', e: 'Take course 0, then course 1.',
  a: "Topological sort (Kahn's algorithm)",
  why: "All courses can be finished exactly when the prerequisite graph has no cycle. Repeatedly take a course with no unmet prerequisites, meaning in-degree 0, and lower the in-degree of the courses that depend on it. If every course gets taken, there is no cycle.",
  ps: R`
build graph b -> a and indegree[a]
queue = all courses with indegree 0
taken = 0
while queue:
    c = pop; taken++
    for nxt in g[c]:
        if --indegree[nxt] == 0: push nxt
return taken == numCourses`,
  cpp: R`
class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Edge before -> course. indegree = prerequisites not taken yet.
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        for (auto& pre : prerequisites) {
            int course = pre[0];
            int before = pre[1];
            graph[before].push_back(course);
            indegree[course]++;
        }
        // Start with the courses that need nothing.
        queue<int> ready;
        for (int c = 0; c < numCourses; c++) {
            if (indegree[c] == 0) {
                ready.push(c);
            }
        }
        int taken = 0;
        while (!ready.empty()) {
            int course = ready.front();
            ready.pop();
            taken++;
            // Taking this course satisfies one prerequisite of each course after it.
            for (int after : graph[course]) {
                indegree[after]--;
                if (indegree[after] == 0) {
                    ready.push(after);
                }
            }
        }
        // If some course never became ready, the prerequisites form a cycle.
        return taken == numCourses;
    }
};`,
  tc: 'O(V + E)', sc: 'O(V + E)',
  test: R`vector<vector<int>> a={{1,0}}, b={{1,0},{0,1}}; assert(Solution().canFinish(2,a) && !Solution().canFinish(2,b));`,
},
{
  n: 210, t: 'Course Schedule II', d: 'M', k: 11,
  s: "Same setup as Course Schedule: `prerequisites[i] = [a, b]` means take `b` before `a`. Return **an order** in which you can take all the courses, or an empty array if that is impossible.",
  i: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', o: '[0,2,1,3]  (any valid order is accepted)',
  a: "Topological sort (Kahn's algorithm)",
  why: "Kahn's algorithm takes courses in an order where every prerequisite comes first, which is exactly a topological order. Record the order in which courses leave the queue. If some course never reaches in-degree 0, there is a cycle, so return an empty array.",
  ps: R`
build graph and indegrees
queue = courses with indegree 0; order = []
while queue:
    c = pop; order.add(c)
    for nxt in g[c]:
        if --indegree[nxt] == 0: push nxt
return len(order) == n ? order : []`,
  cpp: R`
class Solution {
public:
    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {
        // Edge before -> course. indegree = prerequisites not taken yet.
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        for (auto& pre : prerequisites) {
            int course = pre[0];
            int before = pre[1];
            graph[before].push_back(course);
            indegree[course]++;
        }
        // Start with the courses that need nothing.
        queue<int> ready;
        for (int c = 0; c < numCourses; c++) {
            if (indegree[c] == 0) {
                ready.push(c);
            }
        }
        vector<int> order;
        while (!ready.empty()) {
            int course = ready.front();
            ready.pop();
            order.push_back(course);
            for (int after : graph[course]) {
                indegree[after]--;
                if (indegree[after] == 0) {
                    ready.push(after);
                }
            }
        }
        // Some course was never reachable: there is a cycle.
        if ((int)order.size() != numCourses) {
            return {};
        }
        return order;
    }
};`,
  tc: 'O(V + E)', sc: 'O(V + E)',
  test: R`vector<vector<int>> p={{1,0},{2,0},{3,1},{3,2}}; auto o=Solution().findOrder(4,p); assert(o.size()==4); vector<int> at(4); for(int i=0;i<4;i++) at[o[i]]=i; for(auto& e:p) assert(at[e[1]]<at[e[0]]); vector<vector<int>> c={{0,1},{1,0}}; assert(Solution().findOrder(2,c).empty());`,
},
{
  n: 909, t: 'Snakes and Ladders', d: 'M', k: 12,
  s: "An `n × n` board is numbered 1 to n² in boustrophedon order: starting at the bottom-left cell, each row runs in the opposite direction to the one below it. From square `s`, a dice roll moves you to any square from s + 1 to min(s + 6, n²). If that square has a snake or ladder (`board[r][c] != -1`), you must move to its destination. You follow at most one snake or ladder per roll. Return the minimum number of rolls to reach n², or `-1` if it is unreachable.",
  i: 'board = [[-1,-1,-1,-1,-1,-1],\n         [-1,-1,-1,-1,-1,-1],\n         [-1,-1,-1,-1,-1,-1],\n         [-1,35,-1,-1,13,-1],\n         [-1,-1,-1,-1,-1,-1],\n         [-1,15,-1,-1,-1,-1]]',
  o: '4',
  a: 'BFS over square numbers',
  why: "Every roll costs the same, so the fewest rolls is a shortest path in an unweighted graph, which BFS finds. Convert square `s` to board coordinates: `r = (s - 1) / n` counted from the bottom row, with the column direction flipped on every other row. Apply any snake or ladder before marking a square as visited.",
  ps: R`
cell(s): r = (s-1)/n, c = (s-1)%n; if r is odd: c = n-1-c
         return board[n-1-r][c]
dist[1] = 0; queue = [1]
while queue:
    s = pop; if s == n*n: return dist[s]
    for nxt in s+1 .. min(s+6, n*n):
        dest = cell(nxt) == -1 ? nxt : cell(nxt)
        if dest not visited: dist[dest] = dist[s] + 1; push dest
return -1`,
  cpp: R`
class Solution {
    // The board value at square s. Rows count from the bottom and alternate direction.
    int cellValue(vector<vector<int>>& board, int s) {
        int n = board.size();
        int rowFromBottom = (s - 1) / n;
        int col = (s - 1) % n;
        if (rowFromBottom % 2 == 1) {
            col = n - 1 - col; // odd rows run right to left
        }
        return board[n - 1 - rowFromBottom][col];
    }
public:
    int snakesAndLadders(vector<vector<int>>& board) {
        int n = board.size();
        int target = n * n;
        // rolls[s] = fewest rolls to reach square s (-1 = not reached yet)
        vector<int> rolls(target + 1, -1);
        queue<int> q;
        q.push(1);
        rolls[1] = 0;
        while (!q.empty()) {
            int square = q.front();
            q.pop();
            if (square == target) {
                return rolls[square];
            }
            // Try every dice roll from 1 to 6.
            for (int next = square + 1; next <= min(square + 6, target); next++) {
                int destination = next;
                int jump = cellValue(board, next);
                if (jump != -1) {
                    destination = jump; // follow the snake or ladder
                }
                if (rolls[destination] == -1) {
                    rolls[destination] = rolls[square] + 1;
                    q.push(destination);
                }
            }
        }
        return -1;
    }
};`,
  tc: 'O(n²)', sc: 'O(n²)',
  test: R`vector<vector<int>> b={{-1,-1,-1,-1,-1,-1},{-1,-1,-1,-1,-1,-1},{-1,-1,-1,-1,-1,-1},{-1,35,-1,-1,13,-1},{-1,-1,-1,-1,-1,-1},{-1,15,-1,-1,-1,-1}}; assert(Solution().snakesAndLadders(b)==4); vector<vector<int>> b2={{-1,-1},{-1,3}}; assert(Solution().snakesAndLadders(b2)==1); vector<vector<int>> b3={{1,1,-1},{1,1,1},{-1,1,1}}; assert(Solution().snakesAndLadders(b3)==-1);`,
},
{
  n: 433, t: 'Minimum Genetic Mutation', d: 'M', k: 12,
  s: "A gene is an 8-character string of `'A'`, `'C'`, `'G'` and `'T'`. One mutation changes one character, and the result must be in `bank` to be valid. Return the minimum number of mutations needed to turn `startGene` into `endGene`, or `-1` if it is impossible.",
  i: 'startGene = "AACCGGTT", endGene = "AAACGGTA",\n        bank = ["AACCGGTA","AACCGCTA","AAACGGTA"]', o: '2',
  a: 'BFS over genes',
  why: "Each gene is a node, and one valid mutation is an edge. The fewest mutations is a shortest path, which BFS finds. Generate the neighbors by trying all 4 letters at each of the 8 positions, keeping only genes in the bank. Remove each gene from the bank once it is visited.",
  ps: R`
bank = set(bank); if end not in bank: return -1
queue = [(start, 0)]
while queue:
    (g, d) = pop; if g == end: return d
    for i in 0..7, c in "ACGT":
        ng = g with g[i] = c
        if ng in bank: bank.remove(ng); push (ng, d+1)
return -1`,
  cpp: R`
class Solution {
public:
    int minMutation(string startGene, string endGene, vector<string>& bank) {
        unordered_set<string> unvisited(bank.begin(), bank.end());
        if (!unvisited.count(endGene)) {
            return -1;
        }
        // BFS: each step is one mutation. Queue holds (gene, mutations so far).
        queue<pair<string, int>> q;
        q.push({startGene, 0});
        unvisited.erase(startGene);
        const string letters = "ACGT";
        while (!q.empty()) {
            string gene = q.front().first;
            int steps = q.front().second;
            q.pop();
            if (gene == endGene) {
                return steps;
            }
            // Try changing each position to each letter.
            for (int i = 0; i < (int)gene.size(); i++) {
                char original = gene[i];
                for (char c : letters) {
                    gene[i] = c;
                    if (unvisited.count(gene)) {
                        unvisited.erase(gene); // visit each gene only once
                        q.push({gene, steps + 1});
                    }
                }
                gene[i] = original;
            }
        }
        return -1;
    }
};`,
  tc: 'O(B · L · 4), where B is the bank size and L = 8', sc: 'O(B · L)',
  test: R`vector<string> b={"AACCGGTA","AACCGCTA","AAACGGTA"}; assert(Solution().minMutation("AACCGGTT","AAACGGTA",b)==2); vector<string> b2={"AACCGGTA"}; assert(Solution().minMutation("AACCGGTT","AACCGGTA",b2)==1); vector<string> b3={}; assert(Solution().minMutation("AACCGGTT","AACCGGTA",b3)==-1);`,
},
{
  n: 127, t: 'Word Ladder', d: 'H', k: 12,
  s: "A transformation sequence from `beginWord` to `endWord` changes one letter at a time, and every word after the first must be in `wordList`. Return the number of words in the **shortest** such sequence, or `0` if none exists.",
  i: 'beginWord = "hit", endWord = "cog",\n        wordList = ["hot","dot","dog","lot","log","cog"]', o: '5', e: 'hit → hot → dot → dog → cog.',
  a: 'BFS with wildcard neighbors',
  why: "Words are nodes, and words differing by one letter are joined by an edge, so the answer is a shortest-path length. Run BFS from `beginWord`. Generate neighbors by trying all 26 letters at each position, and keep the ones still in the dictionary. Remove words from the dictionary once visited so no word is queued twice.",
  ps: R`
dict = set(wordList); if end not in dict: return 0
queue = [begin]; steps = 1
while queue:
    repeat len(queue) times:
        w = pop; if w == end: return steps
        for i, c in each position and letter:
            nw = w with nw[i] = c
            if nw in dict: dict.remove(nw); push nw
    steps++
return 0`,
  cpp: R`
class Solution {
public:
    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
        unordered_set<string> dict(wordList.begin(), wordList.end());
        if (!dict.count(endWord)) {
            return 0;
        }
        queue<string> q;
        q.push(beginWord);
        dict.erase(beginWord);
        int steps = 1; // number of words in the sequence so far
        while (!q.empty()) {
            // Handle one BFS level: every word reachable with "steps" words.
            int levelSize = q.size();
            for (int i = 0; i < levelSize; i++) {
                string word = q.front();
                q.pop();
                if (word == endWord) {
                    return steps;
                }
                // Try every one-letter change.
                for (int pos = 0; pos < (int)word.size(); pos++) {
                    char original = word[pos];
                    for (char c = 'a'; c <= 'z'; c++) {
                        word[pos] = c;
                        if (dict.count(word)) {
                            dict.erase(word); // visit each word only once
                            q.push(word);
                        }
                    }
                    word[pos] = original;
                }
            }
            steps++;
        }
        return 0;
    }
};`,
  tc: 'O(N · L · 26), with N words of length L', sc: 'O(N · L)',
  test: R`vector<string> w={"hot","dot","dog","lot","log","cog"}; assert(Solution().ladderLength("hit","cog",w)==5); vector<string> w2={"hot","dot","dog","lot","log"}; assert(Solution().ladderLength("hit","cog",w2)==0);`,
},
{
  n: 208, t: 'Implement Trie (Prefix Tree)', d: 'M', k: 13,
  s: "Implement a trie with:\n- `insert(word)`, which adds a word,\n- `search(word)`, which returns `true` if that exact word was inserted,\n- `startsWith(prefix)`, which returns `true` if any inserted word starts with `prefix`.\n\nWords use lowercase English letters.",
  i: '["Trie","insert","search","search","startsWith","insert","search"]\n        [[],["apple"],["apple"],["app"],["app"],["app"],["app"]]',
  o: '[null,null,true,false,true,null,true]',
  a: 'Array of 26 children per node',
  why: "Each node represents one prefix, and edges are labeled with letters. A flag marks the nodes where a complete word ends. `search` and `startsWith` follow the same path. The only difference is whether the final node must carry the end-of-word flag. Storing nodes in a vector, linked by index, avoids raw-pointer cleanup.",
  ps: R`
node: next[26] = -1, end = false
insert(w): cur = root
    for c in w: create child if missing; cur = child
    cur.end = true
walk(s): follow s from root; return the node, or none if a child is missing
search(w):     n = walk(w); return n exists and n.end
startsWith(p): return walk(p) exists`,
  cpp: R`
class Trie {
    struct Node {
        int child[26];      // index of the child node for each letter, or -1
        bool isEnd = false; // a word ends at this node
        Node() {
            fill(child, child + 26, -1);
        }
    };
    vector<Node> nodes; // nodes[0] is the root

    // Follow s from the root. Returns the final node, or -1 if a letter is missing.
    int walk(const string& s) {
        int current = 0;
        for (char c : s) {
            current = nodes[current].child[c - 'a'];
            if (current == -1) {
                return -1;
            }
        }
        return current;
    }
public:
    Trie() : nodes(1) {}

    void insert(string word) {
        int current = 0;
        for (char c : word) {
            int letter = c - 'a';
            // Create the child node if it doesn't exist yet.
            if (nodes[current].child[letter] == -1) {
                int newIndex = nodes.size();
                nodes.emplace_back();
                nodes[current].child[letter] = newIndex;
            }
            current = nodes[current].child[letter];
        }
        nodes[current].isEnd = true;
    }

    bool search(string word) {
        int node = walk(word);
        return node != -1 && nodes[node].isEnd;
    }

    bool startsWith(string prefix) {
        return walk(prefix) != -1;
    }
};`,
  tc: 'O(L) per operation, where L is the word length', sc: 'O(total characters inserted)',
  test: R`Trie t; t.insert("apple"); assert(t.search("apple") && !t.search("app") && t.startsWith("app")); t.insert("app"); assert(t.search("app") && !t.startsWith("b"));`,
},
{
  n: 211, t: 'Design Add and Search Words Data Structure', d: 'M', k: 13,
  s: "Design a `WordDictionary`:\n- `addWord(word)` adds a word.\n- `search(word)` returns `true` if any added word matches. `word` may contain `'.'`, which matches any single letter.",
  i: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n        [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]',
  o: '[null,null,null,null,false,true,true,true]',
  a: 'Trie + DFS for wildcards',
  why: "Store the words in a trie. A normal letter follows a single edge. A `'.'` has to try every child, so search becomes a DFS over trie nodes. A word without dots still costs only O(L).",
  ps: R`
addWord: standard trie insert
dfs(node, i):
    if i == len(word): return node.end
    if word[i] == '.':
        return any(dfs(child, i+1) for each existing child)
    child = node.next[word[i]]
    return child exists and dfs(child, i+1)`,
  cpp: R`
class WordDictionary {
    struct Node {
        int child[26];      // index of the child node for each letter, or -1
        bool isEnd = false; // a word ends at this node
        Node() {
            fill(child, child + 26, -1);
        }
    };
    vector<Node> nodes; // nodes[0] is the root

    // Can word[i..] be matched starting from this node?
    bool dfs(const string& word, int i, int node) {
        if (i == (int)word.size()) {
            return nodes[node].isEnd;
        }
        if (word[i] == '.') {
            // Wildcard: try every child that exists.
            for (int letter = 0; letter < 26; letter++) {
                int child = nodes[node].child[letter];
                if (child != -1 && dfs(word, i + 1, child)) {
                    return true;
                }
            }
            return false;
        }
        // A normal letter: follow its single edge.
        int child = nodes[node].child[word[i] - 'a'];
        if (child == -1) {
            return false;
        }
        return dfs(word, i + 1, child);
    }
public:
    WordDictionary() : nodes(1) {}

    void addWord(string word) {
        int current = 0;
        for (char c : word) {
            int letter = c - 'a';
            if (nodes[current].child[letter] == -1) {
                int newIndex = nodes.size();
                nodes.emplace_back();
                nodes[current].child[letter] = newIndex;
            }
            current = nodes[current].child[letter];
        }
        nodes[current].isEnd = true;
    }

    bool search(string word) {
        return dfs(word, 0, 0);
    }
};`,
  tc: 'O(L) to add; up to O(26^dots · L) to search', sc: 'O(total characters)',
  test: R`WordDictionary d; d.addWord("bad"); d.addWord("dad"); d.addWord("mad"); assert(!d.search("pad") && d.search("bad") && d.search(".ad") && d.search("b..") && !d.search("b...") && !d.search("..."+string("")+"x"));`,
},
{
  n: 212, t: 'Word Search II', d: 'H', k: 13,
  s: "Given an `m × n` `board` of letters and a list of `words`, return every word that appears on the board. A word is formed from horizontally or vertically adjacent cells, and the same cell cannot be used twice in one word.",
  i: 'board = [["o","a","a","n"],\n         ["e","t","a","e"],\n         ["i","h","k","r"],\n         ["i","f","l","v"]],\n        words = ["oath","pea","eat","rain"]',
  o: '["eat","oath"]',
  a: 'Trie of the words + DFS on the board',
  why: "Searching for each word separately repeats work. Instead, put all the words in a trie, and run one DFS from every cell, walking the trie alongside the board. The search stops as soon as the current path is not a prefix of any word. Clear a word's marker once it is found, so it is reported only once.",
  ps: R`
build a trie; store each word's index at its end node
dfs(r, c, node):
    ch = board[r][c]; if visited or node has no child ch: return
    node = child; if node.word: add it; clear node.word
    mark (r, c) visited
    dfs over the 4 neighbors
    unmark (r, c)
for every cell: dfs(r, c, root)`,
  cpp: R`
class Solution {
    struct Node {
        int child[26];      // index of the child node for each letter, or -1
        int wordIndex = -1; // index into "words" if a word ends here
        Node() {
            fill(child, child + 26, -1);
        }
    };
    vector<Node> nodes; // the trie; nodes[0] is the root
    vector<string> found;

    void dfs(vector<vector<char>>& board, int r, int c, int node, vector<string>& words) {
        char letter = board[r][c];
        if (letter == '#') {
            return; // this cell is already used in the current path
        }
        int next = nodes[node].child[letter - 'a'];
        if (next == -1) {
            return; // no word continues with this letter
        }
        if (nodes[next].wordIndex != -1) {
            found.push_back(words[nodes[next].wordIndex]);
            nodes[next].wordIndex = -1; // report each word only once
        }
        board[r][c] = '#'; // mark the cell as used
        const int dr[] = {1, -1, 0, 0};
        const int dc[] = {0, 0, 1, -1};
        for (int d = 0; d < 4; d++) {
            int nr = r + dr[d];
            int nc = c + dc[d];
            bool inside = nr >= 0 && nr < (int)board.size() && nc >= 0 && nc < (int)board[0].size();
            if (inside) {
                dfs(board, nr, nc, next, words);
            }
        }
        board[r][c] = letter; // unmark the cell
    }
public:
    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {
        // Put all the words in a trie.
        nodes.assign(1, Node());
        for (int w = 0; w < (int)words.size(); w++) {
            int current = 0;
            for (char ch : words[w]) {
                int letter = ch - 'a';
                if (nodes[current].child[letter] == -1) {
                    int newIndex = nodes.size();
                    nodes.emplace_back();
                    nodes[current].child[letter] = newIndex;
                }
                current = nodes[current].child[letter];
            }
            nodes[current].wordIndex = w;
        }
        // Start a search from every cell, walking the trie alongside the board.
        for (int r = 0; r < (int)board.size(); r++) {
            for (int c = 0; c < (int)board[0].size(); c++) {
                dfs(board, r, c, 0, words);
            }
        }
        return found;
    }
};`,
  tc: 'O(m · n · 4 · 3^(L−1)) in the worst case, where L is the longest word', sc: 'O(total characters in words)',
  test: R`auto b=G({"oaan","etae","ihkr","iflv"}); vector<string> w={"oath","pea","eat","rain"}; auto r=Solution().findWords(b,w); sort(r.begin(),r.end()); assert((r==vector<string>{"eat","oath"})); auto b2=G({"ab","cd"}); vector<string> w2={"abcb"}; assert(Solution().findWords(b2,w2).empty()); auto b3=G({"a"}); vector<string> w3={"a","a"}; assert(Solution().findWords(b3,w3).size()==1);`,
},
{
  n: 17, t: 'Letter Combinations of a Phone Number', d: 'M', k: 14,
  s: "Given a string of digits from 2 to 9, return every letter combination the number could represent, using the letters on a phone keypad (2 = abc, 3 = def, …, 9 = wxyz). Return the combinations in any order.",
  i: 'digits = "23"', o: '["ad","ae","af","bd","be","bf","cd","ce","cf"]',
  a: 'Backtracking',
  why: "Choose one letter for each digit in turn. Recursion handles one position at a time: for each letter of the current digit, append it, recurse to the next digit, then remove it. When the string is complete, record it. Empty input returns an empty list.",
  ps: R`
if digits empty: return []
bt(i, cur):
    if i == len(digits): res.add(cur); return
    for ch in letters[digits[i]]:
        bt(i+1, cur + ch)
bt(0, "")`,
  cpp: R`
class Solution {
    const vector<string> keys = {"", "", "abc", "def", "ghi",
                                 "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> result;
    string current;

    void backtrack(const string& digits, int i) {
        if (i == (int)digits.size()) {
            result.push_back(current); // one complete combination
            return;
        }
        // Try each letter for this digit.
        for (char letter : keys[digits[i] - '0']) {
            current.push_back(letter);
            backtrack(digits, i + 1);
            current.pop_back(); // undo, then try the next letter
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) {
            return {};
        }
        backtrack(digits, 0);
        return result;
    }
};`,
  tc: 'O(4^n · n)', sc: 'O(n) recursion, plus the output',
  test: R`assert((Solution().letterCombinations("23")==vector<string>{"ad","ae","af","bd","be","bf","cd","ce","cf"})); assert(Solution().letterCombinations("").empty()); assert((Solution().letterCombinations("2")==vector<string>{"a","b","c"}));`,
},
{
  n: 77, t: 'Combinations', d: 'M', k: 14,
  s: "Given integers `n` and `k`, return all combinations of `k` numbers chosen from 1 to `n`, in any order.",
  i: 'n = 4, k = 2', o: '[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]',
  a: 'Backtracking with pruning',
  why: "Build each combination in increasing order, so every set is generated exactly once. From `start`, try each next number. Prune: if fewer numbers remain than slots left to fill, stop early, because `i` can go no higher than `n - (k - size) + 1`.",
  ps: R`
bt(start):
    if len(cur) == k: res.add(cur); return
    for i in start .. n - (k - len(cur)) + 1:
        cur.push(i); bt(i+1); cur.pop()
bt(1)`,
  cpp: R`
class Solution {
    vector<vector<int>> result;
    vector<int> current;

    void backtrack(int start, int n, int k) {
        if ((int)current.size() == k) {
            result.push_back(current);
            return;
        }
        // We still need this many numbers, so stop early enough to fit them.
        int slotsLeft = k - (int)current.size();
        for (int i = start; i <= n - slotsLeft + 1; i++) {
            current.push_back(i);
            backtrack(i + 1, n, k); // the next number must be bigger
            current.pop_back();
        }
    }
public:
    vector<vector<int>> combine(int n, int k) {
        backtrack(1, n, k);
        return result;
    }
};`,
  tc: 'O(C(n, k) · k)', sc: 'O(k) recursion, plus the output',
  test: R`assert((Solution().combine(4,2)==vector<vector<int>>{{1,2},{1,3},{1,4},{2,3},{2,4},{3,4}})); assert((Solution().combine(1,1)==vector<vector<int>>{{1}})); assert(Solution().combine(10,5).size()==252);`,
},
{
  n: 46, t: 'Permutations', d: 'M', k: 14,
  s: "Given an array `nums` of **distinct** integers, return all possible permutations, in any order.",
  i: 'nums = [1,2,3]', o: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]',
  a: 'Backtracking with a used[] array',
  why: "Fill positions one at a time. At each step, try every number that is not used yet. Mark it, recurse, then unmark it. Every complete arrangement is recorded exactly once.",
  ps: R`
bt():
    if len(cur) == n: res.add(cur); return
    for i in 0 .. n-1:
        if not used[i]:
            used[i] = true; cur.push(nums[i])
            bt()
            cur.pop(); used[i] = false`,
  cpp: R`
class Solution {
    vector<vector<int>> result;
    vector<int> current;
    vector<bool> used;

    void backtrack(vector<int>& nums) {
        if (current.size() == nums.size()) {
            result.push_back(current); // one complete permutation
            return;
        }
        for (int i = 0; i < (int)nums.size(); i++) {
            if (used[i]) {
                continue;
            }
            // Choose nums[i], explore, then undo the choice.
            used[i] = true;
            current.push_back(nums[i]);
            backtrack(nums);
            current.pop_back();
            used[i] = false;
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        used.assign(nums.size(), false);
        backtrack(nums);
        return result;
    }
};`,
  tc: 'O(n · n!)', sc: 'O(n) recursion, plus the output',
  test: R`vector<int> a={1,2,3}; assert((Solution().permute(a)==vector<vector<int>>{{1,2,3},{1,3,2},{2,1,3},{2,3,1},{3,1,2},{3,2,1}})); vector<int> b={0,1}; assert(Solution().permute(b).size()==2);`,
},
{
  n: 39, t: 'Combination Sum', d: 'M', k: 14,
  s: "Given an array of **distinct** positive integers `candidates` and a `target`, return all unique combinations whose numbers sum to `target`. Each number may be used any number of times. Two combinations are different if some number is used a different number of times.",
  i: 'candidates = [2,3,6,7], target = 7', o: '[[2,2,3],[7]]',
  a: 'Backtracking, reuse allowed',
  why: "Sort the candidates. Pick numbers in non-decreasing index order, so each multiset is built only once. Recurse from the same index `i`, because a number can be used again. Since the array is sorted, stop the loop once a candidate is larger than the remaining target.",
  ps: R`
sort candidates
bt(start, remain):
    if remain == 0: res.add(cur); return
    for i in start .. n-1:
        if c[i] > remain: break
        cur.push(c[i]); bt(i, remain - c[i]); cur.pop()
bt(0, target)`,
  cpp: R`
class Solution {
    vector<vector<int>> result;
    vector<int> current;

    void backtrack(vector<int>& candidates, int start, int remaining) {
        if (remaining == 0) {
            result.push_back(current);
            return;
        }
        for (int i = start; i < (int)candidates.size(); i++) {
            // Sorted, so once a candidate is too big, every later one is too.
            if (candidates[i] > remaining) {
                break;
            }
            current.push_back(candidates[i]);
            // Pass i (not i + 1): the same number may be used again.
            backtrack(candidates, i, remaining - candidates[i]);
            current.pop_back();
        }
    }
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        sort(candidates.begin(), candidates.end());
        backtrack(candidates, 0, target);
        return result;
    }
};`,
  tc: 'Exponential: O(n^(T/m)), where T is the target and m the smallest candidate', sc: 'O(T/m) recursion',
  test: R`vector<int> a={2,3,6,7}; assert((Solution().combinationSum(a,7)==vector<vector<int>>{{2,2,3},{7}})); vector<int> b={2,3,5}; assert((Solution().combinationSum(b,8)==vector<vector<int>>{{2,2,2,2},{2,3,3},{3,5}})); vector<int> c={2}; assert(Solution().combinationSum(c,1).empty());`,
},
{
  n: 52, t: 'N-Queens II', d: 'H', k: 14,
  s: "Place `n` queens on an `n × n` chessboard so that no two queens attack each other, meaning no two share a row, column or diagonal. Return the number of distinct solutions.",
  i: 'n = 4', o: '2',
  a: 'Row-by-row backtracking with bitmasks',
  why: "Place exactly one queen per row. Track the columns and the two diagonal directions that are already attacked as bitmasks. Shifting the diagonal masks by one as you move to the next row keeps them lined up with the new row. The free squares in a row are the bits set in none of the three masks, and `x & -x` takes them one at a time.",
  ps: R`
solve(cols, d1, d2):
    if cols == all n bits: return 1
    free = ~(cols | d1 | d2) & all
    count = 0
    while free:
        bit = free & -free; free -= bit
        count += solve(cols | bit, (d1 | bit) << 1, (d2 | bit) >> 1)
    return count`,
  cpp: R`
class Solution {
    int full; // n bits set: a queen in every column

    // cols, diag1, diag2 = squares in the current row attacked by earlier queens.
    int place(int cols, int diag1, int diag2) {
        if (cols == full) {
            return 1; // a queen in every row: one solution
        }
        int count = 0;
        int freeSquares = ~(cols | diag1 | diag2) & full;
        while (freeSquares != 0) {
            // Take the lowest free square.
            int bit = freeSquares & -freeSquares;
            freeSquares -= bit;
            // Diagonal attacks move one column over for each row down.
            int nextDiag1 = ((diag1 | bit) << 1) & full;
            int nextDiag2 = (diag2 | bit) >> 1;
            count += place(cols | bit, nextDiag1, nextDiag2);
        }
        return count;
    }
public:
    int totalNQueens(int n) {
        full = (1 << n) - 1;
        return place(0, 0, 0);
    }
};`,
  tc: 'O(n!)', sc: 'O(n) recursion',
  test: R`assert(Solution().totalNQueens(4)==2 && Solution().totalNQueens(1)==1 && Solution().totalNQueens(8)==92 && Solution().totalNQueens(9)==352);`,
},
{
  n: 22, t: 'Generate Parentheses', d: 'M', k: 14,
  s: "Given `n` pairs of parentheses, return every combination of well-formed parentheses.",
  i: 'n = 3', o: '["((()))","(()())","(())()","()(())","()()()"]',
  a: 'Backtracking on open / close counts',
  why: "A prefix can always grow into a valid string as long as you never close more than you have opened. Add `(` while fewer than n are open, and add `)` while there are fewer closes than opens. Every branch then ends in a valid string, so nothing needs filtering.",
  ps: R`
bt(cur, open, close):
    if len(cur) == 2n: res.add(cur); return
    if open < n: bt(cur + "(", open+1, close)
    if close < open: bt(cur + ")", open, close+1)`,
  cpp: R`
class Solution {
    vector<string> result;

    void backtrack(string& current, int open, int close, int n) {
        if ((int)current.size() == 2 * n) {
            result.push_back(current);
            return;
        }
        // We can open a new pair while we still have some left.
        if (open < n) {
            current.push_back('(');
            backtrack(current, open + 1, close, n);
            current.pop_back();
        }
        // We can close only if there is an unmatched '('.
        if (close < open) {
            current.push_back(')');
            backtrack(current, open, close + 1, n);
            current.pop_back();
        }
    }
public:
    vector<string> generateParenthesis(int n) {
        string current;
        backtrack(current, 0, 0, n);
        return result;
    }
};`,
  tc: 'O(4^n / √n), the Catalan number of results times their length', sc: 'O(n) recursion',
  test: R`assert((Solution().generateParenthesis(3)==vector<string>{"((()))","(()())","(())()","()(())","()()()"})); assert((Solution().generateParenthesis(1)==vector<string>{"()"}));`,
},
{
  n: 79, t: 'Word Search', d: 'M', k: 14,
  s: "Given an `m × n` grid of characters `board` and a string `word`, return `true` if `word` can be formed from horizontally or vertically adjacent cells, using each cell at most once.",
  i: 'board = [["A","B","C","E"],\n         ["S","F","C","S"],\n         ["A","D","E","E"]], word = "ABCCED"', o: 'true',
  a: 'DFS backtracking from each cell',
  why: "Try every cell as the starting point. From a cell that matches `word[i]`, mark it as used, so the current path cannot reuse it, and look for `word[i+1]` among its four neighbors. Unmark the cell when backtracking. Return as soon as the whole word is matched.",
  ps: R`
dfs(r, c, i):
    if i == len(word): return true
    if out of bounds or board[r][c] != word[i]: return false
    tmp = board[r][c]; board[r][c] = '#'
    found = any dfs(neighbor, i+1)
    board[r][c] = tmp
    return found
return any dfs(r, c, 0) over all cells`,
  cpp: R`
class Solution {
    // Can word[i..] be spelled starting at cell (r, c)?
    bool dfs(vector<vector<char>>& board, const string& word, int r, int c, int i) {
        if (i == (int)word.size()) {
            return true; // matched every letter
        }
        bool outside = r < 0 || c < 0 || r >= (int)board.size() || c >= (int)board[0].size();
        if (outside || board[r][c] != word[i]) {
            return false;
        }
        char saved = board[r][c];
        board[r][c] = '#'; // don't reuse this cell in the same path
        bool found = dfs(board, word, r + 1, c, i + 1)
                  || dfs(board, word, r - 1, c, i + 1)
                  || dfs(board, word, r, c + 1, i + 1)
                  || dfs(board, word, r, c - 1, i + 1);
        board[r][c] = saved; // undo
        return found;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        // Try every cell as the starting point.
        for (int r = 0; r < (int)board.size(); r++) {
            for (int c = 0; c < (int)board[0].size(); c++) {
                if (dfs(board, word, r, c, 0)) {
                    return true;
                }
            }
        }
        return false;
    }
};`,
  tc: 'O(m · n · 3^L), where L is the word length', sc: 'O(L) recursion',
  test: R`auto b=G({"ABCE","SFCS","ADEE"}); assert(Solution().exist(b,"ABCCED") && Solution().exist(b,"SEE") && !Solution().exist(b,"ABCB"));`,
},
  ]);
})();
