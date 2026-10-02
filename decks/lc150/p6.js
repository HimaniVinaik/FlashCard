/* LC150 part 6: Math, 1D DP, Multidimensional DP */
(function () {
  const R = String.raw;
  LC150.add([
{
  n: 9, t: 'Palindrome Number', d: 'E', k: 20,
  s: "Given an integer `x`, return `true` if it reads the same backward as forward. Try to solve it without converting the number to a string.",
  i: 'x = 121', o: 'true',
  a: 'Reverse half of the digits',
  why: "Negative numbers, and positive numbers ending in 0, cannot be palindromes. Otherwise, move digits from the end of `x` onto a reversed number until the reversed number is at least as large as what is left of `x`. Then compare the two halves. With an odd number of digits, drop the middle digit with `/ 10`. Reversing only half the digits also avoids overflow.",
  ps: R`
if x < 0 or (x % 10 == 0 and x != 0): return false
rev = 0
while x > rev:
    rev = rev*10 + x % 10
    x /= 10
return x == rev or x == rev / 10`,
  cpp: R`
class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0 || (x % 10 == 0 && x != 0)) return false;
        int rev = 0;
        while (x > rev) {
            rev = rev * 10 + x % 10;
            x /= 10;
        }
        return x == rev || x == rev / 10;
    }
};`,
  tc: 'O(log₁₀ x)', sc: 'O(1)',
  test: R`assert(Solution().isPalindrome(121) && !Solution().isPalindrome(-121) && !Solution().isPalindrome(10) && Solution().isPalindrome(0) && Solution().isPalindrome(1221) && !Solution().isPalindrome(2147483647));`,
},
{
  n: 66, t: 'Plus One', d: 'E', k: 20,
  s: "A large integer is stored as an array of `digits`, most significant digit first, with no leading zeros. Add one to it and return the resulting array.",
  i: 'digits = [1,2,9]', o: '[1,3,0]',
  a: 'Carry from the right',
  why: "Walk from the last digit. A digit below 9 just goes up by one and you are done. A 9 becomes 0 and the carry moves left. If every digit was 9, the result is 1 followed by zeros.",
  ps: R`
for i = n-1 down to 0:
    if digits[i] < 9: digits[i]++; return digits
    digits[i] = 0
return [1] + digits`,
  cpp: R`
class Solution {
public:
    vector<int> plusOne(vector<int>& digits) {
        for (int i = (int)digits.size() - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;
                return digits;
            }
            digits[i] = 0;
        }
        digits.insert(digits.begin(), 1);
        return digits;
    }
};`,
  tc: 'O(n)', sc: 'O(1) extra (O(n) only when every digit is 9)',
  test: R`vector<int> a={1,2,3}, b={9}, c={4,3,2,1}, d={9,9}; assert((Solution().plusOne(a)==vector<int>{1,2,4}) && (Solution().plusOne(b)==vector<int>{1,0}) && (Solution().plusOne(c)==vector<int>{4,3,2,2}) && (Solution().plusOne(d)==vector<int>{1,0,0}));`,
},
{
  n: 172, t: 'Factorial Trailing Zeroes', d: 'M', k: 20,
  s: "Given an integer `n`, return the number of trailing zeros in `n!`.",
  i: 'n = 5', o: '1', e: '5! = 120.',
  a: 'Count the factors of 5',
  why: "Each trailing zero comes from a factor 10 = 2 × 5, and factors of 2 are far more common, so count the 5s. Every multiple of 5 contributes one, every multiple of 25 one more, every multiple of 125 another, and so on. The total is n/5 + n/25 + n/125 + …",
  ps: R`
count = 0
while n > 0:
    n /= 5
    count += n
return count`,
  cpp: R`
class Solution {
public:
    int trailingZeroes(int n) {
        int count = 0;
        while (n > 0) {
            n /= 5;
            count += n;
        }
        return count;
    }
};`,
  tc: 'O(log₅ n)', sc: 'O(1)',
  test: R`assert(Solution().trailingZeroes(3)==0 && Solution().trailingZeroes(5)==1 && Solution().trailingZeroes(25)==6 && Solution().trailingZeroes(10000)==2499);`,
},
{
  n: 69, t: 'Sqrt(x)', d: 'E', k: 20,
  s: "Given a non-negative integer `x`, return the square root of `x` rounded **down** to the nearest integer. Do not use built-in power or square-root functions.",
  i: 'x = 8', o: '2', e: 'The square root of 8 is 2.828…, which rounds down to 2.',
  a: 'Binary search on the answer',
  why: "The answer is the largest `m` with `m² <= x`. The test `m² <= x` is true for small m and false after some point, so binary search can find where it switches. Use 64-bit arithmetic so `m * m` cannot overflow.",
  ps: R`
lo = 0, hi = x
while lo < hi:
    mid = (lo + hi + 1) / 2     # round up so the loop always progresses
    if mid*mid <= x: lo = mid
    else: hi = mid - 1
return lo`,
  cpp: R`
class Solution {
public:
    int mySqrt(int x) {
        long long lo = 0, hi = x;
        while (lo < hi) {
            long long mid = lo + (hi - lo + 1) / 2;
            if (mid * mid <= x) lo = mid;
            else hi = mid - 1;
        }
        return (int)lo;
    }
};`,
  tc: 'O(log x)', sc: 'O(1)',
  test: R`assert(Solution().mySqrt(4)==2 && Solution().mySqrt(8)==2 && Solution().mySqrt(0)==0 && Solution().mySqrt(1)==1 && Solution().mySqrt(2147483647)==46340);`,
},
{
  n: 50, t: 'Pow(x, n)', d: 'M', k: 20,
  s: "Implement `pow(x, n)`, which returns x raised to the power n, where n is a 32-bit integer and can be negative.",
  i: 'x = 2.00000, n = 10', o: '1024.00000',
  a: 'Fast exponentiation (repeated squaring)',
  why: "Write n in binary. Square `x` at each step, and multiply it into the result whenever the current bit of n is 1. That takes O(log n) multiplications. For a negative n, compute with 1/x. Store n in 64 bits, because negating INT_MIN overflows a 32-bit int.",
  ps: R`
N = n as 64-bit
if N < 0: x = 1/x; N = -N
res = 1
while N > 0:
    if N & 1: res *= x
    x *= x
    N >>= 1
return res`,
  cpp: R`
class Solution {
public:
    double myPow(double x, int n) {
        long long N = n;
        if (N < 0) {
            x = 1 / x;
            N = -N;
        }
        double res = 1.0;
        while (N > 0) {
            if (N & 1) res *= x;
            x *= x;
            N >>= 1;
        }
        return res;
    }
};`,
  tc: 'O(log |n|)', sc: 'O(1)',
  test: R`assert(fabs(Solution().myPow(2.0,10)-1024.0)<1e-9 && fabs(Solution().myPow(2.1,3)-9.261)<1e-9 && fabs(Solution().myPow(2.0,-2)-0.25)<1e-12 && fabs(Solution().myPow(1.0,INT_MIN)-1.0)<1e-12);`,
},
{
  n: 149, t: 'Max Points on a Line', d: 'H', k: 20,
  s: "Given an array of **unique** `points` on the X-Y plane, return the maximum number of points that lie on the same straight line.",
  i: 'points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', o: '4',
  a: 'Slopes from each anchor point',
  why: "Fix an anchor point. Every other point lies on a line through the anchor with some slope, and points sharing a slope are on the same line. Store each slope exactly as a reduced fraction `(dx, dy)`, divided by their gcd and with a fixed sign, so there is no floating-point error. The biggest group plus the anchor itself is a candidate answer.",
  ps: R`
best = 1
for each anchor i:
    cnt = {}
    for j > i:
        dx, dy = pj - pi; g = gcd(dx, dy); dx /= g; dy /= g
        normalize the sign (dx > 0, or dx == 0 and dy > 0)
        cnt[(dx, dy)]++
        best = max(best, cnt[(dx, dy)] + 1)
return best`,
  cpp: R`
class Solution {
public:
    int maxPoints(vector<vector<int>>& points) {
        int n = points.size(), best = 1;
        for (int i = 0; i < n; i++) {
            map<pair<int, int>, int> cnt;
            for (int j = i + 1; j < n; j++) {
                int dx = points[j][0] - points[i][0];
                int dy = points[j][1] - points[i][1];
                int g = gcd(dx, dy); // never 0: the points are unique
                dx /= g;
                dy /= g;
                if (dx < 0 || (dx == 0 && dy < 0)) {
                    dx = -dx;
                    dy = -dy;
                }
                best = max(best, ++cnt[{dx, dy}] + 1);
            }
        }
        return best;
    }
};`,
  tc: 'O(n² log n)', sc: 'O(n)',
  test: R`vector<vector<int>> a={{1,1},{2,2},{3,3}}, b={{1,1},{3,2},{5,3},{4,1},{2,3},{1,4}}, c={{0,0}}, d={{0,0},{0,1},{0,-1},{1,0}}; assert(Solution().maxPoints(a)==3 && Solution().maxPoints(b)==4 && Solution().maxPoints(c)==1 && Solution().maxPoints(d)==3);`,
},
{
  n: 70, t: 'Climbing Stairs', d: 'E', k: 21,
  s: "You are climbing a staircase with `n` steps. Each move climbs 1 or 2 steps. In how many distinct ways can you reach the top?",
  i: 'n = 3', o: '3', e: '1+1+1, 1+2 and 2+1.',
  a: 'DP: Fibonacci',
  why: "The last move onto step n comes from step n − 1 or from step n − 2. So `ways(n) = ways(n-1) + ways(n-2)`, the Fibonacci recurrence. Only the last two values are needed.",
  ps: R`
a = 1, b = 1          # ways(0), ways(1)
repeat n-1 times:
    (a, b) = (b, a + b)
return b`,
  cpp: R`
class Solution {
public:
    int climbStairs(int n) {
        int a = 1, b = 1;
        for (int i = 2; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().climbStairs(1)==1 && Solution().climbStairs(2)==2 && Solution().climbStairs(3)==3 && Solution().climbStairs(45)==1836311903);`,
},
{
  n: 198, t: 'House Robber', d: 'M', k: 21,
  s: "Houses along a street hold `nums[i]` money each. You cannot rob two **adjacent** houses. Return the maximum amount you can rob.",
  i: 'nums = [2,7,9,3,1]', o: '12', e: 'Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.',
  a: 'DP: rob or skip',
  why: "For each house, either skip it and keep the best total up to the previous house, or rob it and add its money to the best total up to two houses back. `best(i) = max(best(i-1), best(i-2) + nums[i])`. Keep just two rolling values.",
  ps: R`
prev2 = 0, prev1 = 0
for x in nums:
    cur = max(prev1, prev2 + x)
    prev2 = prev1; prev1 = cur
return prev1`,
  cpp: R`
class Solution {
public:
    int rob(vector<int>& nums) {
        int prev2 = 0, prev1 = 0;
        for (int x : nums) {
            int cur = max(prev1, prev2 + x);
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={1,2,3,1}, b={2,7,9,3,1}, c={2,1,1,2}; assert(Solution().rob(a)==4 && Solution().rob(b)==12 && Solution().rob(c)==4);`,
},
{
  n: 139, t: 'Word Break', d: 'M', k: 21,
  s: "Given a string `s` and a dictionary `wordDict`, return `true` if `s` can be split into a space-separated sequence of one or more dictionary words. A word can be reused.",
  i: 's = "leetcode", wordDict = ["leet","code"]', o: 'true',
  a: 'DP over prefixes',
  why: "`dp[i]` says whether the first i characters can be split. `dp[0]` is true for the empty prefix. `dp[i]` is true if some j < i has `dp[j]` true and `s[j..i)` is a dictionary word. Only lengths that occur in the dictionary need to be tried.",
  ps: R`
dict = set(wordDict); dp[0] = true
for i in 1 .. n:
    for each word length L with L <= i:
        if dp[i-L] and s[i-L .. i) in dict:
            dp[i] = true; break
return dp[n]`,
  cpp: R`
class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dict(wordDict.begin(), wordDict.end());
        set<int> lens;
        for (auto& w : wordDict) lens.insert(w.size());
        int n = s.size();
        vector<bool> dp(n + 1, false);
        dp[0] = true;
        for (int i = 1; i <= n; i++)
            for (int L : lens) {
                if (L > i) break;
                if (dp[i - L] && dict.count(s.substr(i - L, L))) {
                    dp[i] = true;
                    break;
                }
            }
        return dp[n];
    }
};`,
  tc: 'O(n · D · L), with D distinct word lengths of size up to L', sc: 'O(n + total dictionary size)',
  test: R`vector<string> a={"leet","code"}, b={"apple","pen"}, c={"cats","dog","sand","and","cat"}; assert(Solution().wordBreak("leetcode",a) && Solution().wordBreak("applepenapple",b) && !Solution().wordBreak("catsandog",c));`,
},
{
  n: 322, t: 'Coin Change', d: 'M', k: 21,
  s: "Given coin denominations `coins` and a total `amount`, return the **fewest** coins needed to make up that amount, or `-1` if it cannot be made. You have an unlimited supply of each coin.",
  i: 'coins = [1,2,5], amount = 11', o: '3', e: '11 = 5 + 5 + 1.',
  a: 'Unbounded knapsack DP',
  why: "`dp[a]` is the fewest coins that make amount `a`, with `dp[0] = 0`. Any way of making `a` ends with some coin c, so `dp[a] = 1 + min(dp[a - c])` over all coins c ≤ a. Using `amount + 1` as infinity marks the amounts that cannot be made.",
  ps: R`
dp = [amount+1] * (amount+1); dp[0] = 0
for a in 1 .. amount:
    for c in coins:
        if c <= a: dp[a] = min(dp[a], dp[a-c] + 1)
return dp[amount] > amount ? -1 : dp[amount]`,
  cpp: R`
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int a = 1; a <= amount; a++)
            for (int c : coins)
                if (c <= a) dp[a] = min(dp[a], dp[a - c] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
  tc: 'O(amount · number of coins)', sc: 'O(amount)',
  test: R`vector<int> a={1,2,5}, b={2}, c={1}, d={186,419,83,408}; assert(Solution().coinChange(a,11)==3 && Solution().coinChange(b,3)==-1 && Solution().coinChange(c,0)==0 && Solution().coinChange(d,6249)==20);`,
},
{
  n: 300, t: 'Longest Increasing Subsequence', d: 'M', k: 21,
  s: "Given an integer array `nums`, return the length of the longest **strictly increasing** subsequence. Can you do it in O(n log n)?",
  i: 'nums = [10,9,2,5,3,7,101,18]', o: '4', e: 'One longest subsequence is [2,3,7,101].',
  a: 'Patience sorting with binary search',
  why: "Keep an array `tails`, where `tails[L]` is the smallest possible last value of an increasing subsequence of length L + 1. `tails` is always sorted. For each x, replace the first tail that is ≥ x, found by binary search, or append x if it is larger than every tail. The length of `tails` is the answer. `tails` itself is not necessarily a real subsequence.",
  ps: R`
tails = []
for x in nums:
    i = lower_bound(tails, x)
    if i == len(tails): tails.append(x)
    else: tails[i] = x
return len(tails)`,
  cpp: R`
class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto it = lower_bound(tails.begin(), tails.end(), x);
            if (it == tails.end()) tails.push_back(x);
            else *it = x;
        }
        return tails.size();
    }
};`,
  tc: 'O(n log n)', sc: 'O(n)',
  test: R`vector<int> a={10,9,2,5,3,7,101,18}, b={0,1,0,3,2,3}, c={7,7,7,7}; assert(Solution().lengthOfLIS(a)==4 && Solution().lengthOfLIS(b)==4 && Solution().lengthOfLIS(c)==1);`,
},
{
  n: 120, t: 'Triangle', d: 'M', k: 22,
  s: "Given a `triangle` array, return the minimum path sum from top to bottom. From index `i` in one row, you may move to index `i` or `i + 1` in the next row.",
  i: 'triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]', o: '11', e: '2 + 3 + 5 + 1 = 11.',
  a: 'Bottom-up DP in one row',
  why: "Work upward from the bottom row. The best path starting at `(r, i)` is its own value plus the better of the two cells below it. Overwriting a single row array works because each cell only needs values from the row below. When you reach the top, `dp[0]` is the answer.",
  ps: R`
dp = copy of the last row
for r = n-2 down to 0:
    for i in 0 .. r:
        dp[i] = triangle[r][i] + min(dp[i], dp[i+1])
return dp[0]`,
  cpp: R`
class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        vector<int> dp = triangle.back();
        for (int r = (int)triangle.size() - 2; r >= 0; r--)
            for (int i = 0; i <= r; i++)
                dp[i] = triangle[r][i] + min(dp[i], dp[i + 1]);
        return dp[0];
    }
};`,
  tc: 'O(n²)', sc: 'O(n)',
  test: R`vector<vector<int>> a={{2},{3,4},{6,5,7},{4,1,8,3}}, b={{-10}}; assert(Solution().minimumTotal(a)==11 && Solution().minimumTotal(b)==-10);`,
},
{
  n: 64, t: 'Minimum Path Sum', d: 'M', k: 22,
  s: "Given an `m × n` grid of non-negative numbers, find a path from the top-left to the bottom-right corner, moving only **right** or **down**, that minimizes the sum of the numbers along it. Return that sum.",
  i: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', o: '7', e: 'The path 1 → 3 → 1 → 1 → 1 sums to 7.',
  a: 'Grid DP with one row',
  why: "The best way to reach a cell comes from the cell above it or the cell to its left. So `dp[c] = grid[r][c] + min(dp[c] above, dp[c-1] left)`. The first row and first column each have only one way in, so they need special handling. A single row array, updated in place, is enough.",
  ps: R`
