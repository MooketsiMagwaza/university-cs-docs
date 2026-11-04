/** Memory-diagram scenarios about primitives, arrays and method parameters (Lectures 2, 3 and 5, and Lecture 13's Integer[]). */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

export const arrayScenarios: Record<string, () => MemScenario> = {
  basics() {
    const B = memoryBuilder().code(['int x = 5;', 'int y = x;', 'x = 7;', 'int[] arr = new int[3];', 'arr[1] = 9;', 'int[] other = arr;', 'other[0] = 4;']);
    B.snap(-1, 'Before anything runs, memory is empty. Variables will be drawn on the left (the stack). Objects and arrays will be drawn on the right (the heap).');
    B.v('x', 5).snap(0, 'int x = 5; — x is a primitive, so its box holds the value itself. Draw a box, write its name above it, and write 5 inside.');
    B.v('y', 5).snap(1, 'int y = x; — Java copies the VALUE 5 into a brand-new box called y. x and y are not connected in any way.');
    B.sv('x', 7).snap(2, 'x = 7; — exam rule: never rub anything out. Cross out the old value (5) and write the new one next to it. y still holds 5, because it had its own copy.');
    B.arr(100, 3, { at: { x: 0, y: 160 }, cw: 62, fill: 0, t: 'int[]' })
      .v('arr', { r: 100 })
      .snap(3, 'new int[3] builds an array on the heap. We invent an address for it, 100. An int array starts full of 0s. The variable arr does not hold the array; it holds the ADDRESS 100, which we also draw as an arrow.');
    B.set(100, 1, 9).snap(4, 'arr[1] = 9; — follow the arrow from arr to the array, find index [1], cross out 0 and write 9.');
    B.v('other', { r: 100 }).snap(5, 'int[] other = arr; — this copies the address (100), not the array. Now two arrows point at the SAME array. Two names for one thing is called aliasing.');
    B.set(100, 0, 4).snap(6, 'other[0] = 4; — changes the one shared array. If you now print arr[0] you also get 4. Final diagram.');
    return B.done('Primitives vs references');
  },

  arrcreate() {
    const B = memoryBuilder().code(['int[] numbers = new int[10];', 'String[] courses = new String[7];', 'courses[0] = "CSI247";', 'courses[1] = "CSI243";']);
    B.snap(-1, "Lecture 5's memory model slide: an int array holds values, a String array holds references. The two arrays are created with their default contents.");
    B.arr(100, 10, { at: { x: 0, y: 0 }, t: 'int[]', fill: 0 }).v('numbers', { r: 100 });
    B.snap(0, 'new int[10] makes ten cells at address 100, every one holding 0 (the default of every numeric type). numbers holds the address 100: the variable is a box on the stack, the array is on the heap.');
    B.arr(200, 7, { at: { x: 0, y: 110 }, t: 'String[]' }).v('courses', { r: 200 });
    B.snap(1, 'new String[7] makes seven cells at 200. The default of a reference type is null, so all seven cells hold null: no String exists yet. A String array holds seven references, not seven Strings.');
    B.val(300, '"CSI247"', { at: { below: 200, gap: 56 } }).set(200, 0, { r: 300 });
    B.snap(2, 'courses[0] = "CSI247": the String is an object of its own, so it gets an address (300) on the heap. Slot [0] holds 300: cross out null, write 300, draw the arrow.');
    B.val(400, '"CSI243"', { at: { right: 300, gap: 40 } }).set(200, 1, { r: 400 });
    B.snap(3, 'courses[1] = "CSI243": a second String object (400) and its address in slot [1]. Slots [2] to [6] are still null. Reading courses[2].length() now would throw a NullPointerException.');
    return B.done('Creating an int array and a String array');
  },

  arrinit() {
    const B = memoryBuilder().code([
      'int[] nums = {10, 6, -7, 9, 19};',
      "char[] grades = {'A', 'B', 'C', 'D', 'E', 'F'};",
      'String[] villages = {"Mochudi", "Serowe", "Kanye"};',
    ]);
    B.snap(-1, "Lecture 5's exercise: draw the memory diagram for the three initialisers. Each variable will hold an address; each array lives on the heap.");
    B.arr(100, 5, { at: { x: 0, y: 0 }, fill: 0, t: 'int[]' }).v('nums', { r: 100 });
    [10, 6, -7, 9, 19].forEach((v, i) => B.set(100, i, v, false));
    B.snap(0, 'The braces make the array and fill it in one step: five cells, indexes 0 to 4, holding 10, 6, -7, 9 and 19. nums holds the address 100.');
    B.arr(200, 6, { at: { x: 0, y: 96 }, fill: 0, t: 'char[]' }).v('grades', { r: 200 });
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((v, i) => B.set(200, i, "'" + v + "'", false));
    B.snap(1, 'A char array of six cells at 200, each holding one character.');
    B.arr(300, 3, { at: { x: 0, y: 192 }, cw: 72, t: 'String[]' }).v('villages', { r: 300 });
    B.val(400, '"Mochudi"', { at: { below: 300, gap: 56 } }).val(500, '"Serowe"', { at: { right: 400, gap: 24 } }).val(600, '"Kanye"', { at: { right: 500, gap: 24 } });
    B.set(300, 0, { r: 400 }, false).set(300, 1, { r: 500 }, false).set(300, 2, { r: 600 }, false);
    B.snap(2, 'A String array holds references, not strings. Each cell holds the address of its own String object (400, 500, 600). The int and char arrays hold the values themselves; this one holds arrows.');
    return B.done('Initialising arrays of int, char and String');
  },

  arrloop() {
    const B = memoryBuilder().code([
      'int n = 10;',
      'int[] numbers = new int[n + 4];',
      'for (int i = 0; i < numbers.length; i++) {',
      '    if (i % 2 == 1) {',
      '        numbers[i] = i + 1;',
    ]);
    B.snap(-1, "Lecture 5's loop exercise: (a) draw the memory, (b) give the output. The array has n + 4 = 14 cells, and only the odd indexes are written.");
    B.v('n', 10).snap(0, 'int n = 10; a primitive box.');
    B.arr(100, 14, { at: { x: 0, y: 80 }, fill: 0, t: 'int[]' }).v('numbers', { r: 100 });
    B.snap(1, 'new int[n + 4] is new int[14]: indexes 0 to 13, all 0. numbers.length is 14.');
    for (let i = 1; i < 14; i += 2) {
      B.set(100, i, i + 1).snap(4, 'i = ' + i + ' is odd (i % 2 == 1), so numbers[' + i + '] = ' + i + ' + 1 = ' + (i + 1) + ' and the program prints ' + (i + 1) + '. The even indexes keep 0.');
    }
    B.snap(2, 'The loop ends at i = 14. The program prints 2, 4, 6, 8, 10, 12, 14, one per line, and then numbers.length, 14.');
    return B.done('A loop that writes the odd cells');
  },

  arrdry() {
    const B = memoryBuilder().code([
      'int[] numbers = new int[6];',
      'numbers[0] = 5;',
      'for (int i = 1; i < numbers.length; i++) {',
      '    numbers[i] = i * i + 5;',
      '    if (i > 2) {',
      '        numbers[i] = 2 * numbers[i] - numbers[i - 1];',
    ]);
    B.snap(-1, "Lecture 5's dry-run exercise: find the contents of numbers after the code. Work one value of i at a time and cross out, never erase.");
    B.arr(100, 6, { at: { x: 0, y: 0 }, fill: 0, t: 'int[]' }).v('numbers', { r: 100 });
    B.snap(0, 'A new int array of six cells, all 0.');
    B.set(100, 0, 5).snap(1, 'numbers[0] = 5.');
    B.set(100, 1, 6).snap(3, 'i = 1: numbers[1] = 1 x 1 + 5 = 6. The condition i > 2 is false, so nothing else happens.');
    B.set(100, 2, 9).snap(3, 'i = 2: numbers[2] = 2 x 2 + 5 = 9. i > 2 is false.');
    B.set(100, 3, 14).snap(3, 'i = 3: numbers[3] = 3 x 3 + 5 = 14 first.');
    B.set(100, 3, 19).snap(5, 'i = 3 is greater than 2, so numbers[3] = 2 x 14 - numbers[2] = 28 - 9 = 19.');
    B.set(100, 4, 21).snap(3, 'i = 4: numbers[4] = 4 x 4 + 5 = 21 first.');
    B.set(100, 4, 23).snap(5, 'numbers[4] = 2 x 21 - numbers[3] = 42 - 19 = 23. Note that numbers[3] is the NEW value 19.');
    B.set(100, 5, 30).snap(3, 'i = 5: numbers[5] = 5 x 5 + 5 = 30 first.');
    B.set(100, 5, 37).snap(5, 'numbers[5] = 2 x 30 - numbers[4] = 60 - 23 = 37. Final contents: 5, 6, 9, 19, 23, 37.');
    return B.done('Dry run: the contents of numbers');
  },

  arrcopy() {
    const B = memoryBuilder().code([
      'int[] a = {4, 8, 15};',
      'int[] b = a;',
      'int[] c = new int[a.length];',
      'for (int i = 0; i < a.length; i++) c[i] = a[i];',
      'a[0] = 99;',
    ]);
    B.snap(-1, 'Two ways to "copy" an array. Assigning the variable copies the ADDRESS; copying element by element builds a second array. The last line shows the difference.');
    B.arr(100, 3, { at: { x: 0, y: 0 }, fill: 0, t: 'int[]' }).v('a', { r: 100 });
    [4, 8, 15].forEach((v, i) => B.set(100, i, v, false));
    B.snap(0, 'a holds the address 100 of an array {4, 8, 15}.');
    B.v('b', { r: 100 }).snap(1, 'int[] b = a copies the address, not the array: b and a are two names for the one array at 100 (aliasing).');
    B.arr(200, 3, { at: { x: 0, y: 160 }, fill: 0, t: 'int[]' }).v('c', { r: 200 }).snap(2, 'new int[a.length] makes a SECOND array at 200, every cell 0. c holds 200.');
    [4, 8, 15].forEach((v, i) => B.set(200, i, v));
    B.snap(3, 'The loop copies the values one by one: c[i] = a[i]. Now the arrays hold the same numbers but are two separate objects.');
    B.set(100, 0, 99).snap(4, 'a[0] = 99 changes the array at 100. b sees the change, because b points at the same array: b[0] is 99. c does not, because it has its own array: c[0] is still 4.');
    return B.done('Alias or copy of an array');
  },

  strarray() {
    const B = memoryBuilder().code(['String[] names = new String[3];', 'names[0] = "Ann";', 'names[1] = "Bo";', 'names[0] = "Cy";']);
    B.snap(-1, 'A String array holds references, so replacing an element means pointing the slot at a different String. The old String is not changed.');
    B.arr(100, 3, { at: { x: 0, y: 0 }, cw: 72, t: 'String[]' }).v('names', { r: 100 }).snap(0, 'Three slots, all null: no String exists yet.');
    B.val(300, '"Ann"', { at: { below: 100, gap: 60 } }).set(100, 0, { r: 300 }).snap(1, 'names[0] = "Ann": a String object at 300, and slot [0] holds 300.');
    B.val(400, '"Bo"', { at: { right: 300, gap: 40 } }).set(100, 1, { r: 400 }).snap(2, 'names[1] = "Bo": another String object at 400, held by slot [1].');
    B.val(500, '"Cy"', { at: { right: 400, gap: 40 } }).set(100, 0, { r: 500 }).snap(3, 'names[0] = "Cy" does NOT edit "Ann": Strings cannot change. A new String object appears at 500, slot [0] is changed from 300 to 500 (cross out 300 and its arrow), and nothing points at "Ann" any more: it is garbage.');
    return B.done('Replacing an element of a String array');
  },

  array2d() {
    const B = memoryBuilder().code(['int[][] grid = new int[2][3];', 'grid[1][2] = 7;']);
    B.snap(-1, "Lecture 5 gives the syntax of a two-dimensional array. It is an array whose cells hold the addresses of other arrays: an array of arrays.");
    B.arr(100, 2, { at: { x: 0, y: 0 }, cw: 72, t: 'int[][]' }).v('grid', { r: 100 });
    B.arr(200, 3, { at: { below: 100, gap: 60 }, fill: 0, t: 'int[]' }).arr(300, 3, { at: { right: 200, gap: 50 }, fill: 0, t: 'int[]' });
    B.set(100, 0, { r: 200 }, false).set(100, 1, { r: 300 }, false);
    B.snap(0, 'new int[2][3] builds THREE arrays: the outer array (100) with two cells, and two rows of three ints (200 and 300). Each outer cell holds the address of a row. grid holds 100.');
    B.set(300, 2, 7).snap(1, 'grid[1][2] = 7: grid[1] is the cell [1] of the outer array, which holds 300; follow that address to the row, and write 7 in its cell [2]. Two arrows are followed, one for each pair of brackets.');
    return B.done('A two-dimensional array: an array of arrays');
  },

  marks() {
    const B = memoryBuilder().code(['Integer[] marks = new Integer[4];', 'marks[0] = 73;', 'marks[1] = 81;', 'marks[2] = 69;', 'marks[3] = 60;']);
    B.snap(-1, 'Integer (capital I) is a class, so each mark will be an object of its own.');
    B.arr(100, 4, { at: { x: 0, y: 0 }, t: 'Integer[]' })
      .v('marks', { r: 100 })
      .snap(0, 'An array of 4 Integer references at 100. Like every array of objects, it starts full of null.');
    [
      [73, 200],
      [81, 300],
      [69, 400],
      [60, 500],
    ].forEach(([m, a], i) => {
      B.val(a, String(m), { at: { below: 100, slot: i, gap: 60 } })
        .set(100, i, { r: a })
        .snap(i + 1, `marks[${i}] = ${m}; — Java automatically wraps the int ${m} in an Integer object (this is called autoboxing). The object gets address ${a}; slot [${i}] holds ${a}.` + (i === 3 ? ' The array is now full: there is no 5th slot, and an array can never grow.' : ''));
    });
    return B.done('Integer[] marks');
  },

  callcopy() {
    const B = memoryBuilder().code([
      'double total = 10;',
      'double t = addTax(total, 7.5);',
      '// inside addTax(double price, double rate):',
      '//   double tax = price * rate / 100;',
      '//   price = price + tax;',
      '//   return tax;',
    ]);
    B.snap(-1, "Lecture 3's Common Error 1: trying to modify a parameter. A method receives a COPY of each argument.");
    B.v('total', '10.0').snap(0, 'double total = 10; main has a variable total holding 10.0.');
    B.v('price', '10.0').v('rate', '7.5');
    B.snap(1, 'addTax(total, 7.5) is called. A new set of boxes is made for the method: price receives a COPY of total (10.0) and rate receives 7.5. total is not connected to price.');
    B.v('tax', '0.75').snap(3, 'double tax = price * rate / 100 = 10.0 x 7.5 / 100 = 0.75, a local variable of addTax.');
    B.sv('price', '10.75').snap(4, 'price = price + tax changes only the method\'s own box: 10.75. total is still 10.0. The change has no effect outside the method.');
    B.unv('price').unv('rate').unv('tax').v('t', '0.75');
    B.snap(1, 'return tax sends the value 0.75 back and the method ends: its boxes (price, rate, tax) disappear. main stores the value in t. total is still 10.0.');
    return B.done('Parameters are copies');
  },
};
