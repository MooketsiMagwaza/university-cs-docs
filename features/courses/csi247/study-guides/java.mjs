// Each snippet is repo-owned and also exported with each standalone guide.
export const JAVA = {
linear: `public static int linearSearch(int[] arr, int key) {
    // Every valid index must be checked until a match is found.
    for (int i = 0; i < arr.length; i++) {
        // Return the INDEX, not the value stored there.
        if (arr[i] == key) return i;
    }
    // Only report failure after all valid indexes were checked.
    return -1;
}`,
linearRec: `public static int linearSearchRec(int[] arr, int key, int index) {
    // Empty remaining suffix: do not access arr[index].
    if (index >= arr.length) return -1;
    // Equality finds the first matching position from this index.
    if (arr[index] == key) return index;
    // Start the first call at index 0; each call shrinks the suffix.
    return linearSearchRec(arr, key, index + 1);
}`,
strings: `public static int findName(String[] names, String key) {
    for (int i = 0; i < names.length; i++) {
        // Unfilled reference cells are null; && protects the method call.
        // equals compares text; == would compare object references.
        if (names[i] != null && names[i].equals(key)) return i;
    }
    return -1;
}`,
binary: `public static int binarySearch(int[] arr, int key) {
    // PRECONDITION: arr is in ascending order by the searched value.
    int low = 0, high = arr.length - 1;
    // Inclusive endpoints: a one-element range must still be checked.
    while (low <= high) {
        // Overflow-safe midpoint; integer division rounds down here.
        int mid = low + (high - low) / 2;
        if (arr[mid] == key) return mid;
        if (arr[mid] < key) {
            // Mid was already checked; exclude it from the next range.
            low = mid + 1;
        } else {
            // All values from mid rightwards are too large.
            high = mid - 1;
        }
    }
    // low > high means no candidate index remains.
    return -1;
}`,
binaryRec: `public static int binarySearchRec(int[] arr, int key, int low, int high) {
    // Empty range must return before calculating/accessing mid.
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == key) return mid;
    // Exactly one recursive child is needed; the other half is impossible.
    if (key < arr[mid]) return binarySearchRec(arr, key, low, mid - 1);
    return binarySearchRec(arr, key, mid + 1, high);
    // First call: binarySearchRec(arr, key, 0, arr.length - 1).
}`,
bubble: `public static void bubbleSort(int[] arr) {
    // After pass p, the largest p+1 values are fixed on the right.
    for (int pass = 0; pass < arr.length - 1; pass++) {
        boolean swapped = false; // Reset for THIS pass.
        // Skip the sorted suffix; j+1 remains a valid index.
        for (int j = 0; j < arr.length - 1 - pass; j++) {
            // Strict comparison leaves equal values in their original order.
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j]; // Save before overwriting.
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        // A whole pass with no swap proves every adjacent pair is ordered.
        if (!swapped) break;
    }
}`,
bubbleRec: `public static void bubbleSortRec(int[] arr, int n) {
    // n is the active prefix LENGTH, not an index.
    if (n <= 1) return;
    boolean swapped = false;
    for (int j = 0; j < n - 1; j++) {
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = temp;
            swapped = true;
        }
    }
    // The largest active value is now at n-1; shrink the prefix.
    if (swapped) bubbleSortRec(arr, n - 1);
    // First call: bubbleSortRec(arr, arr.length).
}`,
selection: `public static void selectionSort(int[] arr) {
    // Fill each final position from left to right.
    for (int i = 0; i < arr.length - 1; i++) {
        int min = i; // Store an INDEX, not a value.
        // Scan the complete unsorted suffix before swapping anything.
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[min]) min = j;
        }
        // At most one swap per pass; skip a redundant self-swap.
        if (min != i) {
            int temp = arr[i]; arr[i] = arr[min]; arr[min] = temp;
        }
    }
}`,
selectionRec: `public static void selectionSortRec(int[] arr, int i) {
    // Zero or one position remains to fill.
    if (i >= arr.length - 1) return;
    int min = i;
    for (int j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[min]) min = j;
    }
    if (min != i) {
        int temp = arr[i]; arr[i] = arr[min]; arr[min] = temp;
    }
    // The completed prefix grows; the remaining suffix shrinks.
    selectionSortRec(arr, i + 1);
    // First call: selectionSortRec(arr, 0).
}`,
insertion: `public static void insertionSort(int[] arr) {
    // Prefix 0..i-1 is already sorted before each insertion.
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i]; // Preserve this value while its cell is overwritten.
        int j = i - 1;   // Compare backwards through the sorted prefix.
        // Check j first: && avoids evaluating arr[-1].
        // Strict > keeps equal values in their original order (stability).
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]; // SHIFT: copy one value one cell right.
            j--;
        }
        // The gap is after the last value <= key, or at index 0.
        arr[j + 1] = key;
    }
}`,
insertionRec: `public static void insertionSortRec(int[] arr, int n) {
    // A prefix of zero or one value is already sorted.
    if (n <= 1) return;
    // Suspend this frame until the smaller prefix has been sorted.
    insertionSortRec(arr, n - 1);
    // Work happens ON RETURN: insert the final value into the sorted prefix.
    int key = arr[n - 1], j = n - 2;
    while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
    }
    arr[j + 1] = key;
    // First call: insertionSortRec(arr, arr.length).
}`,
merge: `public static void mergeSort(int[] arr, int start, int end) {
    // Inclusive range of zero or one value: stop before splitting.
    if (start >= end) return;
    // Split INDEX RANGES. This statement does not move array values.
    int mid = start + (end - start) / 2;
    mergeSort(arr, start, mid);     // Finish the entire left subtree first.
    mergeSort(arr, mid + 1, end);   // Then finish the entire right subtree.
    // Both halves are now sorted: the merge precondition is satisfied.
    merge(arr, start, mid, end);
}

private static void merge(int[] arr, int start, int mid, int end) {
    // Protect unread input: never merge directly over unprotected values.
    int[] temp = new int[end - start + 1];
    int left = start;     // First unread value of left run start..mid.
    int right = mid + 1;  // First unread value of right run mid+1..end.
    int out = 0;          // Next free position in temp (starts at zero).
    while (left <= mid && right <= end) {
        // Left-first ties preserve the order of equal records.
        if (arr[left] <= arr[right]) {
            temp[out] = arr[left]; left++;
        } else {
            temp[out] = arr[right]; right++;
        }
        out++; // Exactly one output value was written.
    }
    // One run is exhausted. Its partner's suffix is already sorted.
    while (left <= mid) { temp[out++] = arr[left++]; }
    while (right <= end) { temp[out++] = arr[right++]; }
    // Offset matters: temp[0] belongs at arr[start], not always arr[0].
    for (int k = 0; k < temp.length; k++) arr[start + k] = temp[k];
    // First call: mergeSort(arr, 0, arr.length - 1).
}`,
imports: `package app; // The package declaration precedes imports.

import java.util.Scanner; // Makes the simple name Scanner available.
import java.util.Arrays;  // Imports one public type, not a whole library.

public class ImportDemo {
    public static void main(String[] args) {
        // System and String come from automatically imported java.lang.
        Scanner input = new Scanner(System.in);
        System.out.print("Enter one whole number: ");
        int value = input.nextInt(); // This example expects valid integer input.
        int[] values = {value, 2, 1};
        Arrays.sort(values); // Static utility method sorts in ascending order.
        System.out.println(Arrays.toString(values));
        // Equivalent spelling without a Scanner import:
        // java.util.Scanner input = new java.util.Scanner(System.in);
    }
}`,
packageA: `package pkg; // Identity pkg.A; file src/pkg/A.java.

public class A { // Public class name must match A.java.
    // Other packages may call this public method on this public class.
    public static void greet() {
        System.out.println("Hello from pkg.A");
    }
}`,
packageB: `package pkg; // File src/pkg/B.java.

public class B {
    public static int twice(int x) { return 2 * x; }
    // No access modifier: only classes in package pkg may call secret.
    static String secret() { return "pkg only"; }
}`,
packageTester: `package pkg; // File src/pkg/Tester.java.

public class Tester {
    // This exact main signature supplies the program entry point.
    public static void main(String[] args) {
        A.greet(); // Same package: no import required.
        System.out.println(B.twice(21)); // Prints 42.
        System.out.println(B.secret());  // Legal: Tester and B share pkg.
    }
}`,
packageMain: `package app; // File src/app/Main.java.

import pkg.A; // Import a public class from another package.
import pkg.B;

public class Main {
    public static void main(String[] args) {
        A.greet();
        System.out.println(B.twice(5)); // Prints 10.
        // B.secret(); // Would fail: imports do not grant package-private access.
    }
}`,
};
export const METHODS = { linear: 'linearSearch', binary: 'binarySearch', bubble: 'bubbleSort', selection: 'selectionSort', insertion: 'insertionSort', merge: 'mergeSort' };
export function runnable(kind, input, key) {
  const method = METHODS[kind];
  const args = kind === 'linear' || kind === 'binary' ? `values, ${key}` : kind === 'merge' ? 'values, 0, values.length - 1' : 'values';
  return `import java.util.Arrays;\n\npublic class ${kind[0].toUpperCase() + kind.slice(1)}Demo {\n${JAVA[kind].split('\n').map((line) => `    ${line}`).join('\n')}\n\n    public static void main(String[] args) {\n        int[] values = {${input.join(', ')}};\n        ${kind === 'linear' || kind === 'binary' ? `System.out.println(${method}(${args}));` : `${method}(${args});\n        System.out.println(Arrays.toString(values));`}\n    }\n}`;
}
