/* LC150 part 1: Array / String, Two Pointers */
(function () {
  const R = String.raw;
  LC150.add([
{
  n: 88, t: 'Merge Sorted Array', d: 'E', k: 0,
  s: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and integers `m` and `n`, the number of elements in each. Merge `nums2` into `nums1` **in place** so `nums1` becomes one sorted array. `nums1` has length `m + n`, and its last `n` slots are 0 placeholders.",
  i: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', o: '[1,2,2,3,5,6]',
  a: 'Three pointers, fill from the back',
  why: "The free space is at the end of `nums1`, so write the largest remaining element there. Compare the tails of both arrays and move backwards. This never overwrites an element of `nums1` that we still need.",
  ps: R`
i = m - 1, j = n - 1, k = m + n - 1
while j >= 0:
    if i >= 0 and nums1[i] > nums2[j]:
        nums1[k--] = nums1[i--]
    else:
        nums1[k--] = nums2[j--]`,
  cpp: R`
class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        int i = m - 1, j = n - 1, k = m + n - 1;
        while (j >= 0) {
            if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
            else nums1[k--] = nums2[j--];
        }
    }
};`,
  tc: 'O(m + n)', sc: 'O(1)',
  test: R`vector<int> a={1,2,3,0,0,0}, b={2,5,6}; Solution().merge(a,3,b,3); assert((a==vector<int>{1,2,2,3,5,6}));`,
},
{
  n: 27, t: 'Remove Element', d: 'E', k: 0,
  s: "Given an integer array `nums` and a value `val`, remove all occurrences of `val` **in place**. Return `k`, the number of elements not equal to `val`. The first `k` elements of `nums` must hold those elements, in any order.",
  i: 'nums = [3,2,2,3], val = 3', o: '2, nums = [2,2,_,_]',
  a: 'Two pointers (read / write)',
  why: "Scan with a read pointer. Copy every element that is not `val` to the write pointer, then advance the write pointer. At the end, the write pointer equals the number of kept elements.",
  ps: R`
k = 0
for x in nums:
    if x != val:
        nums[k++] = x
return k`,
  cpp: R`
class Solution {
public:
    int removeElement(vector<int>& nums, int val) {
        int k = 0;
        for (int x : nums)
            if (x != val) nums[k++] = x;
        return k;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={3,2,2,3}; int k=Solution().removeElement(a,3); assert(k==2 && a[0]==2 && a[1]==2);`,
},
{
  n: 26, t: 'Remove Duplicates from Sorted Array', d: 'E', k: 0,
  s: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates **in place** so each unique element appears only once, keeping the relative order. Return `k`, the number of unique elements. The first `k` slots must hold them.",
  i: 'nums = [0,0,1,1,1,2,2,3,3,4]', o: '5, nums = [0,1,2,3,4,_,_,_,_,_]',
  a: 'Two pointers (read / write)',
  why: "The array is sorted, so duplicates sit next to each other. Keep a write pointer just past the last unique value. When the read pointer finds a value different from that last unique value, append it.",
  ps: R`
if nums is empty: return 0
k = 1
for i in 1 .. n-1:
    if nums[i] != nums[k-1]:
        nums[k++] = nums[i]
return k`,
  cpp: R`
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if (nums.empty()) return 0;
        int k = 1;
        for (int i = 1; i < (int)nums.size(); i++)
            if (nums[i] != nums[k - 1]) nums[k++] = nums[i];
        return k;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={0,0,1,1,1,2,2,3,3,4}; int k=Solution().removeDuplicates(a); assert(k==5 && vector<int>(a.begin(),a.begin()+5)==vector<int>({0,1,2,3,4}));`,
},
{
  n: 80, t: 'Remove Duplicates from Sorted Array II', d: 'M', k: 0,
  s: "Given a sorted integer array `nums`, remove duplicates **in place** so each unique element appears **at most twice**, keeping the relative order. Return the new length `k`.",
  i: 'nums = [1,1,1,2,2,3]', o: '5, nums = [1,1,2,2,3,_]',
  a: 'Two pointers, compare two back',
  why: "Write `x` only if the kept prefix does not already end with two copies of it. The array is sorted, so it is enough to compare `x` with the element two positions back in the kept prefix, `nums[k-2]`.",
  ps: R`
k = 0
for x in nums:
    if k < 2 or x != nums[k-2]:
        nums[k++] = x
return k`,
  cpp: R`
class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        int k = 0;
        for (int x : nums)
            if (k < 2 || x != nums[k - 2]) nums[k++] = x;
        return k;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={1,1,1,2,2,3}; int k=Solution().removeDuplicates(a); assert(k==5 && vector<int>(a.begin(),a.begin()+5)==vector<int>({1,1,2,2,3}));`,
},
{
  n: 169, t: 'Majority Element', d: 'E', k: 0,
  s: "Given an array `nums` of size `n`, return the **majority element**: the element that appears more than ⌊n / 2⌋ times. It always exists.",
  i: 'nums = [2,2,1,1,1,2,2]', o: '2',
  a: 'Boyer–Moore voting',
  why: "Picture each majority element cancelling out one different element. The majority appears more than half the time, so it is the one left standing. Keep a candidate and a counter. The same value adds one, a different value subtracts one, and when the counter hits zero the next value becomes the candidate.",
  ps: R`
count = 0, cand = 0
for x in nums:
    if count == 0: cand = x
    count += (x == cand) ? 1 : -1
return cand`,
  cpp: R`
class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int count = 0, cand = 0;
        for (int x : nums) {
            if (count == 0) cand = x;
            count += (x == cand) ? 1 : -1;
        }
        return cand;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={2,2,1,1,1,2,2}; assert(Solution().majorityElement(a)==2);`,
},
{
  n: 189, t: 'Rotate Array', d: 'M', k: 0,
  s: "Given an integer array `nums`, rotate it to the right by `k` steps **in place**. `k` is non-negative.",
  i: 'nums = [1,2,3,4,5,6,7], k = 3', o: '[5,6,7,1,2,3,4]',
  a: 'Triple reverse',
  why: "Rotating right by k moves the last k elements to the front. Reversing the whole array puts them at the front, but backwards. Reversing each of the two parts again fixes the order inside each part.",
  ps: R`
k = k mod n
reverse(nums[0 .. n-1])
reverse(nums[0 .. k-1])
reverse(nums[k .. n-1])`,
  cpp: R`
class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        int n = nums.size();
        k %= n;
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={1,2,3,4,5,6,7}; Solution().rotate(a,3); assert((a==vector<int>{5,6,7,1,2,3,4}));`,
},
{
  n: 121, t: 'Best Time to Buy and Sell Stock', d: 'E', k: 0,
  s: "`prices[i]` is the price of a stock on day `i`. Choose one day to buy and a **later** day to sell. Return the maximum profit, or `0` if no profit is possible.",
  i: 'prices = [7,1,5,3,6,4]', o: '5', e: 'Buy on day 2 (price 1) and sell on day 5 (price 6).',
  a: 'One pass, track the minimum',
  why: "The best sale on day i always uses the cheapest price seen before day i. Track the running minimum price and the best difference so far.",
  ps: R`
minP = +infinity, best = 0
for p in prices:
    minP = min(minP, p)
    best = max(best, p - minP)
return best`,
  cpp: R`
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minP = INT_MAX, best = 0;
        for (int p : prices) {
            minP = min(minP, p);
            best = max(best, p - minP);
        }
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={7,1,5,3,6,4}; assert(Solution().maxProfit(a)==5);`,
},
{
  n: 122, t: 'Best Time to Buy and Sell Stock II', d: 'M', k: 0,
  s: "`prices[i]` is a stock's price on day `i`. You may buy and sell as many times as you like, but you can hold **at most one share** at a time. You may buy and sell on the same day. Return the maximum profit.",
  i: 'prices = [7,1,5,3,6,4]', o: '7', e: 'Buy at 1, sell at 5 (+4). Buy at 3, sell at 6 (+3).',
  a: 'Greedy: collect every rise',
  why: "Any trade spanning several days earns exactly the sum of the daily price changes inside it. So the most you can earn is the sum of every positive day-to-day difference.",
  ps: R`
profit = 0
for i in 1 .. n-1:
    if prices[i] > prices[i-1]:
        profit += prices[i] - prices[i-1]
return profit`,
  cpp: R`
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        for (int i = 1; i < (int)prices.size(); i++)
            profit += max(0, prices[i] - prices[i - 1]);
        return profit;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={7,1,5,3,6,4}; assert(Solution().maxProfit(a)==7);`,
},
{
  n: 55, t: 'Jump Game', d: 'M', k: 0,
  s: "You start at index 0 of `nums`. Each `nums[i]` is the **maximum** jump length from index `i`. Return `true` if you can reach the last index.",
  i: 'nums = [2,3,1,1,4]', o: 'true', e: 'Jump 1 step to index 1, then 3 steps to the last index.',
  a: 'Greedy farthest reach',
  why: "Track the farthest index you can reach so far. If the loop arrives at an index beyond that reach, you are stuck. Otherwise, extend the reach with `i + nums[i]`.",
  ps: R`
reach = 0
for i in 0 .. n-1:
    if i > reach: return false
    reach = max(reach, i + nums[i])
return true`,
  cpp: R`
class Solution {
public:
    bool canJump(vector<int>& nums) {
        int reach = 0;
        for (int i = 0; i < (int)nums.size(); i++) {
            if (i > reach) return false;
            reach = max(reach, i + nums[i]);
        }
        return true;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={2,3,1,1,4}, b={3,2,1,0,4}; assert(Solution().canJump(a) && !Solution().canJump(b));`,
},
{
  n: 45, t: 'Jump Game II', d: 'M', k: 0,
  s: "Each `nums[i]` is the maximum jump length from index `i`. Starting at index 0, return the **minimum number of jumps** to reach the last index. It is always reachable.",
  i: 'nums = [2,3,1,1,4]', o: '2', e: 'Jump 1 step to index 1, then 3 steps to the last index.',
  a: 'Greedy BFS by levels',
  why: "Think of it as a breadth-first search. The indices you can reach with j jumps form one window. While scanning the current window, track the farthest index you could jump to next. When you reach the end of the window, you must take another jump, and the new window ends at that farthest index.",
  ps: R`
jumps = 0, end = 0, far = 0
for i in 0 .. n-2:
    far = max(far, i + nums[i])
    if i == end:
        jumps++
        end = far
return jumps`,
  cpp: R`
class Solution {
public:
    int jump(vector<int>& nums) {
        int jumps = 0, end = 0, far = 0;
        for (int i = 0; i + 1 < (int)nums.size(); i++) {
            far = max(far, i + nums[i]);
            if (i == end) {
                jumps++;
                end = far;
            }
        }
        return jumps;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={2,3,1,1,4}, b={0}; assert(Solution().jump(a)==2 && Solution().jump(b)==0);`,
},
{
  n: 274, t: 'H-Index', d: 'M', k: 0,
  s: "`citations[i]` is the number of citations of a researcher's `i`-th paper. Return the **h-index**: the largest `h` such that the researcher has at least `h` papers with at least `h` citations each.",
  i: 'citations = [3,0,6,1,5]', o: '3', e: 'Three papers have at least 3 citations (3, 6, 5).',
  a: 'Counting-sort buckets',
  why: "The h-index can never exceed n, the number of papers. Bucket each citation count into 0..n, with anything above n going into bucket n. Then walk h from n down, adding up how many papers have at least h citations. The first h where that total reaches h is the answer.",
  ps: R`
cnt[0 .. n] = 0
for c in citations: cnt[min(c, n)]++
total = 0
for h = n down to 0:
    total += cnt[h]
    if total >= h: return h`,
  cpp: R`
class Solution {
public:
    int hIndex(vector<int>& citations) {
        int n = citations.size();
        vector<int> cnt(n + 1, 0);
        for (int c : citations) cnt[min(c, n)]++;
        int total = 0;
        for (int h = n; h >= 0; h--) {
            total += cnt[h];
            if (total >= h) return h;
        }
        return 0;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> a={3,0,6,1,5}, b={1,3,1}; assert(Solution().hIndex(a)==3 && Solution().hIndex(b)==1);`,
},
{
  n: 380, t: 'Insert Delete GetRandom O(1)', d: 'M', k: 0,
  s: "Implement `RandomizedSet`:\n- `insert(val)` adds `val` if absent and returns `true` if it was added.\n- `remove(val)` removes `val` if present and returns `true` if it was removed.\n- `getRandom()` returns a random element, each with equal probability.\n\nEvery operation must run in **average O(1)** time.",
  i: '["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"]\n        [[],[1],[2],[2],[],[1],[2],[]]',
  o: '[null,true,false,true,2,true,false,2]',
  a: 'Vector + hash map of indices',
  why: "A vector gives O(1) random access for `getRandom`. A hash map from value to index gives O(1) lookups. To delete from the middle of the vector in O(1), move the last element into the hole and pop the back.",
  ps: R`
insert(v):
    if v in pos: return false
    pos[v] = size(a); a.push(v); return true
remove(v):
    if v not in pos: return false
    i = pos[v]; last = a.back()
    a[i] = last; pos[last] = i
    a.pop(); erase pos[v]; return true
getRandom():
    return a[random index]`,
  cpp: R`
class RandomizedSet {
    vector<int> a;
    unordered_map<int, int> pos;
public:
    RandomizedSet() {}

    bool insert(int val) {
        if (pos.count(val)) return false;
        pos[val] = a.size();
        a.push_back(val);
        return true;
    }

    bool remove(int val) {
        auto it = pos.find(val);
        if (it == pos.end()) return false;
        int i = it->second, last = a.back();
        a[i] = last;
        pos[last] = i;
        a.pop_back();
        pos.erase(val);
        return true;
    }

    int getRandom() {
        return a[rand() % a.size()];
    }
};`,
  tc: 'O(1) average per operation', sc: 'O(n)',
  test: R`RandomizedSet r; assert(r.insert(1)); assert(!r.remove(2)); assert(r.insert(2)); int x=r.getRandom(); assert(x==1||x==2); assert(r.remove(1)); assert(!r.insert(2)); assert(r.getRandom()==2);`,
},
{
  n: 238, t: 'Product of Array Except Self', d: 'M', k: 0,
  s: "Given an integer array `nums`, return an array `answer` where `answer[i]` is the product of all elements of `nums` except `nums[i]`. Run in O(n) time **without using division**.",
  i: 'nums = [1,2,3,4]', o: '[24,12,8,6]',
  a: 'Prefix × suffix products',
  why: "`answer[i]` equals the product of everything to the left of i times the product of everything to the right. Fill `answer` with the left products in one forward pass. Then multiply in the right products in a backward pass, using a single running variable.",
  ps: R`
ans[0] = 1
for i in 1 .. n-1:
    ans[i] = ans[i-1] * nums[i-1]
right = 1
for i = n-1 down to 0:
    ans[i] *= right
    right *= nums[i]
return ans`,
  cpp: R`
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }
};`,
  tc: 'O(n)', sc: 'O(1) extra (the output array does not count)',
  test: R`vector<int> a={1,2,3,4}; assert((Solution().productExceptSelf(a)==vector<int>{24,12,8,6}));`,
},
{
  n: 134, t: 'Gas Station', d: 'M', k: 0,
  s: "There are `n` gas stations on a circular route. `gas[i]` is the fuel available at station `i`, and `cost[i]` is the fuel needed to drive from station `i` to `i + 1`. Starting with an empty tank, return the index of the station where you can start and complete the circuit once, or `-1` if that is impossible. If a solution exists, it is unique.",
  i: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', o: '3',
  a: 'Greedy single pass',
  why: "If total gas is less than total cost, no start works. Otherwise, drive from a candidate start. If the tank goes negative at station i, no station between the start and i can work either, because each of them would arrive at i with even less fuel. So restart from i + 1.",
  ps: R`
total = 0, tank = 0, start = 0
for i in 0 .. n-1:
    d = gas[i] - cost[i]
    total += d; tank += d
    if tank < 0:
        start = i + 1
        tank = 0
return total < 0 ? -1 : start`,
  cpp: R`
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int total = 0, tank = 0, start = 0;
        for (int i = 0; i < (int)gas.size(); i++) {
            int d = gas[i] - cost[i];
            total += d;
            tank += d;
            if (tank < 0) {
                start = i + 1;
                tank = 0;
            }
        }
        return total < 0 ? -1 : start;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> g={1,2,3,4,5}, c={3,4,5,1,2}, g2={2,3,4}, c2={3,4,3}; assert(Solution().canCompleteCircuit(g,c)==3 && Solution().canCompleteCircuit(g2,c2)==-1);`,
},
{
  n: 135, t: 'Candy', d: 'H', k: 0,
  s: "`n` children stand in a line, each with a rating in `ratings`. Every child gets at least one candy. A child with a higher rating than a neighbor must get more candy than that neighbor. Return the **minimum** total number of candies.",
  i: 'ratings = [1,0,2]', o: '5', e: 'Give 2, 1 and 2 candies.',
  a: 'Two passes (left, then right)',
  why: "Treat each neighbor rule separately. A left-to-right pass enforces the rule against the left neighbor. A right-to-left pass enforces it against the right neighbor, keeping the larger of the two requirements for each child.",
  ps: R`
c = [1] * n
for i in 1 .. n-1:
    if r[i] > r[i-1]: c[i] = c[i-1] + 1
for i = n-2 down to 0:
    if r[i] > r[i+1]: c[i] = max(c[i], c[i+1] + 1)
return sum(c)`,
  cpp: R`
class Solution {
public:
    int candy(vector<int>& ratings) {
        int n = ratings.size();
        vector<int> c(n, 1);
        for (int i = 1; i < n; i++)
            if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
        for (int i = n - 2; i >= 0; i--)
            if (ratings[i] > ratings[i + 1]) c[i] = max(c[i], c[i + 1] + 1);
        return accumulate(c.begin(), c.end(), 0);
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`vector<int> a={1,0,2}, b={1,2,2}; assert(Solution().candy(a)==5 && Solution().candy(b)==4);`,
},
{
  n: 42, t: 'Trapping Rain Water', d: 'H', k: 0,
  s: "Given `n` non-negative integers `height` describing an elevation map where each bar has width 1, compute how much water it can trap after raining.",
  i: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', o: '6',
  a: 'Two pointers',
  why: "The water above bar i is `min(maxLeft, maxRight) - height[i]`. Put pointers at both ends. The side with the lower bar is the bottleneck, since a wall at least as tall exists on the other side. Its water depends only on its own running max, so process that side and move it inward.",
  ps: R`
l = 0, r = n-1, lmax = 0, rmax = 0, water = 0
while l < r:
    if h[l] < h[r]:
        lmax = max(lmax, h[l]); water += lmax - h[l]; l++
    else:
        rmax = max(rmax, h[r]); water += rmax - h[r]; r--
return water`,
  cpp: R`
class Solution {
public:
    int trap(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1;
        int lmax = 0, rmax = 0, water = 0;
        while (l < r) {
            if (height[l] < height[r]) {
                lmax = max(lmax, height[l]);
                water += lmax - height[l++];
            } else {
                rmax = max(rmax, height[r]);
                water += rmax - height[r--];
            }
        }
        return water;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={0,1,0,2,1,0,1,3,2,1,2,1}, b={4,2,0,3,2,5}; assert(Solution().trap(a)==6 && Solution().trap(b)==9);`,
},
{
  n: 13, t: 'Roman to Integer', d: 'E', k: 0,
  s: "Convert a Roman numeral `s` to an integer. The symbols are I = 1, V = 5, X = 10, L = 50, C = 100, D = 500 and M = 1000. A smaller symbol placed before a larger one is subtracted: IV = 4, IX = 9, XL = 40, XC = 90, CD = 400, CM = 900.",
  i: 's = "MCMXCIV"', o: '1994', e: 'M = 1000, CM = 900, XC = 90 and IV = 4.',
  a: 'Scan with the subtraction rule',
  why: "Add up each symbol's value. The one exception is a symbol smaller than the symbol after it. That is a subtractive prefix, so subtract it instead.",
  ps: R`
total = 0
for i in 0 .. n-1:
    v = value(s[i])
    if i+1 < n and v < value(s[i+1]): total -= v
    else: total += v
return total`,
  cpp: R`
class Solution {
public:
    int romanToInt(string s) {
        auto val = [](char c) {
            switch (c) {
                case 'I': return 1;   case 'V': return 5;
                case 'X': return 10;  case 'L': return 50;
                case 'C': return 100; case 'D': return 500;
                default:  return 1000; // 'M'
            }
        };
        int total = 0, n = s.size();
        for (int i = 0; i < n; i++) {
            int v = val(s[i]);
            if (i + 1 < n && v < val(s[i + 1])) total -= v;
            else total += v;
        }
        return total;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().romanToInt("MCMXCIV")==1994 && Solution().romanToInt("LVIII")==58);`,
},
{
  n: 12, t: 'Integer to Roman', d: 'M', k: 0,
  s: "Convert an integer `num` with 1 ≤ num ≤ 3999 to a Roman numeral.",
  i: 'num = 1994', o: '"MCMXCIV"',
  a: 'Greedy with a value table',
  why: "List the 13 symbol values, including the subtractive pairs like CM and IV, from largest to smallest. Repeatedly append the largest value that still fits. This always produces the standard numeral.",
  ps: R`
vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
syms = [M,CM,D,CD,C,XC,L,XL,X,IX,V,IV,I]
for each (v, sym):
    while num >= v:
        out += sym; num -= v
return out`,
  cpp: R`
class Solution {
public:
    string intToRoman(int num) {
        const int vals[] = {1000, 900, 500, 400, 100, 90,
                            50, 40, 10, 9, 5, 4, 1};
        const char* syms[] = {"M", "CM", "D", "CD", "C", "XC",
                              "L", "XL", "X", "IX", "V", "IV", "I"};
        string out;
        for (int i = 0; i < 13; i++)
            while (num >= vals[i]) {
                out += syms[i];
                num -= vals[i];
            }
        return out;
    }
};`,
  tc: 'O(1), at most about 15 symbols', sc: 'O(1)',
  test: R`assert(Solution().intToRoman(1994)=="MCMXCIV" && Solution().intToRoman(3749)=="MMMDCCXLIX");`,
},
{
  n: 58, t: 'Length of Last Word', d: 'E', k: 0,
  s: "Given a string `s` of words and spaces, return the length of the **last** word.",
  i: 's = "   fly me   to   the moon  "', o: '4', e: 'The last word is "moon".',
  a: 'Scan from the end',
  why: "Skip the trailing spaces from the right. Then count characters until you reach the next space or the start of the string.",
  ps: R`
i = n - 1
while i >= 0 and s[i] == ' ': i--
len = 0
while i >= 0 and s[i] != ' ': len++; i--
return len`,
  cpp: R`
class Solution {
public:
    int lengthOfLastWord(string s) {
        int i = (int)s.size() - 1, len = 0;
        while (i >= 0 && s[i] == ' ') i--;
        while (i >= 0 && s[i] != ' ') { len++; i--; }
        return len;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().lengthOfLastWord("   fly me   to   the moon  ")==4 && Solution().lengthOfLastWord("Hello World")==5);`,
},
{
  n: 14, t: 'Longest Common Prefix', d: 'E', k: 0,
  s: "Return the longest common prefix shared by all strings in `strs`, or `\"\"` if there is none.",
  i: 'strs = ["flower","flow","flight"]', o: '"fl"',
  a: 'Vertical scanning',
  why: "Compare the strings one column at a time, using the first string as the reference. Stop at the first column where any string ends or has a different character.",
  ps: R`
for i in 0 .. len(strs[0])-1:
    c = strs[0][i]
    for s in strs[1:]:
        if i == len(s) or s[i] != c:
            return strs[0][0 .. i)
return strs[0]`,
  cpp: R`
class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        for (int i = 0; i < (int)strs[0].size(); i++) {
            char c = strs[0][i];
            for (int j = 1; j < (int)strs.size(); j++)
                if (i == (int)strs[j].size() || strs[j][i] != c)
                    return strs[0].substr(0, i);
        }
        return strs[0];
    }
};`,
  tc: 'O(S), where S is the total number of characters', sc: 'O(1)',
  test: R`vector<string> a={"flower","flow","flight"}, b={"dog","racecar","car"}; assert(Solution().longestCommonPrefix(a)=="fl" && Solution().longestCommonPrefix(b)=="");`,
},
{
  n: 151, t: 'Reverse Words in a String', d: 'M', k: 0,
  s: "Reverse the order of the words in `s`. Words are separated by one or more spaces. The result must use single spaces and have no leading or trailing spaces.",
  i: 's = "  the sky   is blue "', o: '"blue is sky the"',
  a: 'Extract words, join in reverse',
  why: "Reading with a string stream splits on any run of spaces, which gives the words directly. Join them in reverse order with single spaces. For an O(1)-extra-space version, reverse the whole string, then reverse each word and squeeze out the extra spaces.",
  ps: R`
words = split s on whitespace
out = ""
for i = len(words)-1 down to 0:
    out += words[i]
    if i > 0: out += " "
return out`,
  cpp: R`
class Solution {
public:
    string reverseWords(string s) {
        istringstream in(s);
        vector<string> words;
        string w;
        while (in >> w) words.push_back(w);
        string out;
        for (int i = (int)words.size() - 1; i >= 0; i--) {
            out += words[i];
            if (i > 0) out += ' ';
        }
        return out;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`assert(Solution().reverseWords("  the sky   is blue ")=="blue is sky the" && Solution().reverseWords("a good   example")=="example good a");`,
},
{
  n: 6, t: 'Zigzag Conversion', d: 'M', k: 0,
  s: "Write the string `s` in a zigzag pattern on `numRows` rows, going down and then diagonally up, then read it line by line.\n```text\nP   A   H   N\nA P L S I I G\nY   I   R\n```",
  i: 's = "PAYPALISHIRING", numRows = 3', o: '"PAHNAPLSIIGYIR"',
  a: 'Simulate the rows',
  why: "The characters move down the rows 0..numRows−1 and then back up. Keep a current row and a direction, append each character to its row's string, and flip the direction at the top and bottom rows. Finally, join the rows.",
  ps: R`
if numRows == 1: return s
rows = numRows empty strings; r = 0; step = 1
for c in s:
    rows[r] += c
    if r == 0: step = 1
    else if r == numRows-1: step = -1
    r += step
return concat(rows)`,
  cpp: R`
class Solution {
public:
    string convert(string s, int numRows) {
        if (numRows == 1) return s;
        vector<string> rows(numRows);
        int r = 0, step = 1;
        for (char c : s) {
            rows[r] += c;
            if (r == 0) step = 1;
            else if (r == numRows - 1) step = -1;
            r += step;
        }
        string out;
        for (auto& row : rows) out += row;
        return out;
    }
};`,
  tc: 'O(n)', sc: 'O(n)',
  test: R`assert(Solution().convert("PAYPALISHIRING",3)=="PAHNAPLSIIGYIR" && Solution().convert("PAYPALISHIRING",4)=="PINALSIGYAHRPI" && Solution().convert("A",1)=="A");`,
},
{
  n: 28, t: 'Find the Index of the First Occurrence in a String', d: 'E', k: 0,
  s: "Return the index of the first occurrence of `needle` in `haystack`, or `-1` if `needle` is not part of `haystack`.",
  i: 'haystack = "sadbutsad", needle = "sad"', o: '0',
  a: 'KMP (Knuth–Morris–Pratt)',
  why: "Precompute `lps`, which stores for each prefix of needle the longest proper prefix that is also a suffix. While scanning haystack, a mismatch falls back through `lps` instead of restarting the match. Each character is then handled O(1) times on average, so the scan is linear. A simple O(n·m) check of every start position is also accepted.",
  ps: R`
build lps for needle
j = 0
for i in 0 .. n-1:
    while j > 0 and h[i] != needle[j]: j = lps[j-1]
    if h[i] == needle[j]: j++
    if j == m: return i - m + 1
return -1`,
  cpp: R`
class Solution {
public:
    int strStr(string haystack, string needle) {
        int n = haystack.size(), m = needle.size();
        if (m == 0) return 0;
        vector<int> lps(m, 0);
        for (int i = 1, k = 0; i < m; i++) {
            while (k > 0 && needle[i] != needle[k]) k = lps[k - 1];
            if (needle[i] == needle[k]) k++;
            lps[i] = k;
        }
        for (int i = 0, j = 0; i < n; i++) {
            while (j > 0 && haystack[i] != needle[j]) j = lps[j - 1];
            if (haystack[i] == needle[j]) j++;
            if (j == m) return i - m + 1;
        }
        return -1;
    }
};`,
  tc: 'O(n + m)', sc: 'O(m)',
  test: R`assert(Solution().strStr("sadbutsad","sad")==0 && Solution().strStr("leetcode","leeto")==-1 && Solution().strStr("aabaaabaaac","aabaaac")==4);`,
},
{
  n: 68, t: 'Text Justification', d: 'H', k: 0,
  s: "Given an array of `words` and a width `maxWidth`, format the text so every line has exactly `maxWidth` characters and is fully justified. Pack as many words into each line as possible. Spread the extra spaces as evenly as possible between words, giving the left gaps more when they cannot be equal. The last line, and any line with a single word, is left-justified and padded with spaces on the right.",
  i: 'words = ["This","is","an","example","of","text","justification."], maxWidth = 16',
  o: '["This    is    an",\n         "example  of text",\n         "justification.  "]',
  a: 'Greedy line packing',
  why: "Greedily add words while their letters plus one space between each still fit. Then the spaces to place are `maxWidth - letters`. Split them over the gaps so each gap gets `spaces / gaps` and the first `spaces % gaps` gaps get one extra.",
  ps: R`
i = 0
while i < n:
    j = i, len = 0
    while j < n and len + len(words[j]) + (j - i) <= W:
        len += len(words[j]); j++
    gaps = j - i - 1
    if j == n or gaps == 0:
        line = words[i..j) joined by " ", padded right to W
    else:
        sp = (W - len) / gaps; extra = (W - len) % gaps
        join words[i..j) using sp spaces (+1 for the first extra gaps)
    add line; i = j`,
  cpp: R`
class Solution {
public:
    vector<string> fullJustify(vector<string>& words, int maxWidth) {
        vector<string> res;
        int n = words.size(), i = 0;
        while (i < n) {
            int j = i, len = 0;
            while (j < n && len + (int)words[j].size() + (j - i) <= maxWidth)
                len += words[j++].size();
            int gaps = j - i - 1;
            string line;
            if (j == n || gaps == 0) {
                for (int k = i; k < j; k++) {
                    line += words[k];
                    if (k < j - 1) line += ' ';
                }
                line += string(maxWidth - line.size(), ' ');
            } else {
                int sp = (maxWidth - len) / gaps;
                int extra = (maxWidth - len) % gaps;
                for (int k = i; k < j; k++) {
                    line += words[k];
                    if (k < j - 1)
                        line += string(sp + (k - i < extra ? 1 : 0), ' ');
                }
            }
            res.push_back(line);
            i = j;
        }
        return res;
    }
};`,
  tc: 'O(total characters)', sc: 'O(total characters) for the output',
  test: R`vector<string> w={"This","is","an","example","of","text","justification."}; vector<string> e={"This    is    an","example  of text","justification.  "}; assert(Solution().fullJustify(w,16)==e);
  vector<string> w2={"What","must","be","acknowledgment","shall","be"}; vector<string> e2={"What   must   be","acknowledgment  ","shall be        "}; assert(Solution().fullJustify(w2,16)==e2);`,
},
{
  n: 125, t: 'Valid Palindrome', d: 'E', k: 1,
  s: "A phrase is a palindrome if, after converting uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string `s`, return `true` if it is a palindrome.",
  i: 's = "A man, a plan, a canal: Panama"', o: 'true', e: '"amanaplanacanalpanama" is a palindrome.',
  a: 'Two pointers from both ends',
  why: "Move two pointers toward each other, skipping characters that are not letters or digits. Compare the characters case-insensitively. Any mismatch means it is not a palindrome.",
  ps: R`
l = 0, r = n-1
while l < r:
    while l < r and not alnum(s[l]): l++
    while l < r and not alnum(s[r]): r--
    if lower(s[l]) != lower(s[r]): return false
    l++; r--
return true`,
  cpp: R`
class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = (int)s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum((unsigned char)s[l])) l++;
            while (l < r && !isalnum((unsigned char)s[r])) r--;
            if (tolower((unsigned char)s[l]) != tolower((unsigned char)s[r]))
                return false;
            l++;
            r--;
        }
        return true;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`assert(Solution().isPalindrome("A man, a plan, a canal: Panama") && !Solution().isPalindrome("race a car") && Solution().isPalindrome(" "));`,
},
{
  n: 392, t: 'Is Subsequence', d: 'E', k: 1,
  s: "Given strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, meaning you can delete some characters of `t`, without reordering the rest, to get `s`.",
  i: 's = "abc", t = "ahbgdc"', o: 'true',
  a: 'Greedy two pointers',
  why: "Walk through t. Whenever its character equals the next character of s you still need, advance in s. Matching each character as early as possible never hurts, so s is a subsequence exactly when you match all of it.",
  ps: R`
i = 0
for c in t:
    if i < len(s) and s[i] == c: i++
return i == len(s)`,
  cpp: R`
class Solution {
public:
    bool isSubsequence(string s, string t) {
        int i = 0;
        for (char c : t)
            if (i < (int)s.size() && s[i] == c) i++;
        return i == (int)s.size();
    }
};`,
  tc: 'O(|t|)', sc: 'O(1)',
  test: R`assert(Solution().isSubsequence("abc","ahbgdc") && !Solution().isSubsequence("axc","ahbgdc"));`,
},
{
  n: 167, t: 'Two Sum II - Input Array Is Sorted', d: 'M', k: 1,
  s: "Given a **1-indexed** array `numbers` sorted in non-decreasing order, find two numbers that add up to `target`. Return their indices `[index1, index2]` with index1 < index2. Exactly one solution exists, and you must use only O(1) extra space.",
  i: 'numbers = [2,7,11,15], target = 9', o: '[1,2]',
  a: 'Two pointers from both ends',
  why: "Start with pointers at both ends. If the sum is too small, only moving the left pointer right can increase it. If it is too large, move the right pointer left. Each step rules out a value that cannot be part of the answer.",
  ps: R`
l = 0, r = n-1
while l < r:
    s = numbers[l] + numbers[r]
    if s == target: return [l+1, r+1]
    if s < target: l++
    else: r--`,
  cpp: R`
class Solution {
public:
    vector<int> twoSum(vector<int>& numbers, int target) {
        int l = 0, r = (int)numbers.size() - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return {l + 1, r + 1};
            if (s < target) l++;
            else r--;
        }
        return {};
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={2,7,11,15}, b={-1,0}; assert((Solution().twoSum(a,9)==vector<int>{1,2}) && (Solution().twoSum(b,-1)==vector<int>{1,2}));`,
},
{
  n: 11, t: 'Container With Most Water', d: 'M', k: 1,
  s: "You are given `height`, the heights of `n` vertical lines. Choose two lines that, together with the x-axis, form a container holding the most water. Return that maximum amount.",
  i: 'height = [1,8,6,2,5,4,8,3,7]', o: '49', e: 'The lines at index 1 (height 8) and index 8 (height 7) hold 7 × 7 = 49.',
  a: 'Two pointers, move the shorter line',
  why: "Start with the widest container. The water is limited by the shorter line. Moving the taller line inward only makes the container narrower without raising that limit, so it can never help. So always move the shorter line.",
  ps: R`
l = 0, r = n-1, best = 0
while l < r:
    best = max(best, (r - l) * min(h[l], h[r]))
    if h[l] < h[r]: l++
    else: r--
return best`,
  cpp: R`
class Solution {
public:
    int maxArea(vector<int>& height) {
        int l = 0, r = (int)height.size() - 1, best = 0;
        while (l < r) {
            best = max(best, (r - l) * min(height[l], height[r]));
            if (height[l] < height[r]) l++;
            else r--;
        }
        return best;
    }
};`,
  tc: 'O(n)', sc: 'O(1)',
  test: R`vector<int> a={1,8,6,2,5,4,8,3,7}, b={1,1}; assert(Solution().maxArea(a)==49 && Solution().maxArea(b)==1);`,
},
{
  n: 15, t: '3Sum', d: 'M', k: 1,
  s: "Given an integer array `nums`, return all **unique** triplets `[nums[i], nums[j], nums[k]]` with distinct indices whose sum is `0`.",
  i: 'nums = [-1,0,1,2,-1,-4]', o: '[[-1,-1,2],[-1,0,1]]',
  a: 'Sort + two pointers',
  why: "Sort the array. Fix the first element `nums[i]`, then use two pointers on the rest to find pairs that sum to `-nums[i]`. Skip equal neighbors to avoid duplicate triplets. Stop early once `nums[i] > 0`, because no three numbers from there can sum to zero.",
  ps: R`
sort nums
for i in 0 .. n-3:
    if nums[i] > 0: break
    if i > 0 and nums[i] == nums[i-1]: continue
    l = i+1, r = n-1
    while l < r:
        s = nums[i] + nums[l] + nums[r]
        if s < 0: l++
        else if s > 0: r--
        else:
            record triplet
            skip duplicates of nums[l] and nums[r]
            l++; r--`,
  cpp: R`
class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> res;
        int n = nums.size();
        for (int i = 0; i + 2 < n; i++) {
            if (nums[i] > 0) break;
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = n - 1;
            while (l < r) {
                int s = nums[i] + nums[l] + nums[r];
                if (s < 0) l++;
                else if (s > 0) r--;
                else {
                    res.push_back({nums[i], nums[l], nums[r]});
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++;
                    r--;
                }
            }
        }
        return res;
    }
};`,
  tc: 'O(n²)', sc: 'O(1) extra, apart from sorting and the output',
  test: R`vector<int> a={-1,0,1,2,-1,-4}, b={0,0,0,0}; assert((Solution().threeSum(a)==vector<vector<int>>{{-1,-1,2},{-1,0,1}})); assert((Solution().threeSum(b)==vector<vector<int>>{{0,0,0}}));`,
},
  ]);
})();
