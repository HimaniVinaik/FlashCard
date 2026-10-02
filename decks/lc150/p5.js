/* LC150 part 5: Divide & Conquer, Kadane, Binary Search, Heap, Bit Manipulation */
(function () {
  const R = String.raw;
  const LIST = "\n\n```cpp\n// Definition used by LeetCode:\nstruct ListNode {\n    int val;\n    ListNode *next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n```";
  const TREE = "\n\n```cpp\n// Definition used by LeetCode:\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n```";
  LC150.add([
{
  n: 108, t: 'Convert Sorted Array to Binary Search Tree', d: 'E', k: 15,
  s: "Given an integer array `nums` sorted in ascending order, convert it into a **height-balanced** binary search tree, meaning the depths of every node's two subtrees differ by at most 1." + TREE,
  i: 'nums = [-10,-3,0,5,9]', o: '[0,-3,9,-10,null,5]  (other balanced answers are accepted)',
  a: 'Divide and conquer on the middle element',
  why: "Make the middle element the root. Then the two halves differ in size by at most one, which keeps the tree balanced. Everything to the left is smaller and everything to the right is larger, so building each half recursively gives a valid BST.",
  ps: R`
build(lo, hi):
    if lo > hi: return null
    mid = (lo + hi) / 2
    root = node(nums[mid])
    root.left = build(lo, mid-1)
    root.right = build(mid+1, hi)
    return root`,
  cpp: R`
class Solution {
    TreeNode* build(vector<int>& nums, int lo, int hi) {
        if (lo > hi) return nullptr;
        int mid = lo + (hi - lo) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = build(nums, lo, mid - 1);
        root->right = build(nums, mid + 1, hi);
        return root;
    }
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums, 0, (int)nums.size() - 1);
    }
};`,
  tc: 'O(n)', sc: 'O(log n) recursion',
  test: R`vector<int> a={-10,-3,0,5,9}; TreeNode* r=Solution().sortedArrayToBST(a); vector<int> in; function<void(TreeNode*)> io=[&](TreeNode* x){ if(!x) return; io(x->left); in.push_back(x->val); io(x->right); }; io(r); assert(in==a);
  function<int(TreeNode*)> h=[&](TreeNode* x)->int{ if(!x) return 0; int l=h(x->left), rr=h(x->right); assert(abs(l-rr)<=1); return 1+max(l,rr); }; h(r); vector<int> b={1,3}; assert(S(Solution().sortedArrayToBST(b)).size()>=2);`,
},
{
  n: 148, t: 'Sort List', d: 'M', k: 15,
  s: "Given the `head` of a linked list, return the list sorted in ascending order. Aim for O(n log n) time." + LIST,
  i: 'head = [4,2,1,3]', o: '[1,2,3,4]',
  a: 'Merge sort on the list',
  why: "Merge sort suits linked lists: splitting needs no random access, and merging two sorted lists is O(1) extra space by relinking nodes. Find the middle with slow and fast pointers, cut the list there, sort both halves recursively, and merge them.",
  ps: R`
sort(head):
    if head is null or head.next is null: return head
    slow = head, fast = head.next
    while fast and fast.next: slow = slow.next; fast = fast.next.next
    second = slow.next; slow.next = null
    return merge(sort(head), sort(second))`,
  cpp: R`
class Solution {
    ListNode* merge(ListNode* a, ListNode* b) {
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
public:
    ListNode* sortList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode *slow = head, *fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* second = slow->next;
        slow->next = nullptr;
        return merge(sortList(head), sortList(second));
    }
};`,
  tc: 'O(n log n)', sc: 'O(log n) recursion',
  test: R`assert((V(Solution().sortList(L({4,2,1,3})))==vector<int>{1,2,3,4})); assert((V(Solution().sortList(L({-1,5,3,4,0})))==vector<int>{-1,0,3,4,5})); assert(Solution().sortList(nullptr)==nullptr);`,
},
{
  n: 427, t: 'Construct Quad Tree', d: 'M', k: 15,
  s: "Given an `n × n` grid of 0s and 1s, where n is a power of 2, build its quad tree. A node is a leaf with value `val` if its whole square has that one value. Otherwise it is an internal node with four children: `topLeft`, `topRight`, `bottomLeft` and `bottomRight`, one for each quarter.\n\n```cpp\nclass Node {\npublic:\n    bool val, isLeaf;\n    Node *topLeft, *topRight, *bottomLeft, *bottomRight;\n};\n```",
  i: 'grid = [[0,1],[1,0]]', o: '[[0,1],[1,0],[1,1],[1,1],[1,0]]  (each node as [isLeaf, val])',
  a: 'Divide into quadrants, merge uniform children',
  why: "Build the four quadrants recursively. If all four children are leaves with the same value, the whole square is uniform, so replace them with a single leaf. Otherwise, return an internal node with those four children. Single cells are the base case.",
  ps: R`
build(r, c, size):
    if size == 1: return leaf(grid[r][c])
    h = size / 2
    tl, tr, bl, br = build each quadrant
    if all four are leaves with equal val: return leaf(val)
    return internal(tl, tr, bl, br)`,
  cpp: R`
class Solution {
    Node* build(vector<vector<int>>& g, int r, int c, int n) {
        if (n == 1) return new Node(g[r][c] == 1, true);
        int h = n / 2;
        Node* tl = build(g, r, c, h);
        Node* tr = build(g, r, c + h, h);
        Node* bl = build(g, r + h, c, h);
        Node* br = build(g, r + h, c + h, h);
        if (tl->isLeaf && tr->isLeaf && bl->isLeaf && br->isLeaf &&
            tl->val == tr->val && tr->val == bl->val && bl->val == br->val) {
            bool v = tl->val;
            delete tl; delete tr; delete bl; delete br;
            return new Node(v, true);
        }
        return new Node(true, false, tl, tr, bl, br);
    }
public:
    Node* construct(vector<vector<int>>& grid) {
        return build(grid, 0, 0, grid.size());
    }
};`,
  tc: 'O(n²)', sc: 'O(log n) recursion, plus the tree',
  pre: R`class Node { public: bool val, isLeaf; Node *topLeft, *topRight, *bottomLeft, *bottomRight;
    Node(bool v, bool leaf): val(v), isLeaf(leaf), topLeft(nullptr), topRight(nullptr), bottomLeft(nullptr), bottomRight(nullptr) {}
    Node(bool v, bool leaf, Node* a, Node* b, Node* c, Node* d): val(v), isLeaf(leaf), topLeft(a), topRight(b), bottomLeft(c), bottomRight(d) {} };`,
  test: R`auto ser=[](Node* root){ vector<string> out; queue<Node*> q; q.push(root); while(!q.empty()){ Node* x=q.front(); q.pop(); if(!x){ out.push_back("null"); continue; } out.push_back(string("[")+(x->isLeaf?"1":"0")+","+(x->isLeaf?(x->val?"1":"0"):"1")+"]"); if(!x->isLeaf){ q.push(x->topLeft); q.push(x->topRight); q.push(x->bottomLeft); q.push(x->bottomRight);} } string s; for(auto& t:out) s+=t; return s; };
  vector<vector<int>> g={{0,1},{1,0}}; assert(ser(Solution().construct(g))=="[0,1][1,0][1,1][1,1][1,0]");
  vector<vector<int>> g2={{1,1},{1,1}}; Node* r2=Solution().construct(g2); assert(r2->isLeaf && r2->val);
  vector<vector<int>> g3={{1,1,0,0},{1,1,0,0},{0,0,1,1},{0,0,1,0}}; Node* r3=Solution().construct(g3); assert(!r3->isLeaf && r3->topLeft->isLeaf && r3->topLeft->val && !r3->bottomRight->isLeaf);`,
},
{
  n: 23, t: 'Merge k Sorted Lists', d: 'H', k: 15,
  s: "You are given an array of `k` linked lists, each sorted in ascending order. Merge them into one sorted linked list and return it." + LIST,
  i: 'lists = [[1,4,5],[1,3,4],[2,6]]', o: '[1,1,2,3,4,4,5,6]',
  a: 'Min-heap of list heads',
  why: "The next node of the result is always the smallest of the k current heads. Keep the heads in a min-heap. Pop the smallest, append it to the result, and push its successor. Each of the N nodes costs O(log k). Merging the lists in pairs, divide-and-conquer style, has the same complexity.",
  ps: R`
heap = all non-null heads, keyed by val
dummy; tail = dummy
while heap:
    node = pop min
    tail.next = node; tail = node
    if node.next: push node.next
return dummy.next`,
  cpp: R`
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);
        for (ListNode* l : lists)
            if (l) pq.push(l);
        ListNode dummy(0);
        ListNode* tail = &dummy;
        while (!pq.empty()) {
            ListNode* node = pq.top();
            pq.pop();
            tail->next = node;
            tail = node;
            if (node->next) pq.push(node->next);
        }
        return dummy.next;
    }
};`,
  tc: 'O(N log k), with N nodes in total', sc: 'O(k)',
  test: R`vector<ListNode*> ls={L({1,4,5}),L({1,3,4}),L({2,6})}; assert((V(Solution().mergeKLists(ls))==vector<int>{1,1,2,3,4,4,5,6})); vector<ListNode*> e={}; assert(Solution().mergeKLists(e)==nullptr); vector<ListNode*> e2={nullptr}; assert(Solution().mergeKLists(e2)==nullptr);`,
},
{
  n: 53, t: 'Maximum Subarray', d: 'M', k: 16,
  s: "Given an integer array `nums`, find the non-empty contiguous subarray with the largest sum and return that sum.",
  i: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', o: '6', e: 'The subarray [4,-1,2,1] has the largest sum, 6.',
  a: "Kadane's algorithm",
  why: "Let `cur` be the best sum of a subarray that ends at index i. It either extends the best subarray ending at i − 1, or starts fresh at `nums[i]`, whichever is larger. If the previous sum is negative, starting fresh wins. The answer is the largest `cur` seen.",
  ps: R`
cur = best = nums[0]
for x in nums[1:]:
    cur = max(x, cur + x)
    best = max(best, cur)
return best`,
  cpp: R`
class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur = nums[0], best = nums[0];
        for (int i = 1; i < (int)nums.size(); i++) {
            cur = max(nums[i], cur + nums[i]);
            best = max(best, cur);
        }
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={-2,1,-3,4,-1,2,1,-5,4}, b={1}, c={5,4,-1,7,8}, d={-3,-1,-2}; assert(Solution().maxSubArray(a)==6 && Solution().maxSubArray(b)==1 && Solution().maxSubArray(c)==23 && Solution().maxSubArray(d)==-1);`,
},
{
  n: 918, t: 'Maximum Sum Circular Subarray', d: 'M', k: 16,
  s: "Given a **circular** integer array `nums`, where the end wraps around to the start, return the maximum possible sum of a non-empty subarray. Each element can be used at most once.",
  i: 'nums = [5,-3,5]', o: '10', e: 'The subarray [5,5] wraps around the end.',
  a: 'Kadane for both the max and the min',
  why: "The best subarray either does not wrap, which is plain Kadane's maximum, or it wraps. A wrapping subarray is everything except some middle block, so its sum is `total - minSubarray`. Take the larger of the two. If every number is negative, the min subarray is the whole array and would leave nothing, so return the plain maximum.",
  ps: R`
curMax = curMin = 0; maxS = -inf; minS = +inf; total = 0
for x in nums:
    curMax = max(x, curMax + x); maxS = max(maxS, curMax)
    curMin = min(x, curMin + x); minS = min(minS, curMin)
    total += x
return maxS < 0 ? maxS : max(maxS, total - minS)`,
  cpp: R`
class Solution {
public:
    int maxSubarraySumCircular(vector<int>& nums) {
        int curMax = 0, curMin = 0, maxS = INT_MIN, minS = INT_MAX, total = 0;
        for (int x : nums) {
            curMax = max(x, curMax + x);
            maxS = max(maxS, curMax);
            curMin = min(x, curMin + x);
            minS = min(minS, curMin);
            total += x;
        }
        return maxS < 0 ? maxS : max(maxS, total - minS);
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={1,-2,3,-2}, b={5,-3,5}, c={-3,-2,-3}; assert(Solution().maxSubarraySumCircular(a)==3 && Solution().maxSubarraySumCircular(b)==10 && Solution().maxSubarraySumCircular(c)==-2);`,
},
{
  n: 35, t: 'Search Insert Position', d: 'E', k: 17,
  s: "Given a sorted array of distinct integers `nums` and a `target`, return the index of `target` if it is present. Otherwise, return the index where it would be inserted to keep the array sorted. Run in O(log n).",
  i: 'nums = [1,3,5,6], target = 5', o: '2',
  a: 'Binary search for the lower bound',
  why: "Both cases ask for the same thing: the first index whose value is at least `target`. Binary search keeps a half-open range `[lo, hi)` that always contains that index, and shrinks it until it is a single position.",
  ps: R`
lo = 0, hi = n
while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] < target: lo = mid + 1
    else: hi = mid
return lo`,
  cpp: R`
class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int lo = 0, hi = nums.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < target) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`vector<int> a={1,3,5,6}; assert(Solution().searchInsert(a,5)==2 && Solution().searchInsert(a,2)==1 && Solution().searchInsert(a,7)==4 && Solution().searchInsert(a,0)==0);`,
},
{
  n: 74, t: 'Search a 2D Matrix', d: 'M', k: 17,
  s: "In an `m × n` matrix, each row is sorted, and each row's first value is greater than the previous row's last value. Return `true` if `target` is in the matrix. Run in O(log(m · n)).",
  i: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', o: 'true',
  a: 'Binary search over the flattened matrix',
  why: "Read row by row, the matrix is one sorted array of length m · n. Binary search over indices 0 to m·n − 1, mapping index `i` to `matrix[i / n][i % n]`.",
  ps: R`
lo = 0, hi = m*n - 1
while lo <= hi:
    mid = (lo + hi) / 2
    v = matrix[mid / n][mid % n]
    if v == target: return true
    if v < target: lo = mid + 1
    else: hi = mid - 1
return false`,
  cpp: R`
class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int lo = 0, hi = m * n - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            int v = matrix[mid / n][mid % n];
            if (v == target) return true;
            if (v < target) lo = mid + 1;
            else hi = mid - 1;
        }
        return false;
    }
};`,
  tc: 'O(log(m · n))', sc: 'O(1)',
  test: R`vector<vector<int>> m={{1,3,5,7},{10,11,16,20},{23,30,34,60}}; assert(Solution().searchMatrix(m,3) && !Solution().searchMatrix(m,13) && Solution().searchMatrix(m,60) && !Solution().searchMatrix(m,0));`,
},
{
  n: 162, t: 'Find Peak Element', d: 'M', k: 17,
  s: "A peak element is strictly greater than its neighbors. Given `nums`, where neighbors are never equal and `nums[-1] = nums[n] = -∞`, return the index of **any** peak. Run in O(log n).",
  i: 'nums = [1,2,1,3,5,6,4]', o: '5  (index 1 is also a valid answer)',
  a: 'Binary search on the slope',
  why: "If `nums[mid] < nums[mid + 1]`, you are on an upward slope. Because the edges are −∞, some peak must lie to the right of mid. Otherwise, mid itself or something to its left is a peak. Each comparison keeps a half that is guaranteed to contain a peak.",
  ps: R`
lo = 0, hi = n-1
while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] < nums[mid+1]: lo = mid + 1
    else: hi = mid
return lo`,
  cpp: R`
class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < nums[mid + 1]) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`auto peak=[](vector<int> v){ int i=Solution().findPeakElement(v); long long l=i?v[i-1]:LLONG_MIN, r=i+1<(int)v.size()?v[i+1]:LLONG_MIN; return v[i]>l && v[i]>r; }; assert(peak({1,2,1,3,5,6,4}) && peak({1,2,3,1}) && peak({1}) && peak({3,2,1}) && peak({1,2}));`,
},
{
  n: 33, t: 'Search in Rotated Sorted Array', d: 'M', k: 17,
  s: "A sorted array of distinct integers `nums` may have been rotated at an unknown pivot, so `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`. Return the index of `target`, or `-1` if it is not present. Run in O(log n).",
  i: 'nums = [4,5,6,7,0,1,2], target = 0', o: '4',
  a: 'Binary search, using the sorted half',
  why: "At any mid, at least one half, `[lo, mid]` or `[mid, hi]`, is sorted. You can tell which by comparing `nums[lo]` with `nums[mid]`. If the target falls within the sorted half's range, search there. Otherwise, search the other half.",
  ps: R`
lo = 0, hi = n-1
while lo <= hi:
    mid = (lo + hi) / 2
    if nums[mid] == target: return mid
    if nums[lo] <= nums[mid]:            # left half is sorted
        if nums[lo] <= target < nums[mid]: hi = mid - 1
        else: lo = mid + 1
    else:                                # right half is sorted
        if nums[mid] < target <= nums[hi]: lo = mid + 1
        else: hi = mid - 1
return -1`,
  cpp: R`
class Solution {
public:
    int search(vector<int>& nums, int target) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] == target) return mid;
            if (nums[lo] <= nums[mid]) {
                if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                else lo = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                else hi = mid - 1;
            }
        }
        return -1;
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`vector<int> a={4,5,6,7,0,1,2}, b={1}, c={3,1}; assert(Solution().search(a,0)==4 && Solution().search(a,3)==-1 && Solution().search(b,0)==-1 && Solution().search(c,1)==1 && Solution().search(a,4)==0 && Solution().search(a,2)==6);`,
},
{
  n: 34, t: 'Find First and Last Position of Element in Sorted Array', d: 'M', k: 17,
  s: "Given a sorted array `nums`, return the first and last index of `target` as `[first, last]`, or `[-1, -1]` if it is not present. Run in O(log n).",
  i: 'nums = [5,7,7,8,8,10], target = 8', o: '[3,4]',
  a: 'Two lower-bound binary searches',
  why: "The first position is the lower bound of `target`: the first index with value ≥ target. The last position is the lower bound of `target + 1`, minus one. If the first position is past the end or does not hold `target`, the target is missing.",
  ps: R`
lb(x): first index i with nums[i] >= x (binary search)
first = lb(target)
if first == n or nums[first] != target: return [-1, -1]
return [first, lb(target + 1) - 1]`,
  cpp: R`
class Solution {
    int lowerBound(vector<int>& nums, long long x) {
        int lo = 0, hi = nums.size();
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        return lo;
    }
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int first = lowerBound(nums, target);
        if (first == (int)nums.size() || nums[first] != target) return {-1, -1};
        return {first, lowerBound(nums, (long long)target + 1) - 1};
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`vector<int> a={5,7,7,8,8,10}, b={}, c={1}; assert((Solution().searchRange(a,8)==vector<int>{3,4}) && (Solution().searchRange(a,6)==vector<int>{-1,-1}) && (Solution().searchRange(b,0)==vector<int>{-1,-1}) && (Solution().searchRange(c,1)==vector<int>{0,0}));`,
},
{
  n: 153, t: 'Find Minimum in Rotated Sorted Array', d: 'M', k: 17,
  s: "A sorted array of **unique** elements has been rotated between 1 and n times, so `[0,1,2,4,5,6,7]` might become `[4,5,6,7,0,1,2]`. Return its minimum element in O(log n) time.",
  i: 'nums = [3,4,5,1,2]', o: '1',
  a: 'Binary search against the right end',
  why: "Compare `nums[mid]` with `nums[hi]`. If it is larger, the rotation point and the minimum are to the right of mid. Otherwise, the range `[mid, hi]` is sorted, so the minimum is at mid or to its left. Shrink the range until a single element remains.",
  ps: R`
lo = 0, hi = n-1
while lo < hi:
    mid = (lo + hi) / 2
    if nums[mid] > nums[hi]: lo = mid + 1
    else: hi = mid
return nums[lo]`,
  cpp: R`
class Solution {
public:
    int findMin(vector<int>& nums) {
        int lo = 0, hi = (int)nums.size() - 1;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (nums[mid] > nums[hi]) lo = mid + 1;
            else hi = mid;
        }
        return nums[lo];
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`vector<int> a={3,4,5,1,2}, b={4,5,6,7,0,1,2}, c={11,13,15,17}, d={2,1}; assert(Solution().findMin(a)==1 && Solution().findMin(b)==0 && Solution().findMin(c)==11 && Solution().findMin(d)==1);`,
},
{
  n: 4, t: 'Median of Two Sorted Arrays', d: 'H', k: 17,
  s: "Given two sorted arrays `nums1` and `nums2`, of sizes m and n, return the median of the two arrays combined. Run in **O(log(m + n))** time.",
  i: 'nums1 = [1,3], nums2 = [2]', o: '2.00000', e: 'The merged array is [1,2,3], so the median is 2.',
  a: 'Binary search the partition of the smaller array',
  why: "Split both arrays so the left parts together hold half of all the elements. If you take `i` elements from A, you must take `j = half - i` from B. The split is correct when `A[i-1] <= B[j]` and `B[j-1] <= A[i]`. Binary search on `i` in the smaller array: if `A[i-1]` is too big, move left, otherwise move right. The median then comes from the largest value on the left side and the smallest on the right.",
  ps: R`
ensure A is the smaller array
lo = 0, hi = m, half = (m + n + 1) / 2
while lo <= hi:
    i = (lo + hi) / 2; j = half - i
    aL, aR = A[i-1], A[i]   (use ±inf past the edges)
    bL, bR = B[j-1], B[j]
    if aL <= bR and bL <= aR:
        if (m+n) is odd: return max(aL, bL)
        return (max(aL, bL) + min(aR, bR)) / 2
    if aL > bR: hi = i - 1
    else: lo = i + 1`,
  cpp: R`
class Solution {
public:
    double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
        if (a.size() > b.size()) return findMedianSortedArrays(b, a);
        int m = a.size(), n = b.size(), half = (m + n + 1) / 2;
        int lo = 0, hi = m;
        while (lo <= hi) {
            int i = lo + (hi - lo) / 2, j = half - i;
            int aL = i == 0 ? INT_MIN : a[i - 1];
            int aR = i == m ? INT_MAX : a[i];
            int bL = j == 0 ? INT_MIN : b[j - 1];
            int bR = j == n ? INT_MAX : b[j];
            if (aL <= bR && bL <= aR) {
                if ((m + n) % 2) return max(aL, bL);
                return ((double)max(aL, bL) + min(aR, bR)) / 2.0;
            }
            if (aL > bR) hi = i - 1;
            else lo = i + 1;
        }
        return 0.0;
    }
};`,
  tc: 'O(log(min(m, n)))', sc: 'O(1)',
  test: R`vector<int> a={1,3}, b={2}, c={1,2}, d={3,4}, e={}, f={1}, g={2,3,4,5,6}; assert(fabs(Solution().findMedianSortedArrays(a,b)-2.0)<1e-9 && fabs(Solution().findMedianSortedArrays(c,d)-2.5)<1e-9 && fabs(Solution().findMedianSortedArrays(e,f)-1.0)<1e-9 && fabs(Solution().findMedianSortedArrays(f,g)-3.5)<1e-9);`,
},
{
  n: 215, t: 'Kth Largest Element in an Array', d: 'M', k: 18,
  s: "Given an integer array `nums` and an integer `k`, return the `k`-th largest element: the k-th largest in sorted order, not the k-th distinct value. Can you solve it without sorting?",
  i: 'nums = [3,2,1,5,6,4], k = 2', o: '5',
  a: 'Min-heap of size k',
  why: "Keep the k largest values seen so far in a min-heap. When a new value is larger than the heap's minimum, it replaces it. At the end, the heap's minimum is the k-th largest. Quickselect, using `nth_element`, averages O(n) but is O(n²) in the worst case.",
  ps: R`
heap = empty min-heap
for x in nums:
    push x
    if size > k: pop min
return heap.top`,
  cpp: R`
class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;
        for (int x : nums) {
            heap.push(x);
            if ((int)heap.size() > k) heap.pop();
        }
        return heap.top();
    }
};`,
  tc: 'O(n log k)', sc: 'O(k)',
  test: R`vector<int> a={3,2,1,5,6,4}, b={3,2,3,1,2,4,5,5,6}; assert(Solution().findKthLargest(a,2)==5 && Solution().findKthLargest(b,4)==4);`,
},
{
  n: 502, t: 'IPO', d: 'H', k: 18,
  s: "You start with capital `w` and may finish at most `k` distinct projects. Project `i` needs at least `capital[i]` to start and adds `profits[i]` to your capital when finished. Return the maximum capital you can end with.",
  i: 'k = 2, w = 0, profits = [1,2,3], capital = [0,1,1]', o: '4', e: 'Do project 0 (capital becomes 1), then project 2 (capital becomes 4).',
  a: 'Sort by capital + max-heap of profits',
  why: "Choosing greedily works: whenever you can pick a project, the most profitable affordable one is best, because more capital only unlocks more options. Sort the projects by required capital. Before each pick, push the profit of every newly affordable project into a max-heap, then take the top. Stop early if nothing is affordable.",
  ps: R`
