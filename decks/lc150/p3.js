/* LC150 part 3: Linked List, Binary Tree General */
(function () {
  const R = String.raw;
  const LIST = "\n\n```cpp\n// Definition used by LeetCode:\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n```";
  const TREE = "\n\n```cpp\n// Definition used by LeetCode:\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n```";
  LC150.add([
{
  n: 141, t: 'Linked List Cycle', d: 'E', k: 7,
  s: "Given `head`, the head of a linked list, return `true` if the list contains a cycle: some node can be reached again by repeatedly following `next`." + LIST,
  i: 'head = [3,2,0,-4], pos = 1  (the tail links back to index 1)', o: 'true',
  a: "Floyd's tortoise and hare",
  why: "Move a slow pointer one step and a fast pointer two steps at a time. Without a cycle, the fast pointer reaches the end. With a cycle, the fast pointer gains one node per step on the slow one, so it must eventually land on it.",
  ps: R`
slow = fast = head
while fast and fast.next:
    slow = slow.next
    fast = fast.next.next
    if slow == fast: return true
return false`,
  cpp: R`
class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`ListNode* h=L({3,2,0,-4}); h->next->next->next->next=h->next; assert(Solution().hasCycle(h)); assert(!Solution().hasCycle(L({1,2}))); assert(!Solution().hasCycle(nullptr));`,
},
{
  n: 2, t: 'Add Two Numbers', d: 'M', k: 7,
  s: "Two non-negative integers are stored as linked lists of digits in **reverse order**, so the head is the ones digit. Add them and return the sum as a linked list in the same format." + LIST,
  i: 'l1 = [2,4,3], l2 = [5,6,4]', o: '[7,0,8]', e: '342 + 465 = 807.',
  a: 'Grade-school addition with carry',
  why: "The digits are already lowest first, which is the order you add them by hand. Walk both lists together, add the two digits and the carry, and emit `sum % 10`. Keep going while either list has digits or a carry remains.",
  ps: R`
dummy = new node; tail = dummy; carry = 0
while l1 or l2 or carry:
    s = carry + (l1 ? l1.val : 0) + (l2 ? l2.val : 0)
    tail.next = node(s % 10); tail = tail.next
    carry = s / 10
    advance l1, l2
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int s = carry;
            if (l1) { s += l1->val; l1 = l1->next; }
            if (l2) { s += l2->val; l2 = l2->next; }
            tail->next = new ListNode(s % 10);
            tail = tail->next;
            carry = s / 10;
        }
        return dummy.next;
    }
};`,
  tc: 'O(max(m, n))', sc: 'O(1) extra (the output list does not count)',
  test: R`assert((V(Solution().addTwoNumbers(L({2,4,3}),L({5,6,4})))==vector<int>{7,0,8})); assert((V(Solution().addTwoNumbers(L({9,9,9,9,9,9,9}),L({9,9,9,9})))==vector<int>{8,9,9,9,0,0,0,1}));`,
},
{
  n: 21, t: 'Merge Two Sorted Lists', d: 'E', k: 7,
  s: "Merge two sorted linked lists `list1` and `list2` into one sorted list by splicing their nodes together. Return the head of the merged list." + LIST,
  i: 'list1 = [1,2,4], list2 = [1,3,4]', o: '[1,1,2,3,4,4]',
  a: 'Dummy head + tail pointer',
  why: "Repeatedly take the smaller head of the two lists and attach it to the tail of the result. A dummy head node avoids special cases for the first node. When one list runs out, attach the rest of the other.",
  ps: R`
dummy; tail = dummy
while a and b:
    if a.val <= b.val: tail.next = a; a = a.next
    else:              tail.next = b; b = b.next
    tail = tail.next
tail.next = a ? a : b
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* a, ListNode* b) {
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (a && b) {
            if (a->val <= b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = a ? a : b;
        return dummy.next;
    }
};`,
  tc: 'O(m + n)', sc: 'O(1)',
  test: R`assert((V(Solution().mergeTwoLists(L({1,2,4}),L({1,3,4})))==vector<int>{1,1,2,3,4,4})); assert(Solution().mergeTwoLists(nullptr,nullptr)==nullptr);`,
},
{
  n: 138, t: 'Copy List with Random Pointer', d: 'M', k: 7,
  s: "Each node of a linked list has a `next` pointer and a `random` pointer, which points to any node in the list or to `null`. Return a **deep copy** of the list, in which no pointer in the copy points into the original list.\n\n```cpp\nclass Node {\npublic:\n    int val;\n    Node *next, *random;\n    Node(int v) : val(v), next(nullptr), random(nullptr) {}\n};\n```",
  i: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]  (pairs of [val, random index])', o: '[[7,null],[13,0],[11,4],[10,2],[1,0]]',
  a: 'Interleave copies (O(1) extra space)',
  why: "Insert each node's copy right after it: A → A' → B → B' and so on. Now the copy of `p->random` is just `p->random->next`, so every random pointer can be set in one pass. Then unweave the two lists, restoring the original. A hash map from original node to copy is simpler but uses O(n) space.",
  ps: R`
for each node p: insert copy(p) between p and p.next
for each original p:
    if p.random: p.next.random = p.random.next
newHead = head.next
for each original p:
    c = p.next
    p.next = c.next
    c.next = c.next ? c.next.next : null
return newHead`,
  cpp: R`
class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        for (Node* p = head; p; p = p->next->next) {
            Node* c = new Node(p->val);
            c->next = p->next;
            p->next = c;
        }
        for (Node* p = head; p; p = p->next->next)
            if (p->random) p->next->random = p->random->next;
        Node* newHead = head->next;
        for (Node* p = head; p; p = p->next) {
            Node* c = p->next;
            p->next = c->next;
            if (c->next) c->next = c->next->next;
        }
        return newHead;
    }
};`,
  tc: 'O(n)', sc: 'O(1) extra (the copy does not count)',
  pre: R`class Node { public: int val; Node* next; Node* random; Node(int v): val(v), next(nullptr), random(nullptr) {} };`,
  test: R`int vals[]={7,13,11,10,1}, rnd[]={-1,0,4,2,0}; vector<Node*> o; for(int v:vals) o.push_back(new Node(v)); for(int i=0;i<5;i++){ if(i<4) o[i]->next=o[i+1]; if(rnd[i]>=0) o[i]->random=o[rnd[i]]; }
  Node* c=Solution().copyRandomList(o[0]); vector<Node*> cs; for(Node* p=c;p;p=p->next){ cs.push_back(p); for(Node* q:o) assert(p!=q); } assert(cs.size()==5);
  for(int i=0;i<5;i++){ assert(cs[i]->val==vals[i]); if(rnd[i]<0) assert(!cs[i]->random); else assert(cs[i]->random==cs[rnd[i]]); assert(o[i]->next==(i<4?o[i+1]:nullptr)); }
  assert(Solution().copyRandomList(nullptr)==nullptr);`,
},
{
  n: 92, t: 'Reverse Linked List II', d: 'M', k: 7,
  s: "Given `head` and positions `left <= right` (1-indexed), reverse the nodes from position `left` to position `right` and return the list." + LIST,
  i: 'head = [1,2,3,4,5], left = 2, right = 4', o: '[1,4,3,2,5]',
  a: 'One pass, insert at the front of the sublist',
  why: "Walk `pre` to the node just before position `left`. The node `cur` after it will end up as the tail of the reversed part. Repeatedly take the node after `cur` and move it to just after `pre`. After `right - left` moves, the sublist is reversed.",
  ps: R`