dp[0..n-1] = +inf; dp[0] = 0
for r in 0 .. m-1:
    for c in 0 .. n-1:
        best = dp[c]                       # from above
        if c > 0: best = min(best, dp[c-1])   # from the left
        dp[c] = grid[r][c] + best
return dp[n-1]`,
  cpp: R`
class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        for (int r = 0; r < m; r++)
            for (int c = 0; c < n; c++) {
                int best = dp[c];
                if (c > 0) best = min(best, dp[c - 1]);
                dp[c] = grid[r][c] + best;
            }
        return dp[n - 1];
    }
};`,
  tc: 'O(m · n)', sc: 'O(n)',
  test: R`vector<vector<int>> a={{1,3,1},{1,5,1},{4,2,1}}, b={{1,2,3},{4,5,6}}; assert(Solution().minPathSum(a)==7 && Solution().minPathSum(b)==12);`,
},
{
  n: 63, t: 'Unique Paths II', d: 'M', k: 22,
  s: "A robot starts at the top-left of an `m × n` grid and moves only right or down. Cells containing `1` are obstacles. Return the number of unique paths to the bottom-right corner.",
  i: 'obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]', o: '2',
  a: 'Grid DP with one row',
  why: "The number of paths into a cell is the paths into the cell above plus the paths into the cell to the left, and 0 if the cell is an obstacle. In a single row array, `dp[c]` already holds the count from above, so add `dp[c-1]`. Start with `dp[0] = 1`, unless the start cell is blocked.",
  ps: R`
