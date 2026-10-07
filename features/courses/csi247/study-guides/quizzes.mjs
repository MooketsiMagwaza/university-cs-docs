import { escape as e } from './visuals.mjs';

// Each item is [prompt, correct answer, distractor, distractor, explanation].
const arrays = [
  ['What is the last valid index of an array of length 6?', '5', '6', '7', 'Indexes start at 0, so the last index is length - 1.'],
  ['What does O(1) auxiliary space describe?', 'Extra storage stays bounded as n grows', 'Exactly one machine instruction', 'The input contains one value', 'Auxiliary space counts extra working storage, excluding the input array.'],
  ['What is a loop invariant?', 'A statement that remains true at a specified loop boundary', 'A variable that never changes', 'A loop that never terminates', 'The invariant explains why each iteration preserves progress toward a correct result.'],
];
const sorting = [
  ['What does stable sorting preserve?', 'The original relative order of records with equal keys', 'Every original array index', 'The original order of unequal keys', 'Tags such as 2a and 2b let you check whether equal-key records crossed.'],
  ['What should a correct ascending sort do with [] and [7]?', 'Leave both unchanged', 'Throw an error for both', 'Add a zero to each', 'Both inputs are already sorted; no key comparison is necessary.'],
];
const specific = {
  linear: [
    ['Does linear search require sorted input?', 'No', 'Yes, ascending only', 'Yes, descending only', 'Each position is checked directly; no ordering assumption is used to skip values.'],
    ['Search [7, 3, 7, 1] for 7 with a first-match scan. Return?', '0', '2', '7', 'The first comparison matches and returns its index, not its value.'],
    ['When may the method return -1?', 'After every candidate has failed', 'After the first failed comparison', 'When index 0 is checked', 'One failure rules out only one cell. Later cells may still contain the key.'],
    ['Worst-case key comparisons for n values?', 'n', 'log₂ n', 'n²', 'An absent key, or one first found at the last cell, requires a complete scan.'],
    ['Best-case time?', 'O(1)', 'O(n)', 'O(n²)', 'The first cell may match regardless of the total input size.'],
    ['What changes during a read-only linear search?', 'The current index', 'The order of values', 'The length of the array', 'Searching inspects values without sorting or moving them.'],
    ['What loop bound avoids reading one past the end?', 'i < arr.length', 'i <= arr.length', 'i > arr.length', 'arr[arr.length] is outside the array.'],
    ['How should Java String content be compared?', 'Use equals with an appropriate null check', 'Always use ==', 'Subtract the two Strings', '== compares references; equals compares String contents.'],
    ['What extra space can the recursive scan require?', 'O(n) call stack', 'Always O(1)', 'O(n²) array storage', 'Each failed recursive call may remain suspended until the final result returns.'],
  ],
  binary: [
    ['What precondition makes discarding half valid?', 'The range is sorted by the searched key in the expected direction', 'The key is positive', 'There are no duplicates', 'Only consistent ordering proves that one entire half cannot contain the key.'],
    ['low=0, high=9. What midpoint does low+(high-low)/2 give?', '4', '5', '9', 'Integer division floors the nonnegative offset: 9 / 2 is 4.'],
    ['Ascending data: arr[mid] < key. What update follows?', 'low = mid + 1', 'high = mid - 1', 'low = mid', 'The midpoint and every smaller value to its left are ruled out.'],
    ['Ascending data: arr[mid] > key. What update follows?', 'high = mid - 1', 'low = mid + 1', 'high = mid', 'The midpoint has failed and must be excluded along with the too-large right side.'],
    ['Why use low <= high in the loop?', 'A one-cell candidate range still needs checking', 'It allows indexes past the array', 'It guarantees the key exists', 'low == high is one remaining candidate; low > high is the empty range.'],
    ['Search the opening map for 7. Which midpoint indexes are probed?', '4, 7, 8', '5, 8', '4, 8, 9', 'The inclusive windows are 0..9, 5..9, then 8..9.'],
    ['Does ordinary binary search guarantee the first duplicate?', 'No, it returns a matching midpoint', 'Yes', 'Duplicates are illegal', 'Finding the first occurrence requires continuing left after a match.'],
    ['Worst-case time for random-access sorted data?', 'O(log n)', 'O(n²)', 'O(1)', 'Each unsuccessful probe roughly halves the remaining candidates.'],
    ['Descending data: arr[mid] > key. Which side remains possible?', 'Right; set low = mid + 1', 'Left; set high = mid - 1', 'Both halves must be retained', 'Smaller values lie to the right in descending order.'],
  ],
  selection: [
    ['When does ordinary selection sort swap?', 'After the complete suffix scan', 'Every time a new minimum is seen', 'Before looking at the suffix', 'The scan remembers an index; the final minimum is moved only after scanning.'],
    ['What does min store?', 'The index of the best candidate', 'The minimum value itself', 'The number of swaps', 'arr[min] accesses the candidate value, whereas min identifies its position.'],
    ['Opening map: the first selected minimum and destination?', '13 goes to index 0', '29 goes to index 8', '36 goes to index 0', '13 is the smallest of all nine values. It swaps with 29.'],
    ['What happens on the opening map’s sixth pass?', '66 is already in position; no swap', '66 swaps with 98', 'The algorithm stops scanning permanently', 'A no-swap pass fixes one position; it does not prove the entire remaining suffix sorted.'],
    ['Comparisons on a sorted five-value input?', '10', '4', '0', 'Selection sort still scans suffixes of lengths 4, 3, 2, 1.'],
    ['Maximum actual swaps for n values when self-swaps are skipped?', 'n - 1', 'n(n - 1)/2', 'Always zero', 'There is at most one exchange per outer pass.'],
    ['What does sorting [2a, 2b, 1] demonstrate?', 'Long swaps can reverse equal-key order', 'Selection sort is stable', 'Duplicates prevent termination', 'The first swap yields [1, 2b, 2a], so this ordinary version is unstable.'],
  ],
  insertion: [
    ['Why save key = arr[i] before shifting?', 'A shift may overwrite its original cell', 'It doubles the array length', 'It makes the key an index', 'The separate variable preserves the value that must later fill the gap.'],
    ['What is a shift?', 'Copy one value one position right', 'Exchange two values', 'Delete a value permanently', 'arr[j + 1] = arr[j] is one array write and temporarily duplicates a value.'],
    ['Where does the held key go when the loop stops?', 'arr[j + 1]', 'arr[j]', 'arr[i + 1]', 'j is just left of the gap, either at a smaller/equal value or at -1.'],
    ['Why check j >= 0 before arr[j] > key?', 'Short-circuit evaluation prevents arr[-1]', 'It prevents duplicate keys', 'Java evaluates the right side first', '&& stops evaluating when its left operand is false.'],
    ['Opening map: how many shifts insert the final key 51?', '3', '1', '4', '85, 72 and 59 shift right. 45 > 51 is false, so 51 is inserted after 45.'],
    ['Why use > rather than >= for a stable ascending sort?', 'Equal values are not shifted past the key', 'It removes duplicate values', 'It makes reverse input linear', 'Strictly larger values move; equals keep their original order.'],
    ['Why is already sorted input O(n)?', 'Each pass immediately fails its first key comparison', 'No outer iterations execute', 'Each pass sorts the whole array', 'There are n - 1 insertions but no shifts; each costs constant time.'],
  ],
  bubble: [
    ['Which values are compared?', 'Neighbours arr[j] and arr[j + 1]', 'Only the first and last values', 'Every value with one held key', 'Adjacent inversions are exchanged as the scan moves left to right.'],
    ['What becomes final after one ascending pass?', 'The largest active value at the right edge', 'The smallest value at index 0', 'The entire array in all cases', 'Successive adjacent swaps carry a large value right through the active region.'],
    ['When may an optimized bubble sort stop early?', 'After an entire pass with no swaps', 'After one ordered pair', 'After any one swap', 'Only a complete unchanged pass proves all adjacent pairs in the active range ordered.'],
    ['When must swapped be reset to false?', 'Before every pass', 'Only before the first pass', 'After every individual comparison', 'The flag describes changes in the current pass only.'],
    ['Opening map: array after the first pass?', '[2, 4, 1, 3, 5]', '[1, 2, 3, 4, 5]', '[1, 2, 5, 4, 3]', '4 swaps with 2; 5 then swaps with 1 and 3, reaching the rightmost position.'],
    ['How many input-array writes does a normal swap make?', '2', '1', '3', 'The temporary-variable assignment is not an array write. The two array assignments are.'],
    ['Best-case time with the whole-pass early-stop flag?', 'O(n)', 'O(1)', 'O(n²)', 'An already sorted array still needs n - 1 adjacent comparisons to prove no swaps needed.'],
  ],
  merge: [
    ['What does splitting do to the array values?', 'Nothing; it divides index ranges', 'Sorts each half immediately', 'Swaps both halves', 'The recursion changes boundaries. Value copying happens during merging.'],
    ['When may a parent merge?', 'After both child sorts return', 'Before either child runs', 'Immediately after computing mid', 'A merge relies on both input runs already being sorted.'],
    ['For inclusive start..end, where does the right child begin?', 'mid + 1', 'mid', 'end + 1', 'The children must be disjoint and each must shrink toward the base case.'],
    ['What happens after one run is exhausted?', 'Copy the other run’s remaining values', 'Compare against nonexistent values', 'Discard the remaining values', 'The leftovers are already ordered and require no further key comparisons.'],
    ['Which side wins equality in a stable ascending merge?', 'Left, using <=', 'Right, using <', 'Either side, with no effect', 'Left-first ties preserve the original relative order of equal records.'],
    ['Why write arr[start + k] = temp[k]?', 'The destination subrange may begin after index 0', 'All merges start at index 0', 'It avoids the need for temporary storage', 'Without start, a merge of a later subrange overwrites the beginning of the array.'],
    ['Time and peak auxiliary space of the taught merge sort?', 'O(n log n) time; O(n) extra arrays', 'O(n²) time; O(1) extra arrays', 'O(log n) time; O(n²) extra arrays', 'Each merge level handles n values; there are about log₂ n levels. Peak live storage is not the sum of all historical allocations.'],
  ],
};
const packageQuestions = [
  ['What does an import do?', 'Allows an accessible type to be written by a shorter name', 'Installs a library', 'Changes private members to public', 'Imports affect compile-time name resolution, not installation or access control.'],
  ['Which package is automatically imported?', 'java.lang', 'java.util', 'java.io', 'String, System and Math are java.lang types and can use simple names automatically.'],
  ['Does import java.util.* include java.util.concurrent types?', 'No', 'Yes, recursively', 'Only if they are public', 'A wildcard import covers accessible types directly in that package, not its subpackages.'],
  ['What comes first in a packaged source file, after comments?', 'package declaration', 'import declarations', 'public class declaration', 'The normal source order is package, imports, then top-level type declarations.'],
  ['What is the identity of public class Helper declared in ub.cs.tools?', 'ub.cs.tools.Helper', 'src.ub.cs.tools.Helper', 'Helper.java', 'Source roots and filename extensions are not part of the fully qualified class name.'],
  ['Correct source path below source root src?', 'src/ub/cs/tools/Helper.java', 'src/ub.cs.tools/Helper.class', 'ub/cs/src/Helper.java', 'Package segments map to directories below the root; source uses the .java extension.'],
  ['What does javac -d classes select?', 'The output root for compiled classes', 'The package name', 'The class containing main', 'The compiler creates package directories beneath the output root.'],
  ['How do you launch classes/pkg/Tester.class from the project root?', 'java -classpath classes pkg.Tester', 'java -classpath classes/pkg Tester.class', 'javac pkg.Tester', 'The classpath ends above pkg; the launch argument is a dotted name with no extension.'],
  ['Can app.Main use a package-private method in pkg.B after importing B?', 'No', 'Yes, imports grant access', 'Yes, if it is static', 'Importing a class never widens its members’ access.'],
  ['Must two classes in the same package import one another?', 'No', 'Yes, always', 'Only if both are public', 'Accessible types in the same package can be named directly.'],
  ['How can a conflict between java.util.Date and java.sql.Date be resolved?', 'Use a fully qualified name or the appropriate specific import', 'Add more wildcard imports', 'Rename java.lang', 'Qualification tells the compiler exactly which Date you mean.'],
  ['What does a wrong classpath root usually prevent?', 'Finding the compiled main class', 'Parsing the package declaration in source', 'Allocating an array', 'Runtime lookup combines the root with the dotted binary name to locate the class file.'],
];