projects = sort (capital, profit) by capital
i = 0; heap = max-heap
repeat k times:
    while i < n and projects[i].capital <= w: push projects[i].profit; i++
    if heap empty: break
    w += pop max
return w`,
  cpp: R`
class Solution {
public:
    int findMaximizedCapital(int k, int w, vector<int>& profits,
                             vector<int>& capital) {
        int n = profits.size();
        vector<pair<int, int>> proj(n);
        for (int i = 0; i < n; i++) proj[i] = {capital[i], profits[i]};
        sort(proj.begin(), proj.end());
        priority_queue<int> heap;
        int i = 0;
        while (k--) {
            while (i < n && proj[i].first <= w) heap.push(proj[i++].second);
            if (heap.empty()) break;
            w += heap.top();
            heap.pop();
        }
        return w;
    }
};`,
  tc: 'O(n log n + k log n)', sc: 'O(n)',
  test: R`vector<int> p={1,2,3}, c={0,1,1}, c2={0,1,2}; assert(Solution().findMaximizedCapital(2,0,p,c)==4 && Solution().findMaximizedCapital(3,0,p,c2)==6); vector<int> p3={1,2,3}, c3={1,1,2}; assert(Solution().findMaximizedCapital(1,0,p3,c3)==0);`,
},
{
  n: 373, t: 'Find K Pairs with Smallest Sums', d: 'M', k: 18,
  s: "Given two arrays `nums1` and `nums2`, both sorted in ascending order, and an integer `k`, return the `k` pairs `[u, v]` with u from `nums1` and v from `nums2` that have the smallest sums.",
  i: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3', o: '[[1,2],[1,4],[1,6]]',
  a: 'Min-heap frontier',
  why: "Picture a grid where cell `(i, j)` holds `nums1[i] + nums2[j]`. Every row and column is sorted. Seed a min-heap with `(i, 0)` for the first k values of i. Each time you pop `(i, j)`, its natural successor in that row is `(i, j+1)`. The heap always holds the next smallest candidate, so k pops give the answer.",
  ps: R`