dp = [0] * n; dp[0] = 1
for r in 0 .. m-1:
    for c in 0 .. n-1:
        if grid[r][c] == 1: dp[c] = 0
        else if c > 0: dp[c] += dp[c-1]
return dp[n-1]`,
  cpp: R`
class Solution {
public:
    int uniquePathsWithObstacles(vector<vector<int>>& obstacleGrid) {
        int n = obstacleGrid[0].size();
        vector<long long> dp(n, 0);
        dp[0] = 1;
        for (auto& row : obstacleGrid)
            for (int c = 0; c < n; c++) {
                if (row[c] == 1) dp[c] = 0;
                else if (c > 0) dp[c] += dp[c - 1];
            }
        return (int)dp[n - 1];
    }
};`,
  tc: 'O(m · n)', sc: 'O(n)',
  test: R`vector<vector<int>> a={{0,0,0},{0,1,0},{0,0,0}}, b={{0,1},{0,0}}, c={{1}}, d={{0,0},{0,1}}; assert(Solution().uniquePathsWithObstacles(a)==2 && Solution().uniquePathsWithObstacles(b)==1 && Solution().uniquePathsWithObstacles(c)==0 && Solution().uniquePathsWithObstacles(d)==0);`,
},
{
  n: 5, t: 'Longest Palindromic Substring', d: 'M', k: 22,
  s: "Given a string `s`, return its longest palindromic substring.",
  i: 's = "babad"', o: '"bab"  ("aba" is also accepted)',
  a: 'Expand around every center',
  why: "Every palindrome mirrors around a center: one character for odd lengths, or the gap between two characters for even lengths. There are 2n − 1 centers. Expand from each while the characters on both sides match, and keep the longest. This uses O(1) space, compared with an O(n²) DP table.",
  ps: R`
