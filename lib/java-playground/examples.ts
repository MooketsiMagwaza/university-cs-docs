export type JavaPlaygroundExample = {
  id: string;
  label: string;
  description: string;
  code: string;
};

export const JAVA_PLAYGROUND_EXAMPLES: JavaPlaygroundExample[] = [
  {
    id: 'linear-search',
    label: 'Linear search',
    description: 'Change the key or the array, then predict the returned index.',
    code: `public class Main {
    // Return the first matching index, or -1; works on unsorted data.
    static int linearSearch(int[] arr, int key) {
        // Check each valid cell in index order; length itself is out of bounds.
        for (int i = 0; i < arr.length; i++) {
            // Each probe makes one equality comparison; stop at the first match.
            if (arr[i] == key) return i;
        }
        // The candidate range or scan has been exhausted without a match.
        return -1;
    }

    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {63, 29, 85, 72, 18, 42, 23, 54, 8, 32};
        // Print the result so it can be checked against the lesson's expected output.
        System.out.println("18 -> " + linearSearch(values, 18));
        // Print the result so it can be checked against the lesson's expected output.
        System.out.println("31 -> " + linearSearch(values, 31));
    }
}`,
  },
  {
    id: 'binary-search',
    label: 'Binary search',
    description: 'Print each low-mid-high probe while a sorted range shrinks.',
    code: `public class Main {
    // Ascending precondition: low..high is the inclusive set of remaining candidates.
    static int binarySearch(int[] arr, int key) {
        // Begin at the first possible index.
        int low = 0;
        // Use length-1 as the last inclusive index; an empty array gives -1.
        int high = arr.length - 1;

        // An inclusive single-cell range still requires a probe.
        while (low <= high) {
            // Integer division rounds down; this expression avoids adding large positive indexes.
            int mid = low + (high - low) / 2;
            // Print one probe's bounds; the subsequent branch may evaluate more than one key relation.
            System.out.println("low=" + low + ", mid=" + mid
                    + ", high=" + high + ", value=" + arr[mid]);
            // In ascending data a smaller midpoint excludes all candidates to its left.
            if (arr[mid] < key) low = mid + 1;
            // A larger midpoint excludes all candidates to its right.
            else if (arr[mid] > key) high = mid - 1;
            // Both strict tests were false, so return this matching index.
            else return mid;
        }
        // The candidate range or scan has been exhausted without a match.
        return -1;
    }

    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {2, 6, 12, 32, 50, 59, 76, 83, 90};
        // Print the result so it can be checked against the lesson's expected output.
        System.out.println("result=" + binarySearch(values, 88));
    }
}`,
  },
  {
    id: 'bubble-sort',
    label: 'Bubble sort trace',
    description: 'Watch adjacent swaps move the largest remaining value to the right.',
    code: `// Use this library class by its simple name below.
import java.util.Arrays;

public class Main {
    // Strict adjacent inversions preserve equal-record order.
    static void bubbleSort(int[] arr) {
        // The suffix after end is final; exclude it from further pair scans.
        for (int end = arr.length - 1; end > 0; end--) {
            // Reset once per pass, retaining any swap observed during the entire scan.
            boolean swapped = false;
            // Visit adjacent pairs only inside the current active range.
            for (int i = 0; i < end; i++) {
                // Swap only when the left neighbour is strictly larger.
                if (arr[i] > arr[i + 1]) {
                    // Local save prevents losing a value; this is not an array write.
                    int temp = arr[i];
                    // This array assignment is one of the two writes in the swap.
                    arr[i] = arr[i + 1];
                    // This array assignment is one of the two writes in the swap.
                    arr[i + 1] = temp;
                    // At least one inversion existed, so this pass cannot stop early.
                    swapped = true;
                }
            }
            // Print the full array after a completed pass, matching the lesson's trace table.
            System.out.println("end=" + end + " " + Arrays.toString(arr));
            // One complete no-swap pass proves that the remaining prefix is ordered.
            if (!swapped) return;
        }
    }

    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {4, 2, 5, 1, 3};
        bubbleSort(values);
    }
}`,
  },
  {
    id: 'selection-sort',
    label: 'Selection sort trace',
    description: 'Find the minimum in the unsorted suffix and place it at the boundary.',
    code: `// Use this library class by its simple name below.
import java.util.Arrays;

public class Main {
    // Choose the minimum index before performing the placement swap.
    static void selectionSort(int[] arr) {
        // Fill the next sorted-prefix position; the suffix is still unsorted.
        for (int start = 0; start < arr.length - 1; start++) {
            // Initially the first unsorted position is the minimum candidate.
            int minIndex = start;
            // Scan every remaining candidate before deciding which record to place.
            for (int i = start + 1; i < arr.length; i++) {
                // Compare values, but assign the candidate's index rather than its value.
                if (arr[i] < arr[minIndex]) minIndex = i;
            }
            // Avoid a self-swap when the minimum is already at the prefix boundary.
            if (minIndex != start) {
                // Local save prevents losing a value; this is not an array write.
                int temp = arr[start];
                // This array assignment is one of the two writes in the swap.
                arr[start] = arr[minIndex];
                // This array assignment is one of the two writes in the swap.
                arr[minIndex] = temp;
            }
            // Print the full array after a completed pass, matching the lesson's trace table.
            System.out.println("start=" + start + " " + Arrays.toString(arr));
        }
    }

    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {4, 2, 5, 1, 3};
        selectionSort(values);
    }
}`,
  },
  {
    id: 'insertion-sort',
    label: 'Insertion sort trace',
    description: 'Shift larger prefix values right, then insert the saved key.',
    code: `// Use this library class by its simple name below.
import java.util.Arrays;

public class Main {
    // Grow a stable ascending prefix using a saved key and rightward shifts.
    static void insertionSort(int[] arr) {
        // The first value already forms a one-element sorted prefix.
        for (int i = 1; i < arr.length; i++) {
            // Save the key before shifting overwrites its original array cell.
            int key = arr[i];
            // Start checking at the rightmost sorted-prefix position.
            int j = i - 1;
            // Short-circuit boundary first: do not read arr[-1] after the final leftward shift.
            while (j >= 0 && arr[j] > key) {
                // One shift copies a prefix value one cell right: one array write.
                arr[j + 1] = arr[j];
                // Move the gap and the prefix scan left for the next guard.
                j--;
            }
            // Insert into the gap at j+1; even a no-shift pass executes this write.
            arr[j + 1] = key;
            // Print the full array after a completed pass, matching the lesson's trace table.
            System.out.println("i=" + i + " " + Arrays.toString(arr));
        }
    }

    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {4, 2, 5, 1, 3};
        insertionSort(values);
    }
}`,
  },
  {
    id: 'merge-sort',
    label: 'Merge sort',
    description: 'Run the divide-and-conquer implementation and alter its test data.',
    code: `import java.util.Arrays;

public class Main {
    // Inclusive range; empty and single-element ranges return without mutation.
    static void mergeSort(int[] arr, int start, int end) {
        if (start >= end) return; // Base case must precede midpoint calculation.
        int mid = start + (end - start) / 2;
        mergeSort(arr, start, mid); // Finish the entire left subtree first.
        mergeSort(arr, mid + 1, end); // Then finish the entire right subtree.
        merge(arr, start, mid, end); // Both input runs are now sorted.
    }

    static void merge(int[] arr, int start, int mid, int end) {
        int[] temp = new int[end - start + 1]; // Only this active range needs storage.
        int left = start; // Absolute index of the next unread left-run value.
        int right = mid + 1; // Absolute index of the next unread right-run value.
        int out = 0; // Relative index of the next free temporary cell.
        while (left <= mid && right <= end) { // Stop when either run is exhausted.
            if (arr[left] <= arr[right]) { // Left-first equality preserves stability.
                temp[out] = arr[left]; // One temporary-array write.
                left++; // Advance only the run that supplied the copied value.
            } else {
                temp[out] = arr[right];
                right++; // The left pointer stays in place in this branch.
            }
            out++; // Every branch has filled exactly one output cell.
        }
        while (left <= mid) { // Copy remaining sorted left values without key comparisons.
            temp[out] = arr[left];
            out++;
            left++;
        }
        while (right <= end) { // Or copy remaining sorted right values.
            temp[out] = arr[right];
            out++;
            right++;
        }
        for (int i = 0; i < temp.length; i++) {
            arr[start + i] = temp[i]; // Convert the relative temp index to the absolute destination.
        }
        // Print after copying back, in actual depth-first merge-return order.
        System.out.println("merged " + start + ".." + end + " " + Arrays.toString(arr));
    }

    public static void main(String[] args) {
        int[] values = {63, 29, 72, 85, 18, 49, 3, 54}; // Lecture's eight-value fixture.
        mergeSort(values, 0, values.length - 1);
        System.out.println("result " + Arrays.toString(values)); // Final sorted array.
    }
}`,
  },
  {
    id: 'built-in-packages',
    label: 'Built-in packages',
    description: 'Use imported library classes in one runnable source file.',
    code: `// Use this library class by its simple name below.
import java.time.LocalDate;
// Use this library class by its simple name below.
import java.util.ArrayList;
// Use this library class by its simple name below.
import java.util.Collections;

public class Main {
    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Use the imported type name to create an initially empty list.
        ArrayList<Integer> marks = new ArrayList<Integer>();
        // Populate the deterministic sample list with a mark.
        marks.add(72);
        // Populate the deterministic sample list with a mark.
        marks.add(91);
        // Populate the deterministic sample list with a mark.
        marks.add(64);
        // The imported library utility sorts the list in ascending order.
        Collections.sort(marks);

        // Print the result so it can be checked against the lesson's expected output.
        System.out.println("date=" + LocalDate.of(2026, 10, 6));
        // Print the result so it can be checked against the lesson's expected output.
        System.out.println("marks=" + marks);
    }
}`,
  },
  {
    id: 'fix-the-loop',
    label: 'Fix an off-by-one error',
    description: 'Run the broken boundary, read the diagnostic, and repair it.',
    code: `public class Main {
    // Run deterministic fixtures; changing inputs should change only the predicted results.
    public static void main(String[] args) {
        // Independent input fixture: preserve its order when predicting the trace.
        int[] values = {4, 8, 15, 16, 23, 42};

        // Fix the loop boundary so every valid element prints once.
        for (int i = 0; i <= values.length; i++) {
            // Print the result so it can be checked against the lesson's expected output.
            System.out.println(values[i]);
        }
    }
}`,
  },
  {
    id: "linear-search-recursive",
    label: "Recursive linear search",
    description: "Trace recursive first-match results and ascending/descending ordered early stops.",
    code: `public class Main {
    // Contract: return the first matching index from i onward, or -1.
    // Caller supplies 0 <= i <= arr.length; start with i=0.
    public static int linearSearchRecursive(int[] arr, int key, int i) {
        // Check before arr[i]: length is outside the valid array indexes.
        if (i >= arr.length) {
            return -1; // Empty suffix: absence is now proved.
        }
        // Exactly one equality comparison at each visited array cell.
        if (arr[i] == key) {
            return i; // Stop at the first match, including duplicate keys.
        }
        // Forward the child's index unchanged during stack unwinding.
        return linearSearchRecursive(arr, key, i + 1);
    }

    // Precondition: values are ascending. Equality comes before early exit.
    public static int orderedAscending(int[] arr, int key) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) return i; // This cell matches.
            if (arr[i] > key) return -1; // Later values can only be larger.
        }
        return -1; // The suffix was exhausted.
    }

    // Precondition: values are descending; reverse only the early-stop test.
    public static int orderedDescending(int[] arr, int key) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) return i; // Still return the first match.
            if (arr[i] < key) return -1; // Later values can only be smaller.
        }
        return -1; // No cell matched.
    }

    public static void main(String[] args) {
        // Multiple arrays exercise duplicates, absence, and an empty suffix.
        System.out.println("recursive found=" + linearSearchRecursive(new int[]{8, 4, 4}, 4, 0));
        System.out.println("recursive absent=" + linearSearchRecursive(new int[]{8, 4, 4}, 9, 0));
        System.out.println("recursive empty=" + linearSearchRecursive(new int[]{}, 9, 0));
        // Sorted early stops are valid only for their declared direction.
        System.out.println("ascending absent=" + orderedAscending(new int[]{8, 18, 34}, 31));
        System.out.println("descending found=" + orderedDescending(new int[]{34, 18, 8}, 18));
    }
}`,
  },
  {
    id: "binary-search-descending",
    label: "Binary search forms",
    description: "Compare recursive ascending search with iterative and recursive descending search.",
    code: `public class Main {
    // Ascending input; low/high are inclusive. Start at 0 and length-1.
    public static int ascendingRecursive(int[] arr, int key, int low, int high) {
        if (low > high) return -1; // Empty range: do not read a midpoint.
        int mid = low + (high - low) / 2; // Integer, overflow-safe midpoint.
        if (arr[mid] < key) {
            // Eliminate all smaller candidates, including the checked midpoint.
            return ascendingRecursive(arr, key, mid + 1, high);
        }
        if (arr[mid] > key) {
            // Forward the child's answer so a match survives stack unwinding.
            return ascendingRecursive(arr, key, low, mid - 1);
        }
        return mid; // Both strict tests failed, so the values are equal.
    }

    // Descending input: smaller midpoint values exclude the RIGHT half.
    public static int descendingIterative(int[] arr, int key) {
        int low = 0; // First possible index.
        int high = arr.length - 1; // Last possible index, inclusive.
        while (low <= high) { // A single candidate must still be checked.
            int mid = low + (high - low) / 2;
            if (arr[mid] < key) {
                high = mid - 1; // Larger keys must lie left in descending data.
            } else if (arr[mid] > key) {
                low = mid + 1; // Smaller keys must lie right.
            } else {
                return mid; // Basic search may return any duplicate match.
            }
        }
        return -1; // The possible range is exhausted.
    }

    // Same descending invariant, now expressed in recursive parameters.
    public static int descendingRecursive(int[] arr, int key, int low, int high) {
        if (low > high) return -1; // Empty-range base case.
        int mid = low + (high - low) / 2;
        if (arr[mid] < key) {
            return descendingRecursive(arr, key, low, mid - 1); // Search left.
        }
        if (arr[mid] > key) {
            return descendingRecursive(arr, key, mid + 1, high); // Search right.
        }
        return mid; // Equality succeeds at this frame.
    }

    public static void main(String[] args) {
        // Use separate ordered fixtures, including duplicate and empty inputs.
        int[] ascending = {2, 6, 12, 32, 50, 59, 76, 83, 90};
        int[] descending = {90, 83, 76, 59, 50, 32, 12, 6, 2};
        System.out.println("ascending absent=" + ascendingRecursive(ascending, 88, 0, 8));
        System.out.println("descending found=" + descendingIterative(descending, 83));
        System.out.println("descending recursive=" + descendingRecursive(descending, 83, 0, 8));
        System.out.println("empty=" + descendingRecursive(new int[]{}, 7, 0, -1));
        System.out.println("duplicate=" + ascendingRecursive(new int[]{2, 4, 4, 4, 9}, 4, 0, 4));
    }
}`,
  },
  {
    id: "bubble-sort-variants",
    label: "Bubble sort variants and recursion",
    description: "Verify 20/10/4 comparisons and descending recursion on inclusive indices 1..4.",
    code: `import java.util.Arrays;

public class Main {
    // Literal lecture version: n full passes, each with n-1 key comparisons.
    public static int lectureBubble(int[] arr) {
        int comparisons = 0; // Count key relations, excluding loop guards.
        for (int pass = 0; pass < arr.length; pass++) {
            for (int j = 0; j < arr.length - 1; j++) {
                comparisons++; // One evaluated neighbour relation.
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j]; // Local save is not an array write.
                    arr[j] = arr[j + 1]; // First array write.
                    arr[j + 1] = temp; // Second array write: swap complete.
                }
            }
        }
        return comparisons; // For n=5, return 5*4=20 even on sorted data.
    }

    // Shortened bounds: sorted suffix is excluded, but no early-stop flag.
    public static int shortenedBubble(int[] arr) {
        int comparisons = 0;
        for (int pass = 0; pass < arr.length - 1; pass++) {
            for (int j = 0; j < arr.length - 1 - pass; j++) {
                comparisons++; // Sum (n-1)+(n-2)+...+1.
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j]; // Save before overwriting either cell.
                    arr[j] = arr[j + 1]; // Array write 1.
                    arr[j + 1] = temp; // Array write 2.
                }
            }
        }
        return comparisons; // For n=5, always return 4+3+2+1=10.
    }

    // Ascending optimized version: shortening plus one flag per full pass.
    public static int earlyStopBubble(int[] arr) {
        int comparisons = 0;
        for (int pass = 0; pass < arr.length - 1; pass++) {
            boolean swapped = false; // Reset before, not during, the scan.
            for (int j = 0; j < arr.length - 1 - pass; j++) {
                comparisons++; // Exactly one key relation at each probe pair.
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1]; // Move smaller neighbour left.
                    arr[j + 1] = temp; // Move larger neighbour right.
                    swapped = true; // Any swap blocks early exit.
                }
            }
            if (!swapped) break; // All remaining adjacent pairs are ordered.
        }
        return comparisons; // Sorted n=5 input needs only four comparisons.
    }

    // Descending inclusive subrange: arr[x..y]; outside cells are untouched.
    // Require valid indexes for a nonempty range; x>=y needs no work.
    public static void descendingIterative(int[] arr, int x, int y) {
        for (int end = y; end > x; end--) {
            for (int j = x; j < end; j++) {
                if (arr[j] < arr[j + 1]) { // Strict inversion for descending order.
                    int temp = arr[j];
                    arr[j] = arr[j + 1]; // Larger value moves left.
                    arr[j + 1] = temp; // Smallest remaining value moves right.
                }
            }
        }
    }

    // January 2018 Q2(a): recurse over left-to-right passes on x..y.
    public static void descendingRecursive(int[] arr, int x, int y) {
        if (x >= y) return; // Empty or one-element range is already ordered.
        descendingPass(arr, x, y); // Fix the smallest active value at y.
        descendingRecursive(arr, x, y - 1); // Strictly shrink the active range.
    }

    // Recursive inner scan: visit neighbouring pairs from left to right.
    private static void descendingPass(int[] arr, int j, int end) {
        if (j >= end) return; // No pair remains; never read arr[end+1].
        if (arr[j] < arr[j + 1]) {
            int temp = arr[j]; // Save the left value before overwriting it.
            arr[j] = arr[j + 1]; // Array write 1.
            arr[j + 1] = temp; // Array write 2.
        }
        descendingPass(arr, j + 1, end); // Advance to the next pair.
    }

    public static void main(String[] args) {
        // Fresh arrays prevent one variant's sorting from helping another.
        System.out.println("literal=" + lectureBubble(new int[]{4, 2, 5, 1, 3}));
        System.out.println("shortened=" + shortenedBubble(new int[]{4, 2, 5, 1, 3}));
        System.out.println("sorted early=" + earlyStopBubble(new int[]{1, 2, 3, 4, 5}));
        int[] recursive = {99, 4, 1, 3, 2, -99};
        int[] iterative = recursive.clone(); // Independent copy of the same input.
        descendingRecursive(recursive, 1, 4); // Sentinels at 0 and 5 must survive.
        descendingIterative(iterative, 1, 4);
        System.out.println("recursive=" + Arrays.toString(recursive));
        System.out.println("iterative=" + Arrays.toString(iterative));
    }
}`,
  },
  {
    id: "selection-sort-descending",
    label: "Descending selection sort",
    description: "Choose maximum indexes, then place them once per pass.",
    code: `import java.util.Arrays;

public class Main {
    // Descending order: choose a maximum index, then swap once per pass.
    public static void selectionDescending(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int maxIndex = i; // Candidate starts at the first unsorted cell.
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j] > arr[maxIndex]) {
                    maxIndex = j; // Store an index, not the maximum value.
                }
            }
            if (maxIndex != i) { // Avoid self-swaps, keeping write counts precise.
                int temp = arr[i]; // Local save is not an array write.
                arr[i] = arr[maxIndex]; // Maximum enters the next prefix position.
                arr[maxIndex] = temp; // Displaced value returns to the suffix.
            }
        }
    }

    public static void main(String[] args) {
        int[] values = {4, 2, 5, 1, 3}; // Mixed ascending/descending relationships.
        selectionDescending(values);
        System.out.println(Arrays.toString(values)); // Deterministic descending result.
    }
}`,
  },
  {
    id: "insertion-sort-descending",
    label: "Descending insertion sort",
    description: "Shift smaller prefix values right and preserve duplicate keys.",
    code: `import java.util.Arrays;

public class Main {
    // Descending stable order: larger keys enter the left prefix.
    public static void insertionDescending(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int current = arr[i]; // Save before a shift overwrites arr[i].
            int j = i - 1; // Rightmost position in the already sorted prefix.
            while (j >= 0 && arr[j] < current) {
                // Boundary first: arr[-1] is never evaluated.
                arr[j + 1] = arr[j]; // One shift, one array write.
                j--; // The gap and the scan move one cell left.
            }
            arr[j + 1] = current; // One insertion write, including a no-shift pass.
        }
    }

    public static void main(String[] args) {
        // Independent fixtures check direction, duplicates, and boundaries.
        int[] mixed = {4, 2, 5, 1, 3};
        int[] duplicate = {2, 2, 1, 3};
        int[] empty = {};
        int[] singleton = {7};
        insertionDescending(mixed);
        insertionDescending(duplicate);
        insertionDescending(empty);
        insertionDescending(singleton);
        // Print every fixture so the displayed output is directly verifiable.
        System.out.println("mixed=" + Arrays.toString(mixed));
        System.out.println("duplicates=" + Arrays.toString(duplicate));
        System.out.println("empty=" + Arrays.toString(empty));
        System.out.println("singleton=" + Arrays.toString(singleton));
    }
}`,
  },
  {
    id: "tagged-sort-stability",
    label: "Tagged duplicate stability",
    description: "Compare the order of equal-key records after bubble, insertion, and selection.",
    code: `import java.util.Arrays;

public class Main {
    // Equal keys have distinct labels so their original order is observable.
    static class Card {
        final int key;
        final String tag;
        Card(int key, String tag) { this.key = key; this.tag = tag; }
        public String toString() { return key + tag; } // Display both key and identity.
    }

    static void bubble(Card[] arr) {
        for (int end = arr.length - 1; end > 0; end--) {
            for (int j = 0; j < end; j++) {
                if (arr[j].key > arr[j + 1].key) { // Strict: equal records never cross.
                    Card temp = arr[j]; // Move whole records, including labels.
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    static void insertion(Card[] arr) {
        for (int i = 1; i < arr.length; i++) {
            Card current = arr[i]; // Preserve the whole key/tag pair.
            int j = i - 1;
            while (j >= 0 && arr[j].key > current.key) { // Equality stops shifting.
                arr[j + 1] = arr[j]; // Copy the record reference right.
                j--;
            }
            arr[j + 1] = current; // Insert after any equal-key predecessor.
        }
    }

    static void selection(Card[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            int minIndex = i;
            for (int j = i + 1; j < arr.length; j++) {
                if (arr[j].key < arr[minIndex].key) minIndex = j;
            }
            if (minIndex != i) {
                Card temp = arr[i]; // A distant swap can jump over an equal record.
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
            }
        }
    }

    public static void main(String[] args) {
        Card[] input = {new Card(2, "A"), new Card(2, "B"), new Card(1, "C")};
        // Each shallow clone is sufficient: sorting changes positions, not cards.
        Card[] b = input.clone(), i = input.clone(), s = input.clone();
        bubble(b);
        insertion(i);
        selection(s);
        System.out.println("bubble=" + Arrays.toString(b));
        System.out.println("insertion=" + Arrays.toString(i));
        System.out.println("selection=" + Arrays.toString(s));
    }
}`,
  },
];

export function getJavaPlaygroundExample(id?: string) {
  return JAVA_PLAYGROUND_EXAMPLES.find((example) => example.id === id) ?? JAVA_PLAYGROUND_EXAMPLES[0];
}
