// Test prelude: LeetCode-style definitions and helpers.
#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val; ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* n) : val(x), next(n) {}
};
struct TreeNode {
    int val; TreeNode *left, *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* l, TreeNode* r) : val(x), left(l), right(r) {}
};
const int N_ = INT_MIN; // "null" marker in tree arrays

inline ListNode* L(vector<int> v) {
    ListNode d; ListNode* t = &d;
    for (int x : v) { t->next = new ListNode(x); t = t->next; }
    return d.next;
}
inline vector<int> V(ListNode* h) {
    vector<int> r; int guard = 0;
    while (h && guard++ < 100000) { r.push_back(h->val); h = h->next; }
    return r;
}
inline TreeNode* T(vector<int> v) {
    if (v.empty() || v[0] == N_) return nullptr;
    TreeNode* root = new TreeNode(v[0]);
    queue<TreeNode*> q; q.push(root); size_t i = 1;
    while (!q.empty() && i < v.size()) {
        TreeNode* n = q.front(); q.pop();
        if (i < v.size() && v[i] != N_) { n->left = new TreeNode(v[i]); q.push(n->left); } i++;
        if (i < v.size() && v[i] != N_) { n->right = new TreeNode(v[i]); q.push(n->right); } i++;
    }
    return root;
}
inline vector<int> S(TreeNode* root) { // level order with N_ for nulls, trailing nulls trimmed
    vector<int> r; queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        TreeNode* n = q.front(); q.pop();
        if (!n) { r.push_back(N_); continue; }
        r.push_back(n->val); q.push(n->left); q.push(n->right);
    }
    while (!r.empty() && r.back() == N_) r.pop_back();
    return r;
}
inline TreeNode* F(TreeNode* r, int v) { // find node by value
    if (!r || r->val == v) return r;
    TreeNode* x = F(r->left, v); return x ? x : F(r->right, v);
}
inline vector<vector<char>> G(vector<string> rows) { // char grid from strings
    vector<vector<char>> g;
    for (auto& s : rows) g.push_back(vector<char>(s.begin(), s.end()));
    return g;
}