best = (start 0, length 1)
for each center i:
    expand(i, i)      # odd length
    expand(i, i+1)    # even length
expand(l, r):
    while l >= 0 and r < n and s[l] == s[r]: l--; r++
    candidate = s[l+1 .. r)`,
  cpp: R`
class Solution {
public:
    string longestPalindrome(string s) {
        int n = s.size(), start = 0, len = 1;
        auto expand = [&](int l, int r) {
            while (l >= 0 && r < n && s[l] == s[r]) {
                l--;
                r++;
            }
            if (r - l - 1 > len) {
                len = r - l - 1;
                start = l + 1;
            }
        };
        for (int i = 0; i < n; i++) {
            expand(i, i);
            expand(i, i + 1);
        }
        return s.substr(start, len);
    }
};`,
  tc: 'O(n²)', sc: 'O(1)',
  test: R`string r=Solution().longestPalindrome("babad"); assert(r=="bab"||r=="aba"); assert(Solution().longestPalindrome("cbbd")=="bb" && Solution().longestPalindrome("a")=="a" && Solution().longestPalindrome("forgeeksskeegfor")=="geeksskeeg");`,
},
{
  n: 97, t: 'Interleaving String', d: 'M', k: 22,
  s: "Given strings `s1`, `s2` and `s3`, return `true` if `s3` can be formed by **interleaving** `s1` and `s2`: merging all their characters while keeping each string's own order.",
  i: 's1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"', o: 'true',
  a: '2D DP compressed to one row',
  why: "`dp[i][j]` is true if the first `i` characters of s1 and the first `j` of s2 can interleave into the first `i + j` characters of s3. The last character used came from s1, which needs `dp[i-1][j]` and `s1[i-1] == s3[i+j-1]`, or from s2, which needs `dp[i][j-1]` and `s2[j-1] == s3[i+j-1]`. Row `i` only depends on row `i - 1`, so one array is enough.",
  ps: R`