export function topicQuiz(kind) {
  const items = specific[kind] ? [...arrays, ...(['linear','binary'].includes(kind) ? [] : sorting), ...specific[kind]] : packageQuestions;
  return `<p>Answer all ${items.length} questions. Choose an option to see the reasoning; reset to retry. The printable answer key follows the questions.</p><form class="chapter-quiz" data-topic-quiz><p class="quiz-score" role="status" aria-live="polite">Answered 0 of ${items.length} · 0 correct</p>${items.map(([prompt, correct, wrong1, wrong2, why], i) => {
    const choices = [correct, wrong1, wrong2];
    const offset = i % 3;
    const options = choices.map((_, j) => choices[(j + offset) % 3]);
    const answer = options.indexOf(correct);
    return `<fieldset class="quiz-question" data-answer="${answer}"><legend>${i + 1}. ${e(prompt)}</legend>${options.map((label, j) => `<label><input type="radio" name="${kind}-q${i}" value="${j}"><span>${String.fromCharCode(65 + j)}. ${e(label)}</span></label>`).join('')}<p class="quiz-feedback" aria-live="polite" hidden></p><template>${e(why)}</template></fieldset>`;
  }).join('')}<button type="reset" class="quiz-reset">Reset quiz</button></form><details class="quiz-key"><summary>Answer key and explanations</summary><ol>${items.map(([prompt, correct, w1, w2, why], i) => `<li><strong>${e(correct)}.</strong> ${e(why)}</li>`).join('')}</ol></details>`;
}
