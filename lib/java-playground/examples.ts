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
    static int linearSearch(int[] arr, int key) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == key) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {63, 29, 85, 72, 18, 42, 23, 54, 8, 32};
        System.out.println("18 -> " + linearSearch(values, 18));
        System.out.println("31 -> " + linearSearch(values, 31));
    }
}`,
  },
  {
    id: 'binary-search',
    label: 'Binary search',
    description: 'Print each low-mid-high probe while a sorted range shrinks.',
    code: `public class Main {
    static int binarySearch(int[] arr, int key) {
        int low = 0;
        int high = arr.length - 1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            System.out.println("low=" + low + ", mid=" + mid
                    + ", high=" + high + ", value=" + arr[mid]);
            if (arr[mid] < key) low = mid + 1;
            else if (arr[mid] > key) high = mid - 1;
            else return mid;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] values = {2, 6, 12, 32, 50, 59, 76, 83, 90};
        System.out.println("result=" + binarySearch(values, 88));
    }
}`,
  },
  {
    id: 'bubble-sort',
    label: 'Bubble sort trace',
    description: 'Watch adjacent swaps move the largest remaining value to the right.',
    code: `import java.util.Arrays;

public class Main {
    static void bubbleSort(int[] arr) {
        for (int end = arr.length - 1; end > 0; end--) {
            boolean swapped = false;
            for (int i = 0; i < end; i++) {
                if (arr[i] > arr[i + 1]) {
                    int temp = arr[i];
                    arr[i] = arr[i + 1];
                    arr[i + 1] = temp;
                    swapped = true;
                }
            }
            System.out.println("end=" + end + " " + Arrays.toString(arr));
            if (!swapped) return;
        }
    }

    public static void main(String[] args) {
        int[] values = {4, 2, 5, 1, 3};
        bubbleSort(values);
    }
}`,
  },
  {
    id: 'selection-sort',
    label: 'Selection sort trace',
    description: 'Find the minimum in the unsorted suffix and place it at the boundary.',
    code: `import java.util.Arrays;

public class Main {
    static void selectionSort(int[] arr) {
        for (int start = 0; start < arr.length - 1; start++) {
            int minIndex = start;
            for (int i = start + 1; i < arr.length; i++) {
                if (arr[i] < arr[minIndex]) minIndex = i;
            }
            if (minIndex != start) {
                int temp = arr[start];
                arr[start] = arr[minIndex];
                arr[minIndex] = temp;
            }
            System.out.println("start=" + start + " " + Arrays.toString(arr));
        }
    }

    public static void main(String[] args) {
        int[] values = {4, 2, 5, 1, 3};
        selectionSort(values);
    }
}`,
  },
  {
    id: 'insertion-sort',
    label: 'Insertion sort trace',
    description: 'Shift larger prefix values right, then insert the saved key.',
    code: `import java.util.Arrays;

public class Main {
    static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
            System.out.println("i=" + i + " " + Arrays.toString(arr));
        }
    }

    public static void main(String[] args) {
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
    static void mergeSort(int[] arr, int left, int right) {
        if (left >= right) return;
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }

    static void merge(int[] arr, int left, int mid, int right) {
        int[] temp = new int[right - left + 1];
        int i = left, j = mid + 1, k = 0;
        while (i <= mid && j <= right) {
            temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++];
        }
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        for (int x = 0; x < temp.length; x++) arr[left + x] = temp[x];
        System.out.println("merged " + left + ".." + right + " "
                + Arrays.toString(arr));
    }

    public static void main(String[] args) {
        int[] values = {63, 29, 72, 85, 18, 49, 3, 54};
        mergeSort(values, 0, values.length - 1);
        System.out.println("result " + Arrays.toString(values));
    }
}`,
  },
  {
    id: 'built-in-packages',
    label: 'Built-in packages',
    description: 'Use imported library classes in one runnable source file.',
    code: `import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> marks = new ArrayList<Integer>();
        marks.add(72);
        marks.add(91);
        marks.add(64);
        Collections.sort(marks);

        System.out.println("date=" + LocalDate.of(2026, 10, 6));
        System.out.println("marks=" + marks);
    }
}`,
  },
  {
    id: 'fix-the-loop',
    label: 'Fix an off-by-one error',
    description: 'Run the broken boundary, read the diagnostic, and repair it.',
    code: `public class Main {
    public static void main(String[] args) {
        int[] values = {4, 8, 15, 16, 23, 42};

        // Fix the loop boundary so every valid element prints once.
        for (int i = 0; i <= values.length; i++) {
            System.out.println(values[i]);
        }
    }
}`,
  },
];

export function getJavaPlaygroundExample(id?: string) {
  return JAVA_PLAYGROUND_EXAMPLES.find((example) => example.id === id) ?? JAVA_PLAYGROUND_EXAMPLES[0];
}