if len(s1) + len(s2) != len(s3): return false
dp[j] for j in 0..n2
for i in 0 .. n1:
    for j in 0 .. n2:
        if i == 0 and j == 0: dp[0] = true; continue
        a = i > 0 and dp[j] and s1[i-1] == s3[i+j-1]
        b = j > 0 and dp[j-1] and s2[j-1] == s3[i+j-1]
        dp[j] = a or b
return dp[n2]`,
  cpp: R`
class Solution {
public:
    bool isInterleave(string s1, string s2, string s3) {
        int n1 = s1.size(), n2 = s2.size();
        if (n1 + n2 != (int)s3.size()) return false;
        vector<bool> dp(n2 + 1, false);
        for (int i = 0; i <= n1; i++)
            for (int j = 0; j <= n2; j++) {
                if (i == 0 && j == 0) { dp[0] = true; continue; }
                bool a = i > 0 && dp[j] && s1[i - 1] == s3[i + j - 1];
                bool b = j > 0 && dp[j - 1] && s2[j - 1] == s3[i + j - 1];
                dp[j] = a || b;
            }
        return dp[n2];
    }
};`,
  tc: 'O(n1 · n2)', sc: 'O(n2)',
  test: R`assert(Solution().isInterleave("aabcc","dbbca","aadbbcbcac") && !Solution().isInterleave("aabcc","dbbca","aadbbbaccc") && Solution().isInterleave("","","") && !Solution().isInterleave("a","","aa"));`,
},
{
  n: 72, t: 'Edit Distance', d: 'M', k: 22,
  s: "Given strings `word1` and `word2`, return the minimum number of operations to convert `word1` into `word2`. Each operation inserts, deletes or replaces one character.",
  i: 'word1 = "horse", word2 = "ros"', o: '3', e: 'horse → rorse (replace h with r) → rose (delete r) → ros (delete e).',
  a: '2D DP (Levenshtein distance)',
  why: "`dp[i][j]` is the distance between the first i characters of word1 and the first j of word2. If the last characters match, `dp[i][j] = dp[i-1][j-1]`. Otherwise, take 1 plus the cheapest of replacing (`dp[i-1][j-1]`), deleting (`dp[i-1][j]`) or inserting (`dp[i][j-1]`). The first row and column are i and j, since one string is empty.",
  ps: R`