dummy.next = head; pre = dummy
repeat left-1 times: pre = pre.next
cur = pre.next
repeat right-left times:
    nxt = cur.next
    cur.next = nxt.next
    nxt.next = pre.next
    pre.next = nxt
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* reverseBetween(ListNode* head, int left, int right) {
        ListNode dummy(0, head);
        ListNode* pre = &dummy;
        for (int i = 1; i < left; i++) pre = pre->next;
        ListNode* cur = pre->next;
        for (int i = 0; i < right - left; i++) {
            ListNode* nxt = cur->next;
            cur->next = nxt->next;
            nxt->next = pre->next;
            pre->next = nxt;
        }
        return dummy.next;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().reverseBetween(L({1,2,3,4,5}),2,4))==vector<int>{1,4,3,2,5})); assert((V(Solution().reverseBetween(L({5}),1,1))==vector<int>{5})); assert((V(Solution().reverseBetween(L({3,5}),1,2))==vector<int>{5,3}));`,
},
{
  n: 25, t: 'Reverse Nodes in k-Group', d: 'H', k: 7,
  s: "Given `head`, reverse the nodes of the list `k` at a time and return the modified list. If the number of nodes left at the end is less than `k`, leave them as they are. Only change the links, not the node values." + LIST,
  i: 'head = [1,2,3,4,5], k = 2', o: '[2,1,4,3,5]',
  a: 'Reverse group by group',
  why: "Before each group, check that `k` nodes remain by walking ahead to the k-th node. Reverse the group in place, pointing its first node at the node that follows the group. Then link the previous part of the list to the new group head. The old first node is now the group's tail and becomes `groupPrev` for the next group.",
  ps: R`
