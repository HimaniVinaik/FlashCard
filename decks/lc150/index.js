/* LeetCode Top Interview 150 deck.
 * Each problem is stored as structured data and turned into card text here.
 * Card text uses FlashCard's light formatting: **bold**, `code`, "## " headings,
 * "- " bullets and ``` fenced code blocks.
 */
(function () {
  'use strict';
  const TOPICS = [
    'Array / String', 'Two Pointers', 'Sliding Window', 'Matrix', 'Hashmap',
    'Intervals', 'Stack', 'Linked List', 'Binary Tree General', 'Binary Tree BFS',
    'Binary Search Tree', 'Graph General', 'Graph BFS', 'Trie', 'Backtracking',
    'Divide & Conquer', "Kadane's Algorithm", 'Binary Search', 'Heap',
    'Bit Manipulation', 'Math', '1D DP', 'Multidimensional DP',
  ];
  const DIFF = { E: '🟢 Easy', M: '🟠 Medium', H: '🔴 Hard' };
  const trim = (s) => String(s || '').replace(/^\n+|\s+$/g, '');

  function build(p) {
    const head = `**${p.n}. ${p.t}**\n${DIFF[p.d]} · ${TOPICS[p.k]}`;
    const front = [
      head,
      '',
      trim(p.s),
      '',
      '## Example',
      '```text',
      `Input:  ${trim(p.i)}`,
      `Output: ${trim(p.o)}`,
      '```',
      p.e ? `Explanation: ${trim(p.e)}` : null,
    ].filter((x) => x !== null).join('\n');
    const back = [
      head,
      '',
      `## Approach: ${p.a}`,
      '',
      '## Intuition',
      trim(p.why),
      '',
      '## Pseudocode',
      '```text',
      trim(p.ps),
      '```',
      '',
      '## C++',
      '```cpp',
      trim(p.cpp),
      '```',
      '',
      '## Complexity',
      `- Time: ${p.tc}`,
      `- Space: ${p.sc}`,
    ].join('\n');
    return { front, back };
  }

  window.LC150 = {
    id: 'lc150',
    name: 'LC',
    version: 2, // 2 = commented, step-by-step C++ solutions
    key: (p) => String(p.n),
    topics: TOPICS,
    parts: ['p1.js', 'p2.js', 'p3.js', 'p4.js', 'p5.js', 'p6.js'],
    problems: [],
    add(list) { this.problems.push(...list); },
    build,
  };
})();