dp[i][0] = i, dp[0][j] = j
for i in 1..m, j in 1..n:
    if w1[i-1] == w2[j-1]: dp[i][j] = dp[i-1][j-1]
    else: dp[i][j] = 1 + min(dp[i-1][j-1], dp[i-1][j], dp[i][j-1])
return dp[m][n]`,
  cpp: R`
class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++)
            for (int j = 1; j <= n; j++) {
                if (word1[i - 1] == word2[j - 1])
                    dp[i][j] = dp[i - 1][j - 1];
                else
                    dp[i][j] = 1 + min({dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]});
            }
        return dp[m][n];
    }
};`,
  tc: 'O(m · n)', sc: 'O(m · n), which can be cut to O(n) with two rows',
  test: R`assert(Solution().minDistance("horse","ros")==3 && Solution().minDistance("intention","execution")==5 && Solution().minDistance("","abc")==3);`,
},
{
  n: 123, t: 'Best Time to Buy and Sell Stock III', d: 'H', k: 22,
  s: "`prices[i]` is a stock's price on day `i`. Complete **at most two** transactions, without holding more than one share at a time. Return the maximum profit.",
  i: 'prices = [3,3,5,0,0,3,1,4]', o: '6', e: 'Buy at 0 and sell at 3 (+3), then buy at 1 and sell at 4 (+3).',
  a: 'State machine with four variables',
  why: "Track the best profit after each stage: first buy, first sell, second buy, second sell. Each day, every state either keeps its value or moves on from the previous stage using today's price. Updating them in order, using today's values, is safe, because buying and selling on the same day adds nothing.",
  ps: R`