dummy.next = head; groupPrev = dummy
loop:
    kth = node k steps after groupPrev; if none: break
    groupNext = kth.next
    reverse the nodes from groupPrev.next to kth, linking the first to groupNext
    first = groupPrev.next
    groupPrev.next = kth
    groupPrev = first
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode* groupPrev = &dummy;
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth; i++) kth = kth->next;
            if (!kth) break;
            ListNode* groupNext = kth->next;
            ListNode* prev = groupNext;
            ListNode* cur = groupPrev->next;
            while (cur != groupNext) {
                ListNode* nxt = cur->next;
                cur->next = prev;
                prev = cur;
                cur = nxt;
            }
            ListNode* first = groupPrev->next;
            groupPrev->next = kth;
            groupPrev = first;
        }
        return dummy.next;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().reverseKGroup(L({1,2,3,4,5}),2))==vector<int>{2,1,4,3,5})); assert((V(Solution().reverseKGroup(L({1,2,3,4,5}),3))==vector<int>{3,2,1,4,5})); assert((V(Solution().reverseKGroup(L({1,2}),1))==vector<int>{1,2}));`,
},
{
  n: 19, t: 'Remove Nth Node From End of List', d: 'M', k: 7,
  s: "Given `head`, remove the `n`-th node from the **end** of the list and return its head. Try to do it in one pass." + LIST,
  i: 'head = [1,2,3,4,5], n = 2', o: '[1,2,3,5]',
  a: 'Two pointers with a gap of n',
  why: "Start both pointers at a dummy node. Move `fast` n + 1 steps ahead. Then move both until `fast` falls off the end. `slow` is now exactly one node before the node to remove. The dummy node also handles removing the head.",
  ps: R`
dummy.next = head; fast = slow = dummy
repeat n+1 times: fast = fast.next
while fast: fast = fast.next; slow = slow.next
slow.next = slow.next.next
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode *fast = &dummy, *slow = &dummy;
        for (int i = 0; i <= n; i++) fast = fast->next;
        while (fast) {
            fast = fast->next;
            slow = slow->next;
        }
        ListNode* del = slow->next;
        slow->next = del->next;
        delete del;
        return dummy.next;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().removeNthFromEnd(L({1,2,3,4,5}),2))==vector<int>{1,2,3,5})); assert(Solution().removeNthFromEnd(L({1}),1)==nullptr); assert((V(Solution().removeNthFromEnd(L({1,2}),2))==vector<int>{2}));`,
},
{
  n: 82, t: 'Remove Duplicates from Sorted List II', d: 'M', k: 7,
  s: "Given the head of a sorted linked list, delete **every** node whose value appears more than once, keeping only the values that appear exactly once. Return the sorted result." + LIST,
  i: 'head = [1,2,3,3,4,4,5]', o: '[1,2,5]',
  a: 'Dummy head; skip whole runs',
  why: "`prev` is the last node known to be kept. If the current node starts a run of equal values, skip past the entire run and link `prev` to whatever follows it. Otherwise the current node is unique, so advance `prev`.",
  ps: R`
dummy.next = head; prev = dummy
while head:
    if head.next and head.val == head.next.val:
        while head.next and head.val == head.next.val: head = head.next
        prev.next = head.next
    else:
        prev = prev.next
    head = head.next
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        ListNode dummy(0, head);
        ListNode* prev = &dummy;
        while (head) {
            if (head->next && head->val == head->next->val) {
                while (head->next && head->val == head->next->val)
                    head = head->next;
                prev->next = head->next;
            } else {
                prev = prev->next;
            }
            head = head->next;
        }
        return dummy.next;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().deleteDuplicates(L({1,2,3,3,4,4,5})))==vector<int>{1,2,5})); assert((V(Solution().deleteDuplicates(L({1,1,1,2,3})))==vector<int>{2,3})); assert(Solution().deleteDuplicates(L({1,1}))==nullptr);`,
},
{
  n: 61, t: 'Rotate List', d: 'M', k: 7,
  s: "Given `head`, rotate the list to the right by `k` places." + LIST,
  i: 'head = [1,2,3,4,5], k = 2', o: '[4,5,1,2,3]',
  a: 'Close the ring, then cut it',
  why: "Rotating by the length n changes nothing, so use `k % n`. Connect the tail to the head to form a ring. The new tail is n − k − 1 steps from the old head, and the new head is the node after it. Break the ring there.",
  ps: R`
if head is null: return head
n = length; tail = last node
k = k mod n; if k == 0: return head
tail.next = head
newTail = node n-k-1 steps from head
newHead = newTail.next; newTail.next = null
return newHead`,
  cpp: R`
