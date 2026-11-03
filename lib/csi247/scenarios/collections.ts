/**
 * Memory-diagram scenarios about the collection classes of Lecture 13 and Labs 7 and 8: an ArrayList is an object (size,
 * elementData) whose hidden array holds the ADDRESSES of the elements, each of which is an object of its own; a generic Set
 * keeps an array the same way; Java's LinkedList is an object (first, last, size) that points at doubly linked nodes.
 */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

type Builder = ReturnType<typeof memoryBuilder>;

/** The list object and, underneath it, the hidden array of `cap` slots (all null). */
function arrayList(B: Builder, o: { obj: number; arr: number; cap: number }) {
  B.obj(o.obj, [['size', 0], ['elementData', { r: o.arr }]], { at: { x: 0, y: 0 }, w: 200, t: 'ArrayList' });
  B.arr(o.arr, o.cap, { at: { below: o.obj, gap: 56 }, t: 'Object[]' });
}

export const collectionScenarios: Record<string, () => MemScenario> = {
  alist() {
    const B = memoryBuilder().opt({ history: false }).code([
      'ArrayList<Integer> list = new ArrayList<Integer>();',
      'list.add(73);',
      'list.add(81);',
      'list.add(69);',
      'list.add(60);',
      'list.add(70);',
    ]);
    B.snap(-1, 'An ArrayList is an object that hides an ordinary array inside it. The array holds ADDRESSES, because every element is an object (an Integer here). Let us watch it work.');
    arrayList(B, { obj: 200, arr: 300, cap: 10 });
    B.v('list', { r: 200 }, { t: 'ArrayList' });
    B.snap(0, 'new ArrayList<Integer>() makes the list object (200) with two fields: size, how many elements are really stored (0), and elementData, the address of the hidden array (300). The array starts with the default capacity of 10 slots, every one null.');
    [
      [73, 400],
      [81, 500],
      [69, 600],
      [60, 700],
      [70, 800],
    ].forEach(([v, a], i) => {
      B.val(a, String(v), { at: { below: 300, slot: i, gap: 56 } })
        .set(300, i, { r: a })
        .set(200, 'size', i + 1)
        .snap(i + 1, `add(${v}): autoboxing wraps the int ${v} in an Integer object (${a}). The first free slot is always at index size = ${i}: store the ADDRESS ${a} there (cross out null) and add 1 to size.` + (i === 4 ? ' Five of the ten slots are used. Nothing has to grow until the 11th add; Lecture 13 describes what happens then: see the next diagram.' : ''));
    });
    return B.done('ArrayList: add (capacity 10)');
  },

  alistinsert() {
    const B = memoryBuilder().opt({ history: false }).code(['// list holds 73, 81, 69, 60, 70 (size 5)', 'list.add(1, 55);', 'list.remove(0);']);
    B.snap(-1, 'Inserting or removing in the MIDDLE of an ArrayList moves addresses. We start from the list 73, 81, 69, 60, 70.');
    arrayList(B, { obj: 200, arr: 300, cap: 10 });
    B.v('list', { r: 200 }, { t: 'ArrayList' });
    B.set(200, 'size', 5, false);
    // the boxes sit where the FINAL arrows are straight: 55, 81, 69, 60, 70 under slots 0 to 4, and 73 (removed at the end) under slot 5
    [
      [73, 400, 5],
      [81, 500, 1],
      [69, 600, 2],
      [60, 700, 3],
      [70, 800, 4],
    ].forEach(([v, a, slot], i) => B.val(a, String(v), { at: { below: 300, slot, gap: 56 } }).set(300, i, { r: a }, false));
    B.val(900, '55', { at: { below: 300, slot: 0, gap: 56 } });
    B.snap(0, 'The starting state: five slots hold the addresses 400, 500, 600, 700 and 800. size is 5.');
    B.snap(1, 'add(1, 55): 55 must go at index 1, so everything from index 1 onwards moves one place to the RIGHT first. The copying starts at the END, so no address is overwritten before it has been copied.');
    [
      [5, 800],
      [4, 700],
      [3, 600],
      [2, 500],
    ].forEach(([k, a]) => B.set(300, k, { r: a }).snap(1, `Shift: copy the address in slot [${k - 1}] into slot [${k}]. Slot [${k}] now holds ${a}.`));
    B.set(300, 1, { r: 900 }).set(200, 'size', 6).snap(1, 'Slot [1] has been copied into slot [2], so it is free to overwrite: store the address 900 (the new Integer 55) there, and size becomes 6. The list reads 73, 55, 81, 69, 60, 70. Only addresses moved; no Integer object was copied.');
    B.clean().snap(2, 'remove(0): delete the element at index 0. Every address after it moves one place to the LEFT to close the gap, starting from the FRONT.');
    [
      [0, 900],
      [1, 500],
      [2, 600],
      [3, 700],
      [4, 800],
    ].forEach(([k, a]) => B.set(300, k, { r: a }).snap(2, `Shift: copy the address in slot [${k + 1}] into slot [${k}]. Slot [${k}] now holds ${a}.`));
    B.set(300, 5, 'null').set(200, 'size', 5).snap(2, 'The last used slot is cleared (null) and size becomes 5. The list reads 55, 81, 69, 60, 70. Nothing points at 73 (400) any more, so that Integer is garbage. remove(0) needed five copies: this is why adding or removing near the front of an ArrayList is O(n).');
    return B.done('ArrayList: insert at an index and remove, addresses shifting');
  },

  alistgrow() {
    const B = memoryBuilder().opt({ history: false }).code([
      'ArrayList<Integer> list = new ArrayList<Integer>(4);',
      'list.add(10);   list.add(20);   list.add(30);   list.add(40);',
      'list.add(50);',
    ]);
    B.snap(-1, 'Lecture 13: an ArrayList can be created with a capacity (new ArrayList<Integer>(4)). When the array is full, an add creates a bigger array, copies the elements across and carries on. This list starts with 4 slots so the growth fits on the page; the default list starts with 10 and grows the same way at the 11th add.');
    arrayList(B, { obj: 200, arr: 300, cap: 4 });
    B.v('list', { r: 200 }, { t: 'ArrayList' });
    B.snap(0, 'The list object (200), size 0, and a hidden array (300) of 4 slots, all null.');
    [
      [10, 400],
      [20, 500],
      [30, 600],
      [40, 700],
    ].forEach(([v, a], i) => {
      B.val(a, String(v), { at: { below: 300, slot: i, gap: 56 } })
        .set(300, i, { r: a })
        .set(200, 'size', i + 1)
        .snap(1, `add(${v}): a new Integer (${a}); its address goes in slot [${i}]; size becomes ${i + 1}.` + (i === 3 ? ' Now size (4) equals the length of the array (4): the hidden array is FULL.' : ''));
    });
    B.clean();
    B.arr(800, 8, { at: { x: 0, y: 444 } }).v('newArray', { r: 800 });
    B.snap(2, 'add(50): there is no free slot, so the list must grow. Step 1: make a NEW array twice as long (8 slots) at address 800, all null; inside the grow code a local variable newArray holds its address for now. (Lecture 13: "create new array with the size as twice as the current one". The real java.util.ArrayList grows by half, to 6; the idea is the same.)');
    [0, 1, 2, 3].forEach((i) => B.set(800, i, { r: 400 + i * 100 }));
    B.snap(2, 'Step 2: copy the four ADDRESSES from the old array into the same slots of the new one. The Integer objects themselves are not copied, and copying n addresses is why one grow costs O(n) time.');
    B.set(200, 'elementData', { r: 800 }).snap(2, 'Step 3: elementData now holds 800. Nothing points at the old array (300) any more, so it is garbage.');
    B.unv('newArray').val(900, '50', { at: { x: 296, y: 334 } }).set(800, 4, { r: 900 }).set(200, 'size', 5);
    B.snap(2, 'Step 4: there is room now. Store the new Integer 50 (900) at index size = 4, and size becomes 5. Slots [5] to [7] are free for the next adds.');
    return B.done('ArrayList: the hidden array grows');
  },

  alstudents() {
    const B = memoryBuilder().opt({ history: false }).code([
      'ArrayList<Student> group = new ArrayList<Student>();',
      'group.add(new Student("Ann", 19));',
      'group.add(new Student("Tom", 21));',
      'group.get(0).setAge(20);',
      'group.remove(0);',
    ]);
    B.snap(-1, 'Now the list holds OBJECTS. The hidden array holds the addresses of Student objects, exactly like the Student[] example on the memory-diagrams page.');
    arrayList(B, { obj: 200, arr: 300, cap: 10 });
    B.v('group', { r: 200 }, { t: 'ArrayList' });
    B.snap(0, 'An empty ArrayList (200) with a hidden array (300) of 10 null slots. size is 0.');
    B.val(500, '"Ann"', { at: { right: 400, dy: 36, gap: 40 } })
      .obj(400, [['name', { r: 500 }], ['age', 19]], { at: { below: 300, gap: 56 }, w: 190, t: 'Student' })
      .set(300, 0, { r: 400 })
      .set(200, 'size', 1);
    B.snap(1, 'new Student("Ann", 19) makes a Student at 400 (its name "Ann" is its own String object, 500). add() stores the ADDRESS 400 in slot [0]; size becomes 1.');
    B.val(700, '"Tom"', { at: { right: 600, dy: 36, gap: 40 } })
      .obj(600, [['name', { r: 700 }], ['age', 21]], { at: { right: 500, gap: 60, dy: -36 }, w: 190, t: 'Student' })
      .set(300, 1, { r: 600 })
      .set(200, 'size', 2);
    B.snap(2, 'A second Student at 600 goes into slot [1]; size becomes 2.');
    B.set(400, 'age', 20).snap(3, 'group.get(0) returns the address in slot [0] (400). setAge(20) runs on that object: cross out 19, write 20. The list itself did not change.');
    B.clean().set(300, 0, { r: 600 }).set(300, 1, 'null').set(200, 'size', 1);
    B.snap(4, "remove(0): slot [1]'s address (600) shifts left into [0], slot [1] becomes null, size becomes 1. Nothing points to Ann any more, so Ann and her String are garbage.");
    return B.done('ArrayList of objects');
  },

  iterator() {
    const B = memoryBuilder().opt({ history: false }).code([
      'ArrayList<Integer> nums = new ArrayList<Integer>(Arrays.asList(51, 35, 12, 81, 54, 16));',
      'Iterator<Integer> it = nums.iterator();',
      'it.next();',
      'it.next();',
      'it.next();',
      'it.remove();',
      'it.next();',
    ]);
    B.snap(-1, "Lecture 13's iterator picture, as memory. The list holds 51, 35, 12, 81, 54, 16. An iterator is a small object that remembers where it is in the list.");
    arrayList(B, { obj: 200, arr: 300, cap: 6 });
    B.v('nums', { r: 200 }, { t: 'ArrayList' });
    B.set(200, 'size', 6, false);
    [
      [51, 400],
      [35, 500],
      [12, 600],
      [81, 700],
      [54, 800],
      [16, 900],
    ].forEach(([v, a], i) => B.val(a, String(v), { at: { below: 300, slot: i, gap: 56 } }).set(300, i, { r: a }, false));
    B.snap(0, 'The ArrayList (200) holds the addresses of six Integer objects in its hidden array (300), because it was built from six values: the array has exactly 6 slots. size is 6.');
    B.obj(1000, [['cursor', 0], ['lastRet', -1]], { at: { right: 200, gap: 70 }, w: 190, t: 'Iterator' }).v('it', { r: 1000 }, { t: 'Iterator' });
    B.snap(1, 'iterator() creates an Iterator object (1000). cursor is the index of the NEXT element to return: 0, the position before the first element. lastRet is the index of the last element returned: -1 means none yet, which is why remove() would fail now.');
    B.set(1000, 'cursor', 1).set(1000, 'lastRet', 0).snap(2, 'next() returns the element at cursor (51), then cursor becomes 1 and lastRet becomes 0. The iterator now sits between 51 and 35.');
    B.set(1000, 'cursor', 2).set(1000, 'lastRet', 1).snap(3, 'next() returns 35. cursor 2, lastRet 1.');
    B.set(1000, 'cursor', 3).set(1000, 'lastRet', 2).snap(4, 'next() returns 12. cursor 3, lastRet 2. The last element seen is 12.');
    B.clean();
    [
      [2, 700],
      [3, 800],
      [4, 900],
    ].forEach(([k, a]) => B.set(300, k, { r: a }));
    B.set(300, 5, 'null').set(200, 'size', 5).set(1000, 'cursor', 2).set(1000, 'lastRet', -1);
    B.snap(5, 'remove() removes the element at lastRet (index 2, the 12): the later addresses shift one place left, the last used slot becomes null and size becomes 5. The iterator steps back with it: cursor = 2, and lastRet is -1 again, so a second remove() with no next() in between would fail.');
    B.set(1000, 'cursor', 3).set(1000, 'lastRet', 2).snap(6, 'next() returns the element at cursor 2, which is now 81. The 12 is never returned again.');
    return B.done('Iterator: next() and remove()');
  },

  personlist() {
    const B = memoryBuilder().opt({ history: false }).code([
      'ArrayList<Person> people = new ArrayList<Person>();',
      'people.add(new Person(265341, "Lesego Jones", 19));',
      'people.add(new Person(265476, "Thomas Kago", 25));',
      'people.add(new Person(673523, "Mpho Wangu", 28));',
      'people.add(new Person(118204, "Neo Dube", 22));',
      'people.remove(2);',
      'people.remove(8);',
    ]);
    B.snap(-1, 'Lab 8, question 1 (iv): the state of memory while the records are read and two items are removed. The lab asks for the three given records plus three of your own; this picture uses the three given and one extra, because six Person objects do not fit on a page. The idea is the same for any number.');
    arrayList(B, { obj: 200, arr: 300, cap: 10 });
    B.v('people', { r: 200 }, { t: 'ArrayList' });
    B.snap(0, 'An empty ArrayList (200). Its hidden array (300) is created with the default capacity of 10 slots, all null. size is 0.');
    const people = [
      [1000, 1100, 265341, '"Lesego Jones"', 19],
      [1200, 1300, 265476, '"Thomas Kago"', 25],
      [1400, 1500, 673523, '"Mpho Wangu"', 28],
      [1600, 1700, 118204, '"Neo Dube"', 22],
    ] as Array<[number, number, number, string, number]>;
    type At = { x: number; y: number } | { right: number; dy?: number; gap?: number } | { below: number; gap?: number };
    people.forEach(([addr, str, id, name, age], i) => {
      const at: At = i === 0 ? { below: 300, gap: 60 } : i === 1 ? { right: 1100, gap: 40, dy: -100 } : i === 2 ? { below: 1000, gap: 50 } : { right: 1500, gap: 40, dy: -100 };
      B.val(str, name, { at: { right: addr, dy: 100, gap: 40 } })
        .obj(addr, [['id', id], ['fullname', { r: str }], ['age', age]], { at, w: 200, t: 'Person' })
        .set(300, i, { r: addr })
        .set(200, 'size', i + 1);
      B.snap(i + 1, 'One line of the file becomes a Person (' + addr + ') whose name is its own String (' + str + '). add() stores the address of the Person in the first free slot, index ' + i + ', and size becomes ' + (i + 1) + '.');
    });
    B.clean().set(300, 2, { r: 1600 }).set(300, 3, 'null').set(200, 'size', 3);
    B.snap(5, 'remove(2) removes the third item, Mpho Wangu (1400). The address after it shifts one place left (1600 moves to index 2), index 3 becomes null and size becomes 3. Nothing points to 1400 now, so that Person and its String are garbage.');
    B.snap(6, 'remove(8): index 8 is not below size (3), so there is no item to remove. The ArrayList checks the index first, throws IndexOutOfBoundsException, and nothing in memory changes. The program stops here unless the exception is caught. This is what the lab asks you to notice.');
    return B.done('Lab 8: an ArrayList of Person, remove(2) and remove(8)');
  },

  genset() {
    const B = memoryBuilder().opt({ history: false }).code(['Set<Integer> s = new Set<Integer>();', 's.add(7);', 's.add(12);', 's.add(7);', 's.remove(7);', 's.add(5);']);
    B.snap(-1, "Lab 7's generic Set: an object that keeps an array of 10 cells for elements of type T. Here T is Integer, so every cell holds the address of an Integer object (or null when it is empty).");
    B.obj(200, [['items', { r: 300 }]], { at: { x: 0, y: 0 }, w: 190, t: 'Set' }).arr(300, 10, { at: { below: 200, gap: 56 }, t: 'Object[]' }).v('s', { r: 200 }, { t: 'Set' });
    B.snap(0, 'new Set<Integer>(): the object (200) holds the address of its array (300): 10 cells, all null (empty).');
    B.val(400, '7', { at: { below: 300, slot: 2, gap: 56 } }).set(300, 0, { r: 400 });
    B.snap(1, 'add(7): 7 is wrapped in an Integer object (400) and its address goes into the FIRST EMPTY cell, index 0.');
    B.val(500, '12', { at: { below: 300, slot: 1, gap: 56 } }).set(300, 1, { r: 500 });
    B.snap(2, 'add(12): a new Integer (500), stored in the first empty cell, now index 1.');
    B.set(300, 2, { r: 400 }).snap(3, 'add(7) again: duplicates are allowed, so the second 7 goes into the first empty cell, index 2. Autoboxing reuses the same Integer object for small values, so this cell holds the SAME address, 400.');
    B.set(300, 0, 'null').snap(4, 'remove(7): the search uses equals and finds the FIRST 7, at index 0. That cell is set back to null (the address 400 is crossed out). The 7 at index 2 stays, and there is now a gap at the start.');
    B.val(600, '5', { at: { below: 300, slot: 0, gap: 56 } }).set(300, 0, { r: 600 }).snap(5, 'add(5): the first empty cell is index 0 again, so the new Integer 5 (600) fills the gap. The set holds 5, 12, 7 in cells 0, 1 and 2.');
    return B.done('Generic Set: add into the first empty cell, remove leaves a gap');
  },

  llcourses() {
    const B = memoryBuilder().opt({ history: false }).code([
      'LinkedList<String> courses = new LinkedList<String>();',
      'courses.add("DSA");',
      'courses.add("Prob");',
      'courses.addFirst("DB");',
      'courses.removeLast();',
      'courses.add(1, "Net");',
    ]);
    B.snap(-1, "Lab 8, question 2 (iii): a LinkedList of course names. Java's LinkedList is doubly linked: the list object keeps first, last and size, and every node has prev, data and next. Each name is a String object that the node's data points at.");
    B.obj(200, [['first', 'null'], ['last', 'null'], ['size', 0]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' }).v('courses', { r: 200 }, { t: 'LinkedList' });
    B.snap(0, 'new LinkedList: first and last are null and size is 0. There is no array and no capacity: nodes are created one at a time.');
    // final order left to right: DB, Net, DSA, then Prob (removed)
    const node = { cw: 46 };
    B.val(410, '"DSA"', { at: { below: 400, slot: 'data', gap: 50 } })
      .node(400, { r: 410 }, 'null', { at: { right: 700, gap: 60 }, ...node, prev: 'null', t: 'Node' })
      .set(200, 'first', { r: 400 })
      .set(200, 'last', { r: 400 })
      .set(200, 'size', 1);
    B.snap(1, 'add("DSA") on an empty list: a String (410) and one node (400) with no neighbours: prev and next are null, data points at the String. first and last both point at the node. size 1.');
    B.val(510, '"Prob"', { at: { below: 500, slot: 'data', gap: 50 } })
      .node(500, { r: 510 }, 'null', { at: { right: 400, gap: 60 }, ...node, prev: { r: 400 }, t: 'Node' })
      .set(400, 'next', { r: 500 })
      .set(200, 'last', { r: 500 })
      .set(200, 'size', 2);
    B.snap(2, 'add("Prob") joins at the END: the new node (500) points back at 400, 400.next points forward at 500, and last moves to 500. No other element moves.');
    B.val(610, '"DB"', { at: { below: 600, slot: 'data', gap: 50 } })
      .node(600, { r: 610 }, { r: 400 }, { at: { below: 200, dx: 130, gap: 60 }, ...node, prev: 'null', t: 'Node' })
      .set(400, 'prev', { r: 600 })
      .set(200, 'first', { r: 600 })
      .set(200, 'size', 3);
    B.snap(3, 'addFirst("DB") joins at the FRONT: the new node (600) points forward at the old first node (400), 400.prev points back at 600, and first moves to 600. size 3: DB, DSA, Prob.');
    B.set(200, 'last', { r: 400 }).set(400, 'next', 'null').set(200, 'size', 2);
    B.snap(4, "removeLast() returns \"Prob\": last moves back to 400 (the old last node's prev) and 400.next becomes null. Nothing points at node 500 now, so the node and its String are garbage. size 2: DB, DSA.");
    B.val(710, '"Net"', { at: { below: 700, slot: 'data', gap: 50 } })
      .node(700, { r: 710 }, { r: 400 }, { at: { right: 600, gap: 60 }, ...node, prev: { r: 600 }, t: 'Node' })
      .set(600, 'next', { r: 700 })
      .set(400, 'prev', { r: 700 })
      .set(200, 'size', 3);
    B.snap(5, 'add(1, "Net") inserts between DB and DSA: the list walks to index 1, the new node (700) points back at 600 and forward at 400, then 600.next and 400.prev are changed to 700. No element is shifted. size 3: DB, Net, DSA.');
    return B.done('Lab 8: a LinkedList of course names');
  },
};
