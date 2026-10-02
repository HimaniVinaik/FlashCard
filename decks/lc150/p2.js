/* LC150 part 2: Sliding Window, Matrix, Hashmap, Intervals, Stack */
(function () {
  const R = String.raw;
  LC150.add([
{
  n: 209, t: 'Minimum Size Subarray Sum', d: 'M', k: 2,
  s: "Given an array of **positive** integers `nums` and a positive integer `target`, return the minimal length of a contiguous subarray whose sum is greater than or equal to `target`. Return `0` if there is none.",
  i: 'target = 7, nums = [2,3,1,2,4,3]', o: '2', e: 'The subarray [4,3] has the minimal length.',
  a: 'Variable-size sliding window',
  why: "All numbers are positive, so extending the window to the right always increases the sum and dropping from the left always decreases it. Expand the right edge. While the sum is at least `target`, record the length and shrink from the left to look for a shorter window.",
  ps: R`
l = 0, sum = 0, best = infinity
for r in 0 .. n-1:
    sum += nums[r]
    while sum >= target:
        best = min(best, r - l + 1)
        sum -= nums[l++]
return best == infinity ? 0 : best`,
  cpp: R`
class Solution {
public:
    int minSubArrayLen(int target, vector<int>& nums) {
        int l = 0, sum = 0, best = INT_MAX;
        for (int r = 0; r < (int)nums.size(); r++) {
            sum += nums[r];
            while (sum >= target) {
                best = min(best, r - l + 1);
                sum -= nums[l++];
            }
        }
        return best == INT_MAX ? 0 : best;
    }
};`,
  tc: 'O(n), since each element enters and leaves the window once', sc: 'O(1)',
  test: R`vector<int> a={2,3,1,2,4,3}, b={1,1,1,1,1,1,1,1}; assert(Solution().minSubArrayLen(7,a)==2 && Solution().minSubArrayLen(11,b)==0);`,
},
{
  n: 3, t: 'Longest Substring Without Repeating Characters', d: 'M', k: 2,
  s: "Given a string `s`, return the length of the longest **substring** that has no repeating characters.",
  i: 's = "abcabcbb"', o: '3', e: 'The answer is "abc", with length 3.',
  a: 'Sliding window + last-seen index',
  why: "Keep a window `[l, r]` with no repeated characters, and remember the last index of each character. When `s[r]` was last seen inside the window, jump `l` to just past that position. The window is valid again, and its size is a candidate answer.",
  ps: R`
last[c] = -1 for every character
l = 0, best = 0
for r in 0 .. n-1:
    if last[s[r]] >= l: l = last[s[r]] + 1
    last[s[r]] = r
    best = max(best, r - l + 1)
return best`,
  cpp: R`
class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        vector<int> last(256, -1);
        int l = 0, best = 0;
        for (int r = 0; r < (int)s.size(); r++) {
            unsigned char c = s[r];
            if (last[c] >= l) l = last[c] + 1;
            last[c] = r;
            best = max(best, r - l + 1);
        }
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(1), a fixed 256-entry table',
  test: R`assert(Solution().lengthOfLongestSubstring("abcabcbb")==3 && Solution().lengthOfLongestSubstring("bbbbb")==1 && Solution().lengthOfLongestSubstring("pwwkew")==3 && Solution().lengthOfLongestSubstring("")==0);`,
},
{
  n: 30, t: 'Substring with Concatenation of All Words', d: 'H', k: 2,
  s: "You are given a string `s` and an array `words` whose strings all have the **same length**. Return all starting indices of substrings of `s` that are a concatenation of every word in `words` exactly once, in any order. The indices can be returned in any order.",
  i: 's = "barfoothefoobarman", words = ["foo","bar"]', o: '[0,9]', e: '"barfoo" starts at 0 and "foobar" starts at 9.',
  a: 'Sliding window in word-sized steps',
  why: "Every word has length `w`, so cut `s` into words starting at each offset 0..w−1. At each offset, slide a window one word at a time and count the words inside it. An unknown word resets the window. When a word appears more often than needed, shrink from the left. When the window holds exactly `k` words, record its start.",
  ps: R`
need = counts of words; k = len(words); w = len(words[0])
for off in 0 .. w-1:
    have = {}, left = off, count = 0
    for j = off; j + w <= n; j += w:
        word = s[j .. j+w)
        if word not in need:
            have = {}, count = 0, left = j + w; continue
        have[word]++, count++
        while have[word] > need[word]:
            have[s[left .. left+w)]--; left += w; count--
        if count == k:
            record left
            have[s[left .. left+w)]--; left += w; count--`,
  cpp: R`
class Solution {
public:
    vector<int> findSubstring(string s, vector<string>& words) {
        vector<int> res;
        int n = s.size(), k = words.size(), w = words[0].size();
        if (n < k * w) return res;
        unordered_map<string, int> need;
        for (auto& x : words) need[x]++;
        for (int off = 0; off < w; off++) {
            unordered_map<string, int> have;
            int left = off, count = 0;
            for (int j = off; j + w <= n; j += w) {
                string word = s.substr(j, w);
                if (!need.count(word)) {
                    have.clear();
                    count = 0;
                    left = j + w;
                    continue;
                }
                have[word]++;
                count++;
                while (have[word] > need[word]) {
                    have[s.substr(left, w)]--;
                    left += w;
                    count--;
                }
                if (count == k) {
                    res.push_back(left);
                    have[s.substr(left, w)]--;
                    left += w;
                    count--;
                }
            }
        }
        return res;
    }
};`,
  tc: 'O(n · w): each of the w offsets scans s once, with O(w) work per word', sc: 'O(k · w)',
  test: R`vector<string> w={"foo","bar"}; auto r=Solution().findSubstring("barfoothefoobarman",w); sort(r.begin(),r.end()); assert((r==vector<int>{0,9}));
  vector<string> w2={"bar","foo","the"}; string s2="barfoofoobarthefoobarman"; auto r2=Solution().findSubstring(s2,w2); sort(r2.begin(),r2.end()); assert((r2==vector<int>{6,9,12}));
  vector<string> w3={"word","good","best","word"}; string s3="wordgoodgoodgoodbestword"; assert(Solution().findSubstring(s3,w3).empty());`,
},
{
  n: 76, t: 'Minimum Window Substring', d: 'H', k: 2,
  s: "Given strings `s` and `t`, return the **minimum window** substring of `s` that contains every character of `t`, including duplicates. Return `\"\"` if no such window exists.",
  i: 's = "ADOBECODEBANC", t = "ABC"', o: '"BANC"',
  a: 'Sliding window with a missing counter',
  why: "Count how many of each character `t` needs, and keep a single `missing` total. Expand the right edge and lower `missing` whenever you take a character that is still needed. Once `missing` is 0, the window is valid. Shrink it from the left as far as possible, recording the best window, until removing a needed character makes `missing` positive again.",
  ps: R`
need = counts of t; missing = len(t)
l = 0, best = (inf, 0)
for r in 0 .. n-1:
    if need[s[r]] > 0: missing--
    need[s[r]]--
    while missing == 0:
        best = min(best, (r - l + 1, l))
        need[s[l]]++
        if need[s[l]] > 0: missing++
        l++
return best found ? s.substr(best.start, best.len) : ""`,
  cpp: R`
class Solution {
public:
    string minWindow(string s, string t) {
        vector<int> need(128, 0);
        for (char c : t) need[c]++;
        int missing = t.size(), l = 0, bestL = 0, bestLen = INT_MAX;
        for (int r = 0; r < (int)s.size(); r++) {
            if (need[s[r]]-- > 0) missing--;
            while (missing == 0) {
                if (r - l + 1 < bestLen) {
                    bestLen = r - l + 1;
                    bestL = l;
                }
                if (++need[s[l++]] > 0) missing++;
            }
        }
        return bestLen == INT_MAX ? "" : s.substr(bestL, bestLen);
    }
};`,
  tc: 'O(|s| + |t|)', sc: 'O(1), a fixed 128-entry table',
  test: R`assert(Solution().minWindow("ADOBECODEBANC","ABC")=="BANC" && Solution().minWindow("a","a")=="a" && Solution().minWindow("a","aa")=="");`,
},
{
  n: 36, t: 'Valid Sudoku', d: 'M', k: 3,
  s: "Decide whether a 9 × 9 Sudoku `board` is valid. Only the filled cells need to be checked:\n- each row contains the digits 1–9 at most once,\n- each column contains the digits 1–9 at most once,\n- each of the nine 3 × 3 boxes contains the digits 1–9 at most once.\n\nEmpty cells are `'.'`. A valid board does not have to be solvable.",
  i: 'board =\n[["5","3",".",".","7",".",".",".","."]\n,["6",".",".","1","9","5",".",".","."]\n,[".","9","8",".",".",".",".","6","."]\n,["8",".",".",".","6",".",".",".","3"]\n,["4",".",".","8",".","3",".",".","1"]\n,["7",".",".",".","2",".",".",".","6"]\n,[".","6",".",".",".",".","2","8","."]\n,[".",".",".","4","1","9",".",".","5"]\n,[".",".",".",".","8",".",".","7","9"]]',
  o: 'true',
  a: 'One pass with bitmasks',
  why: "Keep one bitmask per row, per column and per box, where bit d means digit d has been seen. Box index is `(r / 3) * 3 + c / 3`. For each filled cell, if its bit is already set in any of its three masks, the board is invalid. Otherwise set the bit in all three.",
  ps: R`
rows[9] = cols[9] = boxes[9] = 0
for r in 0..8, c in 0..8:
    if board[r][c] == '.': continue
    bit = 1 << (digit - 1); b = (r/3)*3 + c/3
    if bit in rows[r] or cols[c] or boxes[b]: return false
    add bit to rows[r], cols[c], boxes[b]
return true`,
  cpp: R`
class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        int rows[9] = {}, cols[9] = {}, boxes[9] = {};
        for (int r = 0; r < 9; r++)
            for (int c = 0; c < 9; c++) {
                if (board[r][c] == '.') continue;
                int bit = 1 << (board[r][c] - '1');
                int b = (r / 3) * 3 + c / 3;
                if ((rows[r] & bit) || (cols[c] & bit) || (boxes[b] & bit))
                    return false;
                rows[r] |= bit;
                cols[c] |= bit;
                boxes[b] |= bit;
            }
        return true;
    }
};`,
  tc: 'O(81) = O(1)', sc: 'O(1)',
  test: R`vector<string> rs={"53..7....","6..195...",".98....6.","8...6...3","4..8.3..1","7...2...6",".6....28.","...419..5","....8..79"}; vector<vector<char>> b; for(auto& x:rs) b.push_back(vector<char>(x.begin(),x.end())); assert(Solution().isValidSudoku(b)); b[0][0]='8'; assert(!Solution().isValidSudoku(b));`,
},
{
  n: 54, t: 'Spiral Matrix', d: 'M', k: 3,
  s: "Given an `m × n` matrix, return all of its elements in **spiral order**: clockwise, starting at the top-left corner.",
  i: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', o: '[1,2,3,6,9,8,7,4,5]',
  a: 'Shrinking boundaries',
  why: "Keep four boundaries: top, bottom, left and right. Walk along the top row, the right column, the bottom row and the left column, moving each boundary inward after you use it. Check that the bottom row and left column still exist before walking them, so a single remaining row or column is not visited twice.",
  ps: R`
top = 0, bot = m-1, left = 0, right = n-1
while top <= bot and left <= right:
    add row top from left..right; top++
    add column right from top..bot; right--
    if top <= bot: add row bot from right..left; bot--
    if left <= right: add column left from bot..top; left++`,
  cpp: R`
class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        vector<int> res;
        int top = 0, bot = (int)matrix.size() - 1;
        int left = 0, right = (int)matrix[0].size() - 1;
        while (top <= bot && left <= right) {
            for (int c = left; c <= right; c++) res.push_back(matrix[top][c]);
            top++;
            for (int r = top; r <= bot; r++) res.push_back(matrix[r][right]);
            right--;
            if (top <= bot) {
                for (int c = right; c >= left; c--) res.push_back(matrix[bot][c]);
                bot--;
            }
            if (left <= right) {
                for (int r = bot; r >= top; r--) res.push_back(matrix[r][left]);
                left++;
            }
        }
        return res;
    }
};`,
  tc: 'O(m · n)', sc: 'O(1) extra',
  test: R`vector<vector<int>> a={{1,2,3},{4,5,6},{7,8,9}}, b={{1,2,3,4},{5,6,7,8},{9,10,11,12}}, c={{1},{2},{3}}; assert((Solution().spiralOrder(a)==vector<int>{1,2,3,6,9,8,7,4,5})); assert((Solution().spiralOrder(b)==vector<int>{1,2,3,4,8,12,11,10,9,5,6,7})); assert((Solution().spiralOrder(c)==vector<int>{1,2,3}));`,
},
{
  n: 48, t: 'Rotate Image', d: 'M', k: 3,
  s: "Rotate an `n × n` matrix by 90° **clockwise**, in place.",
  i: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', o: '[[7,4,1],[8,5,2],[9,6,3]]',
  a: 'Transpose, then reverse each row',
  why: "A clockwise rotation sends `(r, c)` to `(c, n-1-r)`. Transposing swaps `(r, c)` with `(c, r)`. Reversing each row then maps column `r` to `n-1-r`. The two steps together are exactly the rotation, and both work in place.",
  ps: R`
for i in 0 .. n-1:
    for j in i+1 .. n-1:
        swap(m[i][j], m[j][i])
for each row: reverse(row)`,
  cpp: R`
class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                swap(matrix[i][j], matrix[j][i]);
        for (auto& row : matrix) reverse(row.begin(), row.end());
    }
};`,
  tc: 'O(n²)', sc: 'O(1)',
  test: R`vector<vector<int>> a={{1,2,3},{4,5,6},{7,8,9}}; Solution().rotate(a); assert((a==vector<vector<int>>{{7,4,1},{8,5,2},{9,6,3}}));`,
},
{
  n: 73, t: 'Set Matrix Zeroes', d: 'M', k: 3,
  s: "Given an `m × n` integer matrix, if an element is `0`, set its entire row and column to `0`. Do it **in place**.",
  i: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', o: '[[1,0,1],[0,0,0],[1,0,1]]',
  a: 'First row and column as markers',
  why: "Use the first row and first column as flags: if `matrix[i][j]` is 0, set `matrix[i][0]` and `matrix[0][j]` to 0. Cell `matrix[0][0]` is shared, so keep a separate flag for the first column. Then fill in zeros from the bottom-right corner backwards, so the markers are read before they are overwritten.",
  ps: R`
firstCol = false
for each row i:
    if m[i][0] == 0: firstCol = true
    for j in 1 .. n-1:
        if m[i][j] == 0: m[i][0] = m[0][j] = 0
for i = m-1 down to 0:
    for j = n-1 down to 1:
        if m[i][0] == 0 or m[0][j] == 0: m[i][j] = 0
    if firstCol: m[i][0] = 0`,
  cpp: R`
class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstCol = false;
        for (int i = 0; i < m; i++) {
            if (matrix[i][0] == 0) firstCol = true;
            for (int j = 1; j < n; j++)
                if (matrix[i][j] == 0) matrix[i][0] = matrix[0][j] = 0;
        }
        for (int i = m - 1; i >= 0; i--) {
            for (int j = n - 1; j >= 1; j--)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            if (firstCol) matrix[i][0] = 0;
        }
    }
};`,
  tc: 'O(m · n)', sc: 'O(1)',
  test: R`vector<vector<int>> a={{1,1,1},{1,0,1},{1,1,1}}, b={{0,1,2,0},{3,4,5,2},{1,3,1,5}}; Solution().setZeroes(a); Solution().setZeroes(b); assert((a==vector<vector<int>>{{1,0,1},{0,0,0},{1,0,1}})); assert((b==vector<vector<int>>{{0,0,0,0},{0,4,5,0},{0,3,1,0}}));`,
},
{
  n: 289, t: 'Game of Life', d: 'M', k: 3,
  s: "Each cell of an `m × n` board is live (1) or dead (0). Every cell interacts with its eight neighbors:\n- A live cell with fewer than 2 live neighbors dies.\n- A live cell with 2 or 3 live neighbors lives on.\n- A live cell with more than 3 live neighbors dies.\n- A dead cell with exactly 3 live neighbors becomes live.\n\nAll cells update at the same time. Update the board to its next state **in place**.",
  i: 'board = [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]', o: '[[0,0,0],[1,0,1],[0,1,1],[0,1,0]]',
  a: 'Store the next state in a second bit',
  why: "Bit 0 holds the current state and bit 1 holds the next state. Count live neighbors using `cell & 1`, so cells you already updated still report their current state. Set bit 1 if the cell should live next. Finally, shift every cell right by one.",
  ps: R`
for each cell (i, j):
    live = number of neighbors with (cell & 1) == 1
    if live == 3 or (live == 2 and cell is alive):
        cell |= 2
for each cell: cell >>= 1`,
  cpp: R`
class Solution {
public:
    void gameOfLife(vector<vector<int>>& board) {
        int m = board.size(), n = board[0].size();
        for (int i = 0; i < m; i++)
            for (int j = 0; j < n; j++) {
                int live = 0;
                for (int di = -1; di <= 1; di++)
                    for (int dj = -1; dj <= 1; dj++) {
                        if (di == 0 && dj == 0) continue;
                        int r = i + di, c = j + dj;
                        if (r >= 0 && r < m && c >= 0 && c < n)
                            live += board[r][c] & 1;
                    }
                if (live == 3 || (live == 2 && (board[i][j] & 1)))
                    board[i][j] |= 2;
            }
        for (auto& row : board)
            for (int& x : row) x >>= 1;
    }
};`,
  tc: 'O(m · n)', sc: 'O(1)',
  test: R`vector<vector<int>> a={{0,1,0},{0,0,1},{1,1,1},{0,0,0}}; Solution().gameOfLife(a); assert((a==vector<vector<int>>{{0,0,0},{1,0,1},{0,1,1},{0,1,0}}));`,
},
{
  n: 383, t: 'Ransom Note', d: 'E', k: 4,
  s: "Given strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be built using letters from `magazine`. Each letter in `magazine` can be used only once.",
  i: 'ransomNote = "aa", magazine = "aab"', o: 'true',
  a: 'Letter counts',
  why: "Count the letters available in the magazine. Then spend one count for each letter of the note. If any count would go below zero, the note cannot be built.",
  ps: R`
cnt[26] = counts of magazine
for c in ransomNote:
    if --cnt[c] < 0: return false
return true`,
  cpp: R`
class Solution {
public:
    bool canConstruct(string ransomNote, string magazine) {
        int cnt[26] = {};
        for (char c : magazine) cnt[c - 'a']++;
        for (char c : ransomNote)
            if (--cnt[c - 'a'] < 0) return false;
        return true;
    }
};`,
  tc: 'O(n + m)', sc: 'O(1)',
  test: R`assert(Solution().canConstruct("aa","aab") && !Solution().canConstruct("aa","ab") && !Solution().canConstruct("a","b"));`,
},
{
  n: 205, t: 'Isomorphic Strings', d: 'E', k: 4,
  s: "Two strings `s` and `t` are isomorphic if the characters of `s` can be replaced to get `t`. Every occurrence of a character must map to the same character, and no two characters may map to the same character. Return `true` if `s` and `t` are isomorphic.",
  i: 's = "egg", t = "add"', o: 'true',
  a: 'Last-seen positions must match',
  why: "The mapping is a valid one-to-one mapping exactly when, at every index, `s[i]` and `t[i]` were last seen at the same position, or both were never seen. Store `i + 1` as the last-seen position, so 0 can mean never seen.",
  ps: R`
a[256] = b[256] = 0
for i in 0 .. n-1:
    if a[s[i]] != b[t[i]]: return false
    a[s[i]] = b[t[i]] = i + 1
return true`,
  cpp: R`
class Solution {
public:
    bool isIsomorphic(string s, string t) {
        int a[256] = {}, b[256] = {};
        for (int i = 0; i < (int)s.size(); i++) {
            unsigned char x = s[i], y = t[i];
            if (a[x] != b[y]) return false;
            a[x] = b[y] = i + 1;
        }
        return true;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().isIsomorphic("egg","add") && !Solution().isIsomorphic("foo","bar") && Solution().isIsomorphic("paper","title") && !Solution().isIsomorphic("badc","baba"));`,
},
{
  n: 290, t: 'Word Pattern', d: 'E', k: 4,
  s: "Given a `pattern` and a string `s` of space-separated words, return `true` if `s` follows the pattern. Each letter must map to exactly one word, and each word to exactly one letter.",
  i: 'pattern = "abba", s = "dog cat cat dog"', o: 'true',
  a: 'Two hash maps (a bijection)',
  why: "Split `s` into words. The counts must match, and each pattern letter and word pair must be consistent in **both** directions: one map from letter to word, and one from word to letter.",
  ps: R`
words = split(s)
if len(words) != len(pattern): return false
for i:
    c = pattern[i], w = words[i]
    if c in p2w and p2w[c] != w: return false
    if w in w2p and w2p[w] != c: return false
    p2w[c] = w; w2p[w] = c
return true`,
  cpp: R`
class Solution {
public:
    bool wordPattern(string pattern, string s) {
        istringstream in(s);
        vector<string> words;
        string w;
        while (in >> w) words.push_back(w);
        if (words.size() != pattern.size()) return false;
        unordered_map<char, string> p2w;
        unordered_map<string, char> w2p;
        for (int i = 0; i < (int)words.size(); i++) {
            char c = pattern[i];
            auto a = p2w.find(c);
            auto b = w2p.find(words[i]);
            if (a != p2w.end() && a->second != words[i]) return false;
            if (b != w2p.end() && b->second != c) return false;
            p2w[c] = words[i];
            w2p[words[i]] = c;
        }
        return true;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`assert(Solution().wordPattern("abba","dog cat cat dog") && !Solution().wordPattern("abba","dog cat cat fish") && !Solution().wordPattern("aaaa","dog cat cat dog") && !Solution().wordPattern("abba","dog dog dog dog"));`,
},
{
  n: 242, t: 'Valid Anagram', d: 'E', k: 4,
  s: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, meaning it uses exactly the same letters the same number of times.",
  i: 's = "anagram", t = "nagaram"', o: 'true',
  a: 'Letter counts',
  why: "Two strings are anagrams exactly when every letter appears the same number of times in each. Add one for each letter of `s`, subtract one for each letter of `t`, and check that every count is zero.",
  ps: R`
if len(s) != len(t): return false
cnt[26] = 0
for i: cnt[s[i]]++; cnt[t[i]]--
return all counts are 0`,
  cpp: R`
class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.size() != t.size()) return false;
        int cnt[26] = {};
        for (int i = 0; i < (int)s.size(); i++) {
            cnt[s[i] - 'a']++;
            cnt[t[i] - 'a']--;
        }
        for (int c : cnt)
            if (c != 0) return false;
        return true;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().isAnagram("anagram","nagaram") && !Solution().isAnagram("rat","car"));`,
},
{
  n: 49, t: 'Group Anagrams', d: 'M', k: 4,
  s: "Given an array of strings `strs`, group the anagrams together. You can return the groups in any order.",
  i: 'strs = ["eat","tea","tan","ate","nat","bat"]', o: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
  a: 'Hash map keyed by sorted string',
  why: "All anagrams look the same once their letters are sorted. Use the sorted string as a hash-map key, and collect the original strings under it. A 26-count signature also works and costs O(k) per word instead of O(k log k).",
  ps: R`
groups = {}
for s in strs:
    key = sorted(s)
    groups[key].append(s)
return values of groups`,
  cpp: R`
class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (auto& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> res;
        for (auto& [key, g] : groups) res.push_back(move(g));
        return res;
    }
};`,
  tc: 'O(n · k log k), where k is the longest string', sc: 'O(n · k)',
  test: R`vector<string> a={"eat","tea","tan","ate","nat","bat"}; auto r=Solution().groupAnagrams(a); for(auto& g:r) sort(g.begin(),g.end()); sort(r.begin(),r.end()); assert((r==vector<vector<string>>{{"ate","eat","tea"},{"bat"},{"nat","tan"}}));`,
},
{
  n: 1, t: 'Two Sum', d: 'E', k: 4,
  s: "Given an integer array `nums` and an integer `target`, return the indices of the two numbers that add up to `target`. Exactly one solution exists, and you may not use the same element twice.",
  i: 'nums = [2,7,11,15], target = 9', o: '[0,1]', e: 'nums[0] + nums[1] = 2 + 7 = 9.',
  a: 'One-pass hash map',
  why: "For each number `x`, the partner it needs is `target - x`. Keep a map from each value seen so far to its index. If the partner is already in the map, you have the answer. Otherwise, store `x` and continue.",
  ps: R`
seen = {}
for i, x in nums:
    if target - x in seen: return [seen[target - x], i]
    seen[x] = i`,
  cpp: R`
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < (int)nums.size(); i++) {
            auto it = seen.find(target - nums[i]);
            if (it != seen.end()) return {it->second, i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> a={2,7,11,15}, b={3,2,4}, c={3,3}; assert((Solution().twoSum(a,9)==vector<int>{0,1}) && (Solution().twoSum(b,6)==vector<int>{1,2}) && (Solution().twoSum(c,6)==vector<int>{0,1}));`,
},
{
  n: 202, t: 'Happy Number', d: 'E', k: 4,
  s: "Repeatedly replace a positive integer `n` with the sum of the squares of its digits. `n` is **happy** if this process reaches 1. Otherwise it loops forever in a cycle that does not include 1. Return `true` if `n` is happy.",
  i: 'n = 19', o: 'true', e: '1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1.',
  a: 'Floyd cycle detection',
  why: "The sequence always either reaches 1 or falls into a cycle. Run a slow pointer that takes one step and a fast pointer that takes two steps. They are guaranteed to meet. The number is happy exactly when they meet at 1.",
  ps: R`
next(x) = sum of squares of the digits of x
slow = n, fast = next(n)
while fast != 1 and slow != fast:
    slow = next(slow)
    fast = next(next(fast))
return fast == 1`,
  cpp: R`
class Solution {
    int next(int x) {
        int s = 0;
        while (x) {
            int d = x % 10;
            s += d * d;
            x /= 10;
        }
        return s;
    }
public:
    bool isHappy(int n) {
        int slow = n, fast = next(n);
        while (fast != 1 && slow != fast) {
            slow = next(slow);
            fast = next(next(fast));
        }
        return fast == 1;
    }
};`,
  tc: 'O(log n)', sc: 'O(1)',
  test: R`assert(Solution().isHappy(19) && !Solution().isHappy(2) && Solution().isHappy(1));`,
},
{
  n: 219, t: 'Contains Duplicate II', d: 'E', k: 4,
  s: "Given an integer array `nums` and an integer `k`, return `true` if there are two distinct indices `i` and `j` with `nums[i] == nums[j]` and `|i - j| <= k`.",
  i: 'nums = [1,2,3,1], k = 3', o: 'true',
  a: 'Hash map of last index',
  why: "Only the most recent earlier occurrence of a value matters, because it is the closest one. Store each value's last index. When a value repeats, check its distance to that last index.",
  ps: R`
last = {}
for i, x in nums:
    if x in last and i - last[x] <= k: return true
    last[x] = i
return false`,
  cpp: R`
class Solution {
public:
    bool containsNearbyDuplicate(vector<int>& nums, int k) {
        unordered_map<int, int> last;
        for (int i = 0; i < (int)nums.size(); i++) {
            auto it = last.find(nums[i]);
            if (it != last.end() && i - it->second <= k) return true;
            last[nums[i]] = i;
        }
        return false;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> a={1,2,3,1}, b={1,0,1,1}, c={1,2,3,1,2,3}; assert(Solution().containsNearbyDuplicate(a,3) && Solution().containsNearbyDuplicate(b,1) && !Solution().containsNearbyDuplicate(c,2));`,
},
{
  n: 128, t: 'Longest Consecutive Sequence', d: 'M', k: 4,
  s: "Given an unsorted integer array `nums`, return the length of the longest run of consecutive integers, such as 1, 2, 3, 4. The algorithm must run in **O(n)** time.",
  i: 'nums = [100,4,200,1,3,2]', o: '4', e: 'The longest run is [1, 2, 3, 4].',
  a: 'Hash set; only start at run beginnings',
  why: "Put every number in a hash set. A number `x` starts a run only if `x - 1` is not in the set. From each start, count upward while `x + 1` is present. Every number is visited by at most one counting loop, so the total work is O(n).",
  ps: R`
set = all nums
best = 0
for x in set:
    if x - 1 not in set:
        len = 1
        while x + len in set: len++
        best = max(best, len)
return best`,
  cpp: R`
class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> s(nums.begin(), nums.end());
        int best = 0;
        for (int x : s) {
            if (s.count(x - 1)) continue;
            int len = 1;
            while (s.count(x + len)) len++;
            best = max(best, len);
        }
        return best;
    }
};`,
  tc: 'O(n) on average', sc: 'O(n)',
  test: R`vector<int> a={100,4,200,1,3,2}, b={0,3,7,2,5,8,4,6,0,1}, c={}; assert(Solution().longestConsecutive(a)==4 && Solution().longestConsecutive(b)==9 && Solution().longestConsecutive(c)==0);`,
},
{
  n: 228, t: 'Summary Ranges', d: 'E', k: 5,
  s: "Given a sorted array of **unique** integers `nums`, return the smallest list of ranges that covers all the numbers exactly. Write each range as `\"a->b\"` if a ≠ b, or `\"a\"` if a = b.",
  i: 'nums = [0,1,2,4,5,7]', o: '["0->2","4->5","7"]',
  a: 'Scan runs of consecutive values',
  why: "Start a range at `nums[i]` and extend it while the next number is exactly one more. When the run breaks, write out the range and start a new one.",
  ps: R`
i = 0
while i < n:
    j = i
    while j + 1 < n and nums[j+1] == nums[j] + 1: j++
    add (i == j) ? "a" : "a->b"
    i = j + 1`,
  cpp: R`
class Solution {
public:
    vector<string> summaryRanges(vector<int>& nums) {
        vector<string> res;
        int n = nums.size();
        for (int i = 0; i < n;) {
            int j = i;
            while (j + 1 < n && (long long)nums[j + 1] == (long long)nums[j] + 1) j++;
            if (i == j) res.push_back(to_string(nums[i]));
            else res.push_back(to_string(nums[i]) + "->" + to_string(nums[j]));
            i = j + 1;
        }
        return res;
    }
};`,
  tc: 'O(n)', sc: 'O(1) extra',
  test: R`vector<int> a={0,1,2,4,5,7}, b={0,2,3,4,6,8,9}, c={INT_MAX-1,INT_MAX}; assert((Solution().summaryRanges(a)==vector<string>{"0->2","4->5","7"})); assert((Solution().summaryRanges(b)==vector<string>{"0","2->4","6","8->9"})); assert((Solution().summaryRanges(c)==vector<string>{"2147483646->2147483647"}));`,
},
{
  n: 56, t: 'Merge Intervals', d: 'M', k: 5,
  s: "Given an array of `intervals` where `intervals[i] = [start, end]`, merge all overlapping intervals and return the non-overlapping intervals that cover them.",
  i: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', o: '[[1,6],[8,10],[15,18]]',
  a: 'Sort by start, then sweep',
  why: "After sorting by start, any interval that overlaps the last merged interval must overlap it at its end. So either extend the last merged interval's end, or start a new merged interval.",
  ps: R`
sort intervals by start
res = []
for [s, e] in intervals:
    if res not empty and s <= res.back().end:
        res.back().end = max(res.back().end, e)
    else:
        res.append([s, e])
return res`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> res;
        for (auto& iv : intervals) {
            if (!res.empty() && iv[0] <= res.back()[1])
                res.back()[1] = max(res.back()[1], iv[1]);
            else
                res.push_back(iv);
        }
        return res;
    }
};`,
  tc: 'O(n log n)', sc: 'O(n) for the output',
  test: R`vector<vector<int>> a={{1,3},{2,6},{8,10},{15,18}}, b={{1,4},{4,5}}; assert((Solution().merge(a)==vector<vector<int>>{{1,6},{8,10},{15,18}})); assert((Solution().merge(b)==vector<vector<int>>{{1,5}}));`,
},
{
  n: 57, t: 'Insert Interval', d: 'M', k: 5,
  s: "You are given non-overlapping `intervals` sorted by start, and a `newInterval`. Insert `newInterval` so the list stays sorted and non-overlapping, merging intervals where needed. Return the result.",
  i: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', o: '[[1,5],[6,9]]',
  a: 'Three phases: before, overlap, after',
  why: "The intervals are already sorted, so a single pass works. First copy every interval that ends before the new one starts. Then absorb every interval that overlaps it, widening the new interval as you go. Finally, append the new interval and the rest.",
  ps: R`
i = 0, res = []
while i < n and iv[i].end < new.start: res.add(iv[i++])
while i < n and iv[i].start <= new.end:
    new = [min(new.start, iv[i].start), max(new.end, iv[i].end)]; i++
res.add(new)
while i < n: res.add(iv[i++])
return res`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals,
                               vector<int>& newInterval) {
        vector<vector<int>> res;
        int i = 0, n = intervals.size();
        while (i < n && intervals[i][1] < newInterval[0])
            res.push_back(intervals[i++]);
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        res.push_back(newInterval);
        while (i < n) res.push_back(intervals[i++]);
        return res;
    }
};`,
  tc: 'O(n)', sc: 'O(n) for the output',
  test: R`vector<vector<int>> a={{1,3},{6,9}}; vector<int> x={2,5}; assert((Solution().insert(a,x)==vector<vector<int>>{{1,5},{6,9}}));
  vector<vector<int>> b={{1,2},{3,5},{6,7},{8,10},{12,16}}; vector<int> y={4,8}; assert((Solution().insert(b,y)==vector<vector<int>>{{1,2},{3,10},{12,16}}));
  vector<vector<int>> c={}; vector<int> z={5,7}; assert((Solution().insert(c,z)==vector<vector<int>>{{5,7}}));`,
},
{
  n: 452, t: 'Minimum Number of Arrows to Burst Balloons', d: 'M', k: 5,
  s: "Each balloon spans horizontal positions `[xstart, xend]`. An arrow shot straight up at position `x` bursts every balloon with `xstart <= x <= xend`. Return the **minimum** number of arrows needed to burst all the balloons in `points`.",
  i: 'points = [[10,16],[2,8],[1,6],[7,12]]', o: '2', e: 'Shoot at x = 6, bursting [2,8] and [1,6], and at x = 11, bursting [10,16] and [7,12].',
  a: 'Greedy: sort by end',
  why: "Sort the balloons by end. Shoot the first arrow at the earliest end, which is as far right as possible while still bursting that balloon. That arrow also bursts every balloon starting at or before that point. The next balloon starting after the arrow needs a new arrow, placed at its own end.",
  ps: R`
sort points by end
arrows = 1, pos = points[0].end
for [s, e] in points[1:]:
    if s > pos:
        arrows++
        pos = e
return arrows`,
  cpp: R`
class Solution {
public:
    int findMinArrowShots(vector<vector<int>>& points) {
        sort(points.begin(), points.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });
        int arrows = 1;
        int pos = points[0][1];
        for (int i = 1; i < (int)points.size(); i++)
            if (points[i][0] > pos) {
                arrows++;
                pos = points[i][1];
            }
        return arrows;
    }
};`,
  tc: 'O(n log n)', sc: 'O(log n) for sorting',
  test: R`vector<vector<int>> a={{10,16},{2,8},{1,6},{7,12}}, b={{1,2},{3,4},{5,6},{7,8}}, c={{1,2},{2,3},{3,4},{4,5}}, d={{-2147483646,-2147483645},{2147483646,2147483647}}; assert(Solution().findMinArrowShots(a)==2 && Solution().findMinArrowShots(b)==4 && Solution().findMinArrowShots(c)==2 && Solution().findMinArrowShots(d)==2);`,
},
{
  n: 20, t: 'Valid Parentheses', d: 'E', k: 6,
  s: "Given a string `s` containing only `()[]{}`, return `true` if it is valid: every open bracket is closed by the same type of bracket, in the correct order.",
  i: 's = "()[]{}"', o: 'true',
  a: 'Stack',
  why: "The most recently opened bracket must be the first one closed, which is last in, first out. Push each opening bracket. On a closing bracket, the top of the stack must be its matching opener. At the end, the stack must be empty.",
  ps: R`
stack = []
for c in s:
    if c is an opener: push c
    else:
        if stack empty or top != match(c): return false
        pop
return stack is empty`,
  cpp: R`
class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
                continue;
            }
            char open = c == ')' ? '(' : c == ']' ? '[' : '{';
            if (st.empty() || st.top() != open) return false;
            st.pop();
        }
        return st.empty();
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`assert(Solution().isValid("()[]{}") && !Solution().isValid("(]") && Solution().isValid("([])") && !Solution().isValid("(") && !Solution().isValid("]"));`,
},
{
  n: 71, t: 'Simplify Path', d: 'M', k: 6,
  s: "Given an absolute Unix-style `path`, return its simplified canonical path. In a Unix path:\n- `.` means the current directory.\n- `..` means the parent directory.\n- Several slashes in a row act as one slash.\n\nThe result starts with a single `/`, has single slashes between names, and no trailing slash.",
  i: 'path = "/home/user/Documents/../Pictures"', o: '"/home/user/Pictures"',
  a: 'Stack of directory names',
  why: "Split the path on `/`. Empty parts and `.` change nothing. `..` pops the last directory, if there is one. Any other name is pushed. Joining the stack with `/` gives the canonical path.",
  ps: R`
stack = []
for part in split(path, '/'):
    if part == "" or part == ".": continue
    if part == "..": pop if not empty
    else: push part
return "/" + join(stack, "/")`,
  cpp: R`
class Solution {
public:
    string simplifyPath(string path) {
        vector<string> st;
        stringstream ss(path);
        string part;
        while (getline(ss, part, '/')) {
            if (part.empty() || part == ".") continue;
            if (part == "..") {
                if (!st.empty()) st.pop_back();
            } else {
                st.push_back(part);
            }
        }
        string res;
        for (auto& d : st) res += "/" + d;
        return res.empty() ? "/" : res;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`assert(Solution().simplifyPath("/home/user/Documents/../Pictures")=="/home/user/Pictures" && Solution().simplifyPath("/home//foo/")=="/home/foo" && Solution().simplifyPath("/../")=="/" && Solution().simplifyPath("/.../a/../b/c/../d/./")=="/.../b/d");`,
},
{
  n: 155, t: 'Min Stack', d: 'M', k: 6,
  s: "Design a stack that supports `push(val)`, `pop()`, `top()` and `getMin()`, which returns the minimum element. Every operation must run in **O(1)** time.",
  i: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n        [[],[-2],[0],[-3],[],[],[],[]]',
  o: '[null,null,null,null,-3,null,0,-2]',
  a: 'Store the running minimum with each element',
  why: "Push the pair `(val, min(val, current min))` for every element. The minimum of the stack at any moment is then stored in the top pair, and popping automatically restores the previous minimum.",
  ps: R`
push(v): st.push((v, st empty ? v : min(v, st.top.min)))
pop():   st.pop()
top():   return st.top.val
getMin(): return st.top.min`,
  cpp: R`
class MinStack {
    vector<pair<int, int>> st; // (value, minimum so far)
public:
    MinStack() {}

    void push(int val) {
        int m = st.empty() ? val : min(val, st.back().second);
        st.push_back({val, m});
    }

    void pop() { st.pop_back(); }

    int top() { return st.back().first; }

    int getMin() { return st.back().second; }
};`,
  tc: 'O(1) per operation', sc: 'O(n)',
  test: R`MinStack m; m.push(-2); m.push(0); m.push(-3); assert(m.getMin()==-3); m.pop(); assert(m.top()==0 && m.getMin()==-2);`,
},
{
  n: 150, t: 'Evaluate Reverse Polish Notation', d: 'M', k: 6,
  s: "Evaluate an arithmetic expression given in Reverse Polish Notation as an array of `tokens`. The operators are `+`, `-`, `*` and `/`. Division truncates toward zero. The expression is always valid.",
  i: 'tokens = ["2","1","+","3","*"]', o: '9', e: '((2 + 1) * 3) = 9.',
  a: 'Operand stack',
  why: "In RPN, each operator applies to the two most recent values. Push numbers onto a stack. On an operator, pop the right operand first, then the left one, and push the result.",
  ps: R`
stack = []
for tok in tokens:
    if tok is an operator:
        b = pop(); a = pop()
        push(a op b)
    else:
        push(int(tok))
return pop()`,
  cpp: R`
class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        vector<long long> st;
        for (auto& t : tokens) {
            if (t.size() == 1 && string("+-*/").find(t[0]) != string::npos) {
                long long b = st.back(); st.pop_back();
                long long a = st.back(); st.pop_back();
                if (t[0] == '+') st.push_back(a + b);
                else if (t[0] == '-') st.push_back(a - b);
                else if (t[0] == '*') st.push_back(a * b);
                else st.push_back(a / b);
            } else {
                st.push_back(stoll(t));
            }
        }
        return (int)st.back();
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<string> a={"2","1","+","3","*"}, b={"4","13","5","/","+"}, c={"10","6","9","3","+","-11","*","/","*","17","+","5","+"}; assert(Solution().evalRPN(a)==9 && Solution().evalRPN(b)==6 && Solution().evalRPN(c)==22);`,
},
{
  n: 224, t: 'Basic Calculator', d: 'H', k: 6,
  s: "Given a string `s` holding a valid expression with non-negative integers, `+`, `-`, parentheses and spaces, evaluate it. `-` can also be unary, as in `-(2 + 3)`. Do not use built-in `eval` functions.",
  i: 's = "(1+(4+5+2)-3)+(6+8)"', o: '23',
  a: 'Running result + stack of (result, sign)',
  why: "With only `+` and `-`, the expression is a signed sum. Keep a running `result`, the current `num` and the `sign` in front of it. On `(`, save `(result, sign)` and start fresh inside the parentheses. On `)`, finish the inner sum and combine it as `saved result + saved sign × inner`.",
  ps: R`
result = 0, num = 0, sign = 1, stack = []
for c in s:
    digit:    num = num*10 + c
    '+'/'-':  result += sign*num; num = 0; sign = ±1
    '(':      push (result, sign); result = 0; sign = 1
    ')':      result += sign*num; num = 0
              (prev, sg) = pop(); result = prev + sg*result
return result + sign*num`,
  cpp: R`
class Solution {
public:
    int calculate(string s) {
        long long result = 0, num = 0;
        int sign = 1;
        stack<pair<long long, int>> st; // (result before '(', sign before '(')
        for (char c : s) {
            if (isdigit((unsigned char)c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+' || c == '-') {
                result += sign * num;
                num = 0;
                sign = (c == '+') ? 1 : -1;
            } else if (c == '(') {
                st.push({result, sign});
                result = 0;
                sign = 1;
            } else if (c == ')') {
                result += sign * num;
                num = 0;
                auto [prev, sg] = st.top();
                st.pop();
                result = prev + sg * result;
            }
        }
        return (int)(result + sign * num);
    }
};`,
  tc: 'O(n)', sc: 'O(n) for nested parentheses',
  test: R`assert(Solution().calculate("(1+(4+5+2)-3)+(6+8)")==23 && Solution().calculate(" 2-1 + 2 ")==3 && Solution().calculate("1 + 1")==2 && Solution().calculate("-(2+3)")==-5 && Solution().calculate("- (3 + (4 + 5))")==-12);`,
},
  ]);
})();