class Solution {
public:
    ListNode* rotateRight(ListNode* head, int k) {
        if (!head) return head;
        int n = 1;
        ListNode* tail = head;
        while (tail->next) { tail = tail->next; n++; }
        k %= n;
        if (k == 0) return head;
        tail->next = head;
        ListNode* newTail = head;
        for (int i = 0; i < n - k - 1; i++) newTail = newTail->next;
        ListNode* newHead = newTail->next;
        newTail->next = nullptr;
        return newHead;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().rotateRight(L({1,2,3,4,5}),2))==vector<int>{4,5,1,2,3})); assert((V(Solution().rotateRight(L({0,1,2}),4))==vector<int>{2,0,1})); assert(Solution().rotateRight(nullptr,3)==nullptr);`,
},
{
  n: 86, t: 'Partition List', d: 'M', k: 7,
  s: "Given `head` and a value `x`, rearrange the list so all nodes with values **less than** `x` come before nodes with values greater than or equal to `x`. Keep the original relative order inside each part." + LIST,
  i: 'head = [1,4,3,2,5,2], x = 3', o: '[1,2,2,4,3,5]',
  a: 'Two dummy lists',
  why: "Build two lists as you walk the original one: values below `x`, and everything else. Appending to the tail of each keeps the order stable. Join the first list to the second and end the second with `null`.",
  ps: R`
lessHead, geHead = dummy nodes; lt = lessHead; ge = geHead
for node in list:
    if node.val < x: lt.next = node; lt = node
    else:            ge.next = node; ge = node
ge.next = null
lt.next = geHead.next
return lessHead.next`,
  cpp: R`