heap = {(nums1[i] + nums2[0], i, 0) for i < min(k, m)}
while k > 0 and heap:
    (s, i, j) = pop min
    res.add([nums1[i], nums2[j]]); k--
    if j + 1 < n: push (nums1[i] + nums2[j+1], i, j+1)
return res`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2,
                                       int k) {
        using T = tuple<long long, int, int>;
        priority_queue<T, vector<T>, greater<T>> pq;
        int m = nums1.size(), n = nums2.size();
        for (int i = 0; i < min(m, k); i++)
            pq.push({(long long)nums1[i] + nums2[0], i, 0});
        vector<vector<int>> res;
        while (k-- > 0 && !pq.empty()) {
            auto [s, i, j] = pq.top();
            pq.pop();
            res.push_back({nums1[i], nums2[j]});
            if (j + 1 < n) pq.push({(long long)nums1[i] + nums2[j + 1], i, j + 1});
        }
        return res;
    }
};`,
  tc: 'O(k log k)', sc: 'O(k)',
  test: R`vector<int> a={1,7,11}, b={2,4,6}; assert((Solution().kSmallestPairs(a,b,3)==vector<vector<int>>{{1,2},{1,4},{1,6}})); vector<int> c={1,1,2}, d={1,2,3}; auto r=Solution().kSmallestPairs(c,d,2); assert(r.size()==2 && r[0][0]+r[0][1]==2 && r[1][0]+r[1][1]==2);`,
},
{
  n: 295, t: 'Find Median from Data Stream', d: 'H', k: 18,
  s: "Design `MedianFinder`:\n- `addNum(num)` adds an integer from the data stream.\n- `findMedian()` returns the median of all numbers added so far. With an even count, that is the mean of the two middle values.",
  i: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n        [[],[1],[2],[],[3],[]]',
  o: '[null,null,null,1.5,null,2.0]',
  a: 'Two heaps (low max-heap, high min-heap)',
  why: "Keep the smaller half of the numbers in a max-heap `lo` and the larger half in a min-heap `hi`. Keep `lo` the same size as `hi` or one element bigger. The median is then `lo.top()`, or the mean of the two tops. To add a number, push it into `lo`, move `lo`'s largest value to `hi`, and move one back if `hi` became bigger.",
  ps: R`
addNum(x):
    lo.push(x)
    hi.push(lo.pop())          # keeps every lo value <= every hi value
    if hi.size > lo.size: lo.push(hi.pop())
findMedian():
    return lo.size > hi.size ? lo.top : (lo.top + hi.top) / 2`,
  cpp: R`
class MedianFinder {
    priority_queue<int> lo;                             // max-heap
    priority_queue<int, vector<int>, greater<int>> hi;  // min-heap
public:
    MedianFinder() {}

    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top());
        lo.pop();
        if (hi.size() > lo.size()) {
            lo.push(hi.top());
            hi.pop();
        }
    }

    double findMedian() {
        if (lo.size() > hi.size()) return lo.top();
        return ((double)lo.top() + hi.top()) / 2.0;
    }
};`,
  tc: 'O(log n) to add, O(1) to find the median', sc: 'O(n)',
  test: R`MedianFinder m; m.addNum(1); m.addNum(2); assert(fabs(m.findMedian()-1.5)<1e-9); m.addNum(3); assert(fabs(m.findMedian()-2.0)<1e-9); m.addNum(-5); m.addNum(10); assert(fabs(m.findMedian()-2.0)<1e-9);`,
},
{
  n: 67, t: 'Add Binary', d: 'E', k: 19,
  s: "Given two binary strings `a` and `b`, return their sum as a binary string.",
  i: 'a = "11", b = "1"', o: '"100"',
  a: 'Digit-by-digit addition with carry',
  why: "Add from the rightmost digits, like long addition in base 2. At each step, the digit to write is `sum % 2` and the carry is `sum / 2`. Build the result backwards, then reverse it.",
  ps: R`
i = len(a)-1, j = len(b)-1, carry = 0, out = ""
while i >= 0 or j >= 0 or carry:
    s = carry + (a[i--] if i >= 0) + (b[j--] if j >= 0)
    out += s % 2; carry = s / 2
return reverse(out)`,
  cpp: R`
class Solution {
public:
    string addBinary(string a, string b) {
        string out;
        int i = (int)a.size() - 1, j = (int)b.size() - 1, carry = 0;
        while (i >= 0 || j >= 0 || carry) {
            int s = carry;
            if (i >= 0) s += a[i--] - '0';
            if (j >= 0) s += b[j--] - '0';
            out.push_back('0' + s % 2);
            carry = s / 2;
        }
        reverse(out.begin(), out.end());
        return out;
    }
};`,
  tc: 'O(max(m, n))', sc: 'O(max(m, n))',
  test: R`assert(Solution().addBinary("11","1")=="100" && Solution().addBinary("1010","1011")=="10101" && Solution().addBinary("0","0")=="0");`,
},
{
  n: 190, t: 'Reverse Bits', d: 'E', k: 19,
  s: "Reverse the bits of a 32-bit unsigned integer.",
  i: 'n = 00000010100101000001111010011100  (43261596)', o: '964176192  (00111001011110000010100101000000)',
  a: 'Shift bits out and in',
  why: "Take the lowest bit of `n` 32 times. Each time, shift the result left and add that bit. The first bit taken ends up as the highest bit, which reverses the order.",
  ps: R`
res = 0
repeat 32 times:
    res = (res << 1) | (n & 1)
    n >>= 1
return res`,
  cpp: R`
class Solution {
public:
    uint32_t reverseBits(uint32_t n) {
        uint32_t res = 0;
        for (int i = 0; i < 32; i++) {
            res = (res << 1) | (n & 1);
            n >>= 1;
        }
        return res;
    }
};`,
  tc: 'O(32) = O(1)', sc: 'O(1)',
  test: R`assert(Solution().reverseBits(43261596u)==964176192u && Solution().reverseBits(4294967293u)==3221225471u && Solution().reverseBits(1u)==2147483648u);`,
},
{
  n: 191, t: 'Number of 1 Bits', d: 'E', k: 19,
  s: "Given a positive integer `n`, return the number of set bits (1s) in its binary representation, also called its Hamming weight.",
  i: 'n = 11', o: '3', e: '11 is 1011 in binary.',
  a: "Kernighan's trick",
  why: "`n & (n - 1)` clears the lowest set bit of `n`. Repeat until `n` is 0. The number of steps is the number of set bits, so the loop never spends time on zero bits.",
  ps: R`
count = 0
while n != 0:
    n = n & (n - 1)
    count++
return count`,
  cpp: R`
class Solution {
public:
    int hammingWeight(int n) {
        unsigned int x = n;
        int count = 0;
        while (x) {
            x &= x - 1;
            count++;
        }
        return count;
    }
};`,
  tc: 'O(number of set bits)', sc: 'O(1)',
  test: R`assert(Solution().hammingWeight(11)==3 && Solution().hammingWeight(128)==1 && Solution().hammingWeight(2147483645)==30);`,
},
{
  n: 136, t: 'Single Number', d: 'E', k: 19,
  s: "In a non-empty integer array `nums`, every element appears twice except for one. Find that single one, in linear time and constant extra space.",
  i: 'nums = [4,1,2,1,2]', o: '4',
  a: 'XOR everything',
  why: "XOR is commutative and associative, `x ^ x = 0` and `x ^ 0 = x`. XOR-ing all the numbers cancels every pair, leaving only the single number.",
  ps: R`
res = 0
for x in nums: res ^= x
return res`,
  cpp: R`
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int res = 0;
        for (int x : nums) res ^= x;
        return res;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={4,1,2,1,2}, b={2,2,1}, c={1}; assert(Solution().singleNumber(a)==4 && Solution().singleNumber(b)==1 && Solution().singleNumber(c)==1);`,
},
{
  n: 137, t: 'Single Number II', d: 'M', k: 19,
  s: "In an integer array `nums`, every element appears **three** times except one, which appears exactly once. Find it, in linear time and constant extra space.",
  i: 'nums = [0,1,0,1,0,1,99]', o: '99',
  a: 'Count each bit modulo 3',
  why: "For each bit position, count how many numbers have that bit set, modulo 3. Bits from the numbers that appear three times add up to 0 mod 3, so whatever remains belongs to the single number. Two masks, `ones` and `twos`, track that count for all 32 bits at once: `ones` holds the bits seen once (mod 3) and `twos` the bits seen twice.",
  ps: R`
ones = 0, twos = 0
for x in nums:
    ones = (ones ^ x) & ~twos
    twos = (twos ^ x) & ~ones
return ones`,
  cpp: R`
class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ones = 0, twos = 0;
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={2,2,3,2}, b={0,1,0,1,0,1,99}, c={-2,-2,1,1,4,1,4,4,-4,-2}; assert(Solution().singleNumber(a)==3 && Solution().singleNumber(b)==99 && Solution().singleNumber(c)==-4);`,
},
{
  n: 201, t: 'Bitwise AND of Numbers Range', d: 'M', k: 19,
  s: "Given integers `left` and `right` with 0 ≤ left ≤ right ≤ 2³¹ − 1, return the bitwise AND of every number in the range `[left, right]`, inclusive.",
  i: 'left = 5, right = 7', o: '4', e: '5 & 6 & 7 = 101 & 110 & 111 = 100.',
  a: 'Common binary prefix',
  why: "Below the highest bit where `left` and `right` differ, the range passes through both a 0 and a 1 in every position, so those bits AND to 0. Only the shared prefix survives. Repeatedly clearing the lowest set bit of `right` until it is no longer greater than `left` leaves exactly that prefix.",
  ps: R`
while right > left:
    right = right & (right - 1)
return right`,
  cpp: R`
class Solution {
public:
    int rangeBitwiseAnd(int left, int right) {
        while (right > left) right &= right - 1;
        return right;
    }
};`,
  tc: 'O(log right), at most 31 steps', sc: 'O(1)',
  test: R`assert(Solution().rangeBitwiseAnd(5,7)==4 && Solution().rangeBitwiseAnd(0,0)==0 && Solution().rangeBitwiseAnd(1,2147483647)==0 && Solution().rangeBitwiseAnd(6,7)==6);`,
},
  ]);
})();