buy1 = buy2 = -inf; sell1 = sell2 = 0
for p in prices:
    buy1  = max(buy1, -p)
    sell1 = max(sell1, buy1 + p)
    buy2  = max(buy2, sell1 - p)
    sell2 = max(sell2, buy2 + p)
return sell2`,
  cpp: R`
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int buy1 = INT_MIN, sell1 = 0, buy2 = INT_MIN, sell2 = 0;
        for (int p : prices) {
            buy1 = max(buy1, -p);
            sell1 = max(sell1, buy1 + p);
            buy2 = max(buy2, sell1 - p);
            sell2 = max(sell2, buy2 + p);
        }
        return sell2;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={3,3,5,0,0,3,1,4}, b={1,2,3,4,5}, c={7,6,4,3,1}; assert(Solution().maxProfit(a)==6 && Solution().maxProfit(b)==4 && Solution().maxProfit(c)==0);`,
},
{
  n: 188, t: 'Best Time to Buy and Sell Stock IV', d: 'H', k: 22,
  s: "`prices[i]` is a stock's price on day `i`. Complete **at most `k`** transactions, without holding more than one share at a time. Return the maximum profit.",
  i: 'k = 2, prices = [3,2,6,5,0,3]', o: '7', e: 'Buy at 2 and sell at 6 (+4), then buy at 0 and sell at 3 (+3).',
  a: 'Generalized buy/sell state machine',
  why: "Extend Stock III to k pairs of states: `buy[j]` is the best balance while holding a share during transaction j, and `sell[j]` is the best profit after completing j transactions. Each day, `buy[j] = max(buy[j], sell[j-1] - p)` and `sell[j] = max(sell[j], buy[j] + p)`. If `k >= n/2`, the limit never matters, so just add up every price rise.",
  ps: R`