class Solution {
public:
    ListNode* partition(ListNode* head, int x) {
        ListNode lessHead(0), geHead(0);
        ListNode *lt = &lessHead, *ge = &geHead;
        for (; head; head = head->next) {
            if (head->val < x) { lt->next = head; lt = head; }
            else { ge->next = head; ge = head; }
        }
        ge->next = nullptr;
        lt->next = geHead.next;
        return lessHead.next;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert((V(Solution().partition(L({1,4,3,2,5,2}),3))==vector<int>{1,2,2,4,3,5})); assert((V(Solution().partition(L({2,1}),2))==vector<int>{1,2}));`,
},
{
  n: 146, t: 'LRU Cache', d: 'M', k: 7,
  s: "Design an LRU (least recently used) cache with a fixed `capacity`:\n- `get(key)` returns the value, or `-1` if the key is not present.\n- `put(key, value)` inserts or updates the key. If that pushes the cache over capacity, evict the least recently used key.\n\nBoth operations must run in **O(1)** average time.",
  i: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n        [[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]',
  o: '[null,null,null,1,null,-1,null,-1,3,4]',
  a: 'Doubly linked list + hash map',
  why: "A doubly linked list keeps the keys ordered by recency, with the most recent at the front. It can move or remove any node in O(1). A hash map from key to list node gives O(1) lookup. On every access, move the node to the front, and evict from the back. In C++, `list::splice` moves a node without reallocating.",
  ps: R`
get(k):
    if k not in map: return -1
    move node to front; return its value
put(k, v):
    if k in map: update value; move to front; return
    if size == capacity: remove back node and its map entry
    push (k, v) to front; map[k] = front`,
  cpp: R`
class LRUCache {
    int cap;
    list<pair<int, int>> items; // front = most recently used
    unordered_map<int, list<pair<int, int>>::iterator> pos;
public:
    LRUCache(int capacity) : cap(capacity) {}

    int get(int key) {
        auto it = pos.find(key);
        if (it == pos.end()) return -1;
        items.splice(items.begin(), items, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = pos.find(key);
        if (it != pos.end()) {
            it->second->second = value;
            items.splice(items.begin(), items, it->second);
            return;
        }
        if ((int)items.size() == cap) {
            pos.erase(items.back().first);
            items.pop_back();
        }
        items.emplace_front(key, value);
        pos[key] = items.begin();
    }
};`,
  tc: 'O(1) average per operation', sc: 'O(capacity)',
  test: R`LRUCache c(2); c.put(1,1); c.put(2,2); assert(c.get(1)==1); c.put(3,3); assert(c.get(2)==-1); c.put(4,4); assert(c.get(1)==-1 && c.get(3)==3 && c.get(4)==4); c.put(3,30); assert(c.get(3)==30);`,
},
{
  n: 104, t: 'Maximum Depth of Binary Tree', d: 'E', k: 8,
  s: "Given the `root` of a binary tree, return its maximum depth: the number of nodes on the longest path from the root down to a leaf." + TREE,
  i: 'root = [3,9,20,null,null,15,7]', o: '3',
  a: 'Recursive DFS',
  why: "A tree's depth is one more than the deeper of its two subtrees. An empty tree has depth 0.",
  ps: R`
depth(node):
    if node is null: return 0
    return 1 + max(depth(node.left), depth(node.right))`,
  cpp: R`
class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
  tc: 'O(n)', sc: 'O(h) recursion, where h is the tree height',
  test: R`assert(Solution().maxDepth(T({3,9,20,N_,N_,15,7}))==3 && Solution().maxDepth(T({1,N_,2}))==2 && Solution().maxDepth(nullptr)==0);`,
},
{
  n: 100, t: 'Same Tree', d: 'E', k: 8,
  s: "Given the roots `p` and `q` of two binary trees, return `true` if they are the same: they have the same structure, and matching nodes have the same values." + TREE,
  i: 'p = [1,2,3], q = [1,2,3]', o: 'true',
  a: 'Recursive comparison',
  why: "Two trees are the same when both are empty, or when both roots exist with equal values and their left subtrees and right subtrees are the same.",
  ps: R`
same(p, q):
    if p is null or q is null: return p == q
    return p.val == q.val and same(p.left, q.left) and same(p.right, q.right)`,
  cpp: R`
class Solution {
public:
    bool isSameTree(TreeNode* p, TreeNode* q) {
        if (!p || !q) return p == q;
        return p->val == q->val && isSameTree(p->left, q->left) &&
               isSameTree(p->right, q->right);
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().isSameTree(T({1,2,3}),T({1,2,3})) && !Solution().isSameTree(T({1,2}),T({1,N_,2})) && !Solution().isSameTree(T({1,2,1}),T({1,1,2})));`,
},
{
  n: 226, t: 'Invert Binary Tree', d: 'E', k: 8,
  s: "Given the `root` of a binary tree, invert it, mirroring it left to right, and return its root." + TREE,
  i: 'root = [4,2,7,1,3,6,9]', o: '[4,7,2,9,6,3,1]',
  a: 'Recursive swap',
  why: "Mirroring a tree means swapping each node's left and right children, at every level. Swap at the root, then invert both subtrees recursively.",
  ps: R`
invert(node):
    if node is null: return null
    swap(node.left, node.right)
    invert(node.left); invert(node.right)
    return node`,
  cpp: R`
class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert((S(Solution().invertTree(T({4,2,7,1,3,6,9})))==vector<int>{4,7,2,9,6,3,1})); assert((S(Solution().invertTree(T({2,1,3})))==vector<int>{2,3,1}));`,
},
{
  n: 101, t: 'Symmetric Tree', d: 'E', k: 8,
  s: "Given the `root` of a binary tree, return `true` if it is a mirror of itself, meaning symmetric around its center." + TREE,
  i: 'root = [1,2,2,3,4,4,3]', o: 'true',
  a: 'Mirror recursion',
  why: "A tree is symmetric when its left and right subtrees mirror each other. Two trees `a` and `b` mirror each other when their roots are equal, `a.left` mirrors `b.right`, and `a.right` mirrors `b.left`.",
  ps: R`
mirror(a, b):
    if a is null or b is null: return a == b
    return a.val == b.val and mirror(a.left, b.right) and mirror(a.right, b.left)
return mirror(root.left, root.right)`,
  cpp: R`
class Solution {
    bool mirror(TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val && mirror(a->left, b->right) &&
               mirror(a->right, b->left);
    }
public:
    bool isSymmetric(TreeNode* root) {
        return !root || mirror(root->left, root->right);
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().isSymmetric(T({1,2,2,3,4,4,3})) && !Solution().isSymmetric(T({1,2,2,N_,3,N_,3})));`,
},
{
  n: 105, t: 'Construct Binary Tree from Preorder and Inorder Traversal', d: 'M', k: 8,
  s: "Given the `preorder` and `inorder` traversals of a binary tree with unique values, build the tree and return its root." + TREE,
  i: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', o: '[3,9,20,null,null,15,7]',
  a: 'Recursion + inorder index map',
  why: "The next unused preorder value is always the root of the current subtree. Its position in the inorder array splits that range into the left and right subtrees. Build the left subtree first, because preorder lists it next. A hash map from value to inorder index makes each split O(1).",
  ps: R`
idx[v] = position of v in inorder; pre = 0
build(lo, hi):
    if lo > hi: return null
    root = node(preorder[pre++])
    m = idx[root.val]
    root.left = build(lo, m-1)
    root.right = build(m+1, hi)
    return root
return build(0, n-1)`,
  cpp: R`
class Solution {
    unordered_map<int, int> idx;
    int pre = 0;
    TreeNode* build(vector<int>& preorder, int lo, int hi) {
        if (lo > hi) return nullptr;
        TreeNode* root = new TreeNode(preorder[pre++]);
        int m = idx[root->val];
        root->left = build(preorder, lo, m - 1);
        root->right = build(preorder, m + 1, hi);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < (int)inorder.size(); i++) idx[inorder[i]] = i;
        return build(preorder, 0, (int)inorder.size() - 1);
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> p={3,9,20,15,7}, in={9,3,15,20,7}; assert((S(Solution().buildTree(p,in))==vector<int>{3,9,20,N_,N_,15,7})); vector<int> p2={-1}, i2={-1}; assert((S(Solution().buildTree(p2,i2))==vector<int>{-1}));`,
},
{
  n: 106, t: 'Construct Binary Tree from Inorder and Postorder Traversal', d: 'M', k: 8,
  s: "Given the `inorder` and `postorder` traversals of a binary tree with unique values, build the tree and return its root." + TREE,
  i: 'inorder = [9,3,15,20,7], postorder = [9,15,7,20,3]', o: '[3,9,20,null,null,15,7]',
  a: 'Recursion from the end of postorder',
  why: "The last element of postorder is the root. Read postorder backwards: root, then the right subtree, then the left subtree. So build the **right** subtree first. As before, the root's inorder position splits the range.",
  ps: R`
idx[v] = position in inorder; post = n-1
build(lo, hi):
    if lo > hi: return null
    root = node(postorder[post--])
    m = idx[root.val]
    root.right = build(m+1, hi)
    root.left = build(lo, m-1)
    return root`,
  cpp: R`
class Solution {
    unordered_map<int, int> idx;
    int post;
    TreeNode* build(vector<int>& postorder, int lo, int hi) {
        if (lo > hi) return nullptr;
        TreeNode* root = new TreeNode(postorder[post--]);
        int m = idx[root->val];
        root->right = build(postorder, m + 1, hi);
        root->left = build(postorder, lo, m - 1);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& inorder, vector<int>& postorder) {
        for (int i = 0; i < (int)inorder.size(); i++) idx[inorder[i]] = i;
        post = (int)postorder.size() - 1;
        return build(postorder, 0, (int)inorder.size() - 1);
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> in={9,3,15,20,7}, po={9,15,7,20,3}; assert((S(Solution().buildTree(in,po))==vector<int>{3,9,20,N_,N_,15,7}));`,
},
{
  n: 117, t: 'Populating Next Right Pointers in Each Node II', d: 'M', k: 8,
  s: "Each node of a binary tree has an extra `next` pointer. Set each `next` to the node immediately to its right on the same level, or to `NULL` if there is none. The tree is **not** necessarily perfect. Try to use O(1) extra space.\n\n```cpp\nclass Node {\npublic:\n    int val;\n    Node *left, *right, *next;\n};\n```",
  i: 'root = [1,2,3,4,5,null,7]', o: '[1,#,2,3,#,4,5,7,#]  (# marks the end of each level)',
  a: 'Use the linked current level to build the next',
  why: "Once a level is linked through `next`, you can walk it like a linked list. While walking it, append each child to a dummy-headed list for the next level. When the walk ends, the next level is fully linked, so move down and repeat. No queue is needed.",
  ps: R`
level = root
while level:
    dummy = new node; tail = dummy
    for cur = level; cur; cur = cur.next:
        if cur.left:  tail.next = cur.left;  tail = tail.next
        if cur.right: tail.next = cur.right; tail = tail.next
    level = dummy.next
return root`,
  cpp: R`
class Solution {
public:
    Node* connect(Node* root) {
        Node* level = root;
        while (level) {
            Node dummy(0);
            Node* tail = &dummy;
            for (Node* cur = level; cur; cur = cur->next) {
                if (cur->left) { tail->next = cur->left; tail = tail->next; }
                if (cur->right) { tail->next = cur->right; tail = tail->next; }
            }
            level = dummy.next;
        }
        return root;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  pre: R`class Node { public: int val; Node *left, *right, *next; Node(int v): val(v), left(nullptr), right(nullptr), next(nullptr) {} };`,
  test: R`Node* n[8]; for(int i=1;i<=7;i++) n[i]=new Node(i); n[1]->left=n[2]; n[1]->right=n[3]; n[2]->left=n[4]; n[2]->right=n[5]; n[3]->right=n[7];
  Solution().connect(n[1]); string out; for(Node* l=n[1]; l; ){ Node* nl=nullptr; for(Node* c=l;c;c=c->next){ out+=to_string(c->val)+","; if(!nl) nl=c->left?c->left:c->right; } out+="#,"; l=nl; } assert(out=="1,#,2,3,#,4,5,7,#,"); assert(Solution().connect(nullptr)==nullptr);`,
},
{
  n: 114, t: 'Flatten Binary Tree to Linked List', d: 'M', k: 8,
  s: "Flatten a binary tree **in place** into a \"linked list\" that uses the `right` pointers, with every `left` pointer set to `null`. The list must follow the tree's **preorder**." + TREE,
  i: 'root = [1,2,5,3,4,null,6]', o: '[1,null,2,null,3,null,4,null,5,null,6]',
  a: 'Morris-style rewiring (O(1) space)',
  why: "In preorder, the right subtree comes right after the last node of the left subtree, which is the left subtree's rightmost node. For each node with a left child, attach the right subtree to that rightmost node, move the left subtree to the right, and clear `left`. Then move right.",
  ps: R`
cur = root
while cur:
    if cur.left:
        p = cur.left
        while p.right: p = p.right
        p.right = cur.right
        cur.right = cur.left
        cur.left = null
    cur = cur.right`,
  cpp: R`
class Solution {
public:
    void flatten(TreeNode* root) {
        for (TreeNode* cur = root; cur; cur = cur->right) {
            if (!cur->left) continue;
            TreeNode* p = cur->left;
            while (p->right) p = p->right;
            p->right = cur->right;
            cur->right = cur->left;
            cur->left = nullptr;
        }
    }
};`,
  tc: 'O(n), since each edge is walked at most twice', sc: 'O(1)',
  test: R`TreeNode* r=T({1,2,5,3,4,N_,6}); Solution().flatten(r); assert((S(r)==vector<int>{1,N_,2,N_,3,N_,4,N_,5,N_,6}));`,
},
{
  n: 112, t: 'Path Sum', d: 'E', k: 8,
  s: "Given the `root` of a binary tree and an integer `targetSum`, return `true` if some root-to-leaf path has values adding up to `targetSum`." + TREE,
  i: 'root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22', o: 'true', e: 'The path 5 → 4 → 11 → 2 sums to 22.',
  a: 'DFS, subtracting as you go',
  why: "Subtract each node's value from the target on the way down. At a leaf, the path works exactly when the remaining target equals the leaf's value.",
  ps: R`
has(node, t):
    if node is null: return false
    if node is a leaf: return node.val == t
    return has(node.left, t - node.val) or has(node.right, t - node.val)`,
  cpp: R`
class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        if (!root) return false;
        if (!root->left && !root->right) return root->val == targetSum;
        int rest = targetSum - root->val;
        return hasPathSum(root->left, rest) || hasPathSum(root->right, rest);
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().hasPathSum(T({5,4,8,11,N_,13,4,7,2,N_,N_,N_,1}),22) && !Solution().hasPathSum(T({1,2,3}),5) && !Solution().hasPathSum(nullptr,0));`,
},
{
  n: 129, t: 'Sum Root to Leaf Numbers', d: 'M', k: 8,
  s: "Each node holds a digit 0–9, and every root-to-leaf path spells a number, such as 1 → 2 → 3 spelling 123. Return the sum of all the root-to-leaf numbers." + TREE,
  i: 'root = [4,9,0,5,1]', o: '1026', e: '495 + 491 + 40 = 1026.',
  a: 'DFS carrying the number so far',
  why: "Pass the number built so far down the tree. At each node it becomes `cur * 10 + val`. At a leaf, that is one complete number. The total is the sum over both subtrees.",
  ps: R`
dfs(node, cur):
    if node is null: return 0
    cur = cur*10 + node.val
    if node is a leaf: return cur
    return dfs(node.left, cur) + dfs(node.right, cur)`,
  cpp: R`
class Solution {
    int dfs(TreeNode* node, int cur) {
        if (!node) return 0;
        cur = cur * 10 + node->val;
        if (!node->left && !node->right) return cur;
        return dfs(node->left, cur) + dfs(node->right, cur);
    }
public:
    int sumNumbers(TreeNode* root) { return dfs(root, 0); }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().sumNumbers(T({4,9,0,5,1}))==1026 && Solution().sumNumbers(T({1,2,3}))==25);`,
},
{
  n: 124, t: 'Binary Tree Maximum Path Sum', d: 'H', k: 8,
  s: "A path is a sequence of adjacent nodes in which no node appears twice. It does not need to pass through the root. Return the maximum sum of node values over any non-empty path. Values can be negative." + TREE,
  i: 'root = [-10,9,20,null,null,15,7]', o: '42', e: 'The path 15 → 20 → 7 sums to 42.',
  a: 'DFS returning the best downward branch',
  why: "Each node is the highest point of some paths. The best path that peaks at a node is `val + max(0, leftGain) + max(0, rightGain)`, and that updates the global answer. To its parent, the node can only offer **one** branch, so it returns `val + max(0, max(leftGain, rightGain))`. Negative gains are dropped by clamping them to 0.",
  ps: R`
best = -infinity
gain(node):
    if node is null: return 0
    l = max(0, gain(node.left)); r = max(0, gain(node.right))
    best = max(best, node.val + l + r)
    return node.val + max(l, r)
gain(root); return best`,
  cpp: R`
class Solution {
    int best = INT_MIN;
    int gain(TreeNode* node) {
        if (!node) return 0;
        int l = max(0, gain(node->left));
        int r = max(0, gain(node->right));
        best = max(best, node->val + l + r);
        return node->val + max(l, r);
    }
public:
    int maxPathSum(TreeNode* root) {
        gain(root);
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`assert(Solution().maxPathSum(T({-10,9,20,N_,N_,15,7}))==42 && Solution().maxPathSum(T({1,2,3}))==6 && Solution().maxPathSum(T({-3}))==-3);`,
},
{
  n: 173, t: 'Binary Search Tree Iterator', d: 'M', k: 8,
  s: "Implement `BSTIterator`, which walks a BST in order, from smallest to largest:\n- `BSTIterator(root)` initializes the iterator.\n- `next()` returns the next smallest value.\n- `hasNext()` returns whether a next value exists.\n\nBoth operations should take O(1) amortized time and O(h) memory." + TREE,
  i: '["BSTIterator","next","next","hasNext","next","hasNext","next","hasNext","next","hasNext"]\n        [[[7,3,15,null,null,9,20]],[],[],[],[],[],[],[],[],[]]',
  o: '[null,3,7,true,9,true,15,true,20,false]',
  a: 'Controlled inorder with a stack',
  why: "Run an iterative inorder traversal one step at a time. The stack holds the path of left children leading to the next smallest node. `next()` pops that node and pushes the left spine of its right subtree. Each node is pushed and popped once, so the cost is O(1) amortized.",
  ps: R`
init: pushLeft(root)
pushLeft(n): while n: push n; n = n.left
next():
    node = pop()
    pushLeft(node.right)
    return node.val
hasNext(): return stack not empty`,
  cpp: R`
class BSTIterator {
    stack<TreeNode*> st;
    void pushLeft(TreeNode* n) {
        for (; n; n = n->left) st.push(n);
    }
public:
    BSTIterator(TreeNode* root) { pushLeft(root); }

    int next() {
        TreeNode* node = st.top();
        st.pop();
        pushLeft(node->right);
        return node->val;
    }

    bool hasNext() { return !st.empty(); }
};`,
  tc: 'O(1) amortized per call', sc: 'O(h)',
  test: R`BSTIterator it(T({7,3,15,N_,N_,9,20})); assert(it.next()==3 && it.next()==7 && it.hasNext() && it.next()==9 && it.hasNext() && it.next()==15 && it.hasNext() && it.next()==20 && !it.hasNext());`,
},
{
  n: 222, t: 'Count Complete Tree Nodes', d: 'E', k: 8,
  s: "Given the `root` of a **complete** binary tree, return the number of nodes. In a complete tree, every level except possibly the last is full, and the last level is filled from the left. Do it in less than O(n) time." + TREE,
  i: 'root = [1,2,3,4,5,6]', o: '6',
  a: 'Compare the leftmost and rightmost heights',
  why: "Measure the height down the leftmost path and down the rightmost path. If they are equal, the tree is perfect and has `2^h - 1` nodes. Otherwise, recurse into both children. At least one of them is perfect and returns right away, so there are O(log n) levels, each costing O(log n).",
  ps: R`
count(node):
    if node is null: return 0
    lh = height following left links; rh = height following right links
    if lh == rh: return 2^lh - 1
    return 1 + count(node.left) + count(node.right)`,
  cpp: R`
class Solution {
public:
    int countNodes(TreeNode* root) {
        if (!root) return 0;
        int lh = 0, rh = 0;
        for (TreeNode* p = root; p; p = p->left) lh++;
        for (TreeNode* p = root; p; p = p->right) rh++;
        if (lh == rh) return (1 << lh) - 1;
        return 1 + countNodes(root->left) + countNodes(root->right);
    }
};`,
  tc: 'O(log² n)', sc: 'O(log n)',
  test: R`assert(Solution().countNodes(T({1,2,3,4,5,6}))==6 && Solution().countNodes(nullptr)==0 && Solution().countNodes(T({1}))==1 && Solution().countNodes(T({1,2,3,4,5,6,7}))==7);`,
},
{
  n: 236, t: 'Lowest Common Ancestor of a Binary Tree', d: 'M', k: 8,
  s: "Given a binary tree and two of its nodes `p` and `q`, return their **lowest common ancestor**: the deepest node that has both `p` and `q` as descendants. A node counts as a descendant of itself." + TREE,
  i: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', o: '3',
  a: 'Post-order search',
  why: "Search both subtrees. If the current node is `p` or `q`, return it. If `p` and `q` are found in different subtrees, the current node is where their paths split, so it is the LCA. Otherwise, pass up whichever side found something.",
  ps: R`
lca(node):
    if node is null or node == p or node == q: return node
    l = lca(node.left); r = lca(node.right)
    if l and r: return node
    return l ? l : r`,
  cpp: R`
class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* l = lowestCommonAncestor(root->left, p, q);
        TreeNode* r = lowestCommonAncestor(root->right, p, q);
        if (l && r) return root;
        return l ? l : r;
    }
};`,
  tc: 'O(n)', sc: 'O(h)',
  test: R`TreeNode* r=T({3,5,1,6,2,0,8,N_,N_,7,4}); assert(Solution().lowestCommonAncestor(r,F(r,5),F(r,1))->val==3); assert(Solution().lowestCommonAncestor(r,F(r,5),F(r,4))->val==5); assert(Solution().lowestCommonAncestor(r,F(r,7),F(r,8))->val==3);`,
},
  ]);
})();