if 2k >= n: return sum of all positive daily differences
buy[1..k] = -inf; sell[0..k] = 0
for p in prices:
    for j in 1 .. k:
        buy[j]  = max(buy[j], sell[j-1] - p)
        sell[j] = max(sell[j], buy[j] + p)
return sell[k]`,
  cpp: R`
class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        int n = prices.size();
        if (2 * k >= n) {
            int profit = 0;
            for (int i = 1; i < n; i++)
                profit += max(0, prices[i] - prices[i - 1]);
            return profit;
        }
        vector<int> buy(k + 1, INT_MIN), sell(k + 1, 0);
        for (int p : prices)
            for (int j = 1; j <= k; j++) {
                buy[j] = max(buy[j], sell[j - 1] - p);
                sell[j] = max(sell[j], buy[j] + p);
            }
        return sell[k];
    }
};`,
  tc: 'O(n · k)', sc: 'O(k)',
  test: R`vector<int> a={2,4,1}, b={3,2,6,5,0,3}, c={3,3,5,0,0,3,1,4}; assert(Solution().maxProfit(2,a)==2 && Solution().maxProfit(2,b)==7 && Solution().maxProfit(1,c)==4 && Solution().maxProfit(2,c)==6 && Solution().maxProfit(100,c)==8);`,
},
{
  n: 221, t: 'Maximal Square', d: 'M', k: 22,
  s: "Given an `m × n` binary matrix of `'0'` and `'1'`, find the largest square that contains only 1s and return its **area**.",
  i: 'matrix = [["1","0","1","0","0"],\n          ["1","0","1","1","1"],\n          ["1","1","1","1","1"],\n          ["1","0","0","1","0"]]', o: '4',
  a: 'DP: side = 1 + min(top, left, diagonal)',
  why: "`dp[r][c]` is the side of the largest all-1 square whose bottom-right corner is `(r, c)`. A square of side s fits there only if squares of side s − 1 end at the cells above, to the left and diagonally up-left. So `dp = 1 + min` of those three. Keeping one row, plus a variable for the diagonal, saves space.",
  ps: R`
dp[0..n] = 0; best = 0
for r in rows:
    prevDiag = 0
    for c in 1 .. n:
        tmp = dp[c]
        if matrix[r][c-1] == '1':
            dp[c] = 1 + min(dp[c], dp[c-1], prevDiag)
            best = max(best, dp[c])
        else: dp[c] = 0
        prevDiag = tmp
return best * best`,
  cpp: R`
class Solution {
public:
    int maximalSquare(vector<vector<char>>& matrix) {
        int n = matrix[0].size(), best = 0;
        vector<int> dp(n + 1, 0);
        for (auto& row : matrix) {
            int prevDiag = 0;
            for (int c = 1; c <= n; c++) {
                int tmp = dp[c];
                if (row[c - 1] == '1') {
                    dp[c] = 1 + min({dp[c], dp[c - 1], prevDiag});
                    best = max(best, dp[c]);
                } else {
                    dp[c] = 0;
                }
                prevDiag = tmp;
            }
        }
        return best * best;
    }
};`,
  tc: 'O(m · n)', sc: 'O(n)',
  test: R`auto a=G({"10100","10111","11111","10010"}); auto b=G({"01","10"}); auto c=G({"0"}); auto d=G({"1111","1111","1111"}); assert(Solution().maximalSquare(a)==4 && Solution().maximalSquare(b)==1 && Solution().maximalSquare(c)==0 && Solution().maximalSquare(d)==9);`,
},
  ]);
})();
