/**
 * The memory-diagram scenarios of CSI247, one per `<MemoryDiagram scenario="..." />` in the notes. Each is a short piece of
 * Java, with the diagram after every line and a sentence saying what that line did. The drawing rules are the ones in
 * content/docs/sem3/csi247/06-object-oriented-programming/notes/drawing-memory-diagrams.mdx: addresses are invented
 * (100, 200, 300 ...), `=` copies what is in the box, an old value is crossed out and never erased.
 */
import { memoryBuilder, type MemScenario } from './memory-diagram';

type Builder = () => MemScenario;

const scenarios: Record<string, Builder> = {
  basics() {
    const B = memoryBuilder().code(['int x = 5;', 'int y = x;', 'x = 7;', 'int[] arr = new int[3];', 'arr[1] = 9;', 'int[] other = arr;', 'other[0] = 4;']);
    B.snap(-1, 'Before anything runs, memory is empty. Variables will be drawn on the left (the stack). Objects and arrays will be drawn on the right (the heap).');
    B.v('x', 5, { y: 44 }).snap(0, 'int x = 5; — x is a primitive, so its box holds the value itself. Draw a box, write its name above it, and write 5 inside.');
    B.v('y', 5, { y: 124 }).snap(1, 'int y = x; — Java copies the VALUE 5 into a brand-new box called y. x and y are not connected in any way.');
    B.sv('x', 7).snap(2, 'x = 7; — exam rule: never rub anything out. Cross out the old value (5) and write the new one next to it. y still holds 5, because it had its own copy.');
    B.arr(100, 3, { x: 240, y: 204, cw: 62, fill: 0, t: 'int[]' })
      .v('arr', { r: 100 }, { y: 204 })
      .snap(3, 'new int[3] builds an array on the heap. We invent an address for it, 100. An int array starts full of 0s. The variable arr does not hold the array; it holds the ADDRESS 100, which we also draw as an arrow.');
    B.set(100, 1, 9).snap(4, 'arr[1] = 9; — follow the arrow from arr to the array, find index [1], cross out 0 and write 9.');
    B.v('other', { r: 100 }, { y: 284 }).snap(5, 'int[] other = arr; — this copies the address (100), not the array. Now two arrows point at the SAME array. Two names for one thing is called aliasing.');
    B.set(100, 0, 4).snap(6, 'other[0] = 4; — changes the one shared array. If you now print arr[0] you also get 4. Final diagram.');
    return B.done('Primitives vs references');
  },

  student() {
    const B = memoryBuilder().code([
      'Student[] students = new Student[3];',
      'Student myStudent = new Student("John", 67, 3.5);',
      'students[2] = myStudent;',
      'myStudent.setName("Smith");',
      'myStudent.setAge(18);',
    ]);
    B.snap(-1, 'Empty memory. Stack (variables) on the left, heap (objects) on the right.');
    B.arr(100, 3, { x: 240, y: 44, cw: 92, t: 'Student[]' })
      .v('students', { r: 100 }, { y: 44 })
      .snap(0, 'new Student[3] creates an array of 3 slots at address 100. Important: it does NOT create any Student objects. Every slot holds null, meaning "points at nothing". students holds the address 100.');
    B.val(300, '"John"', { x: 540, y: 236, t: 'String' })
      .obj(200, [['name', { r: 300 }], ['age', 67], ['gpa', 3.5]], { x: 240, y: 200, t: 'Student' })
      .v('myStudent', { r: 200 }, { y: 280 });
    B.snap(1, 'new Student("John", 67, 3.5) creates one Student object at 200 with three fields. name is a String, and every String is an object, so "John" gets its own box at 300 and name holds 300. age and gpa are primitives, so their values sit directly inside. myStudent holds 200.');
    B.set(100, 2, { r: 200 }).snap(2, 'students[2] = myStudent; copies the address 200 into slot [2]: cross out null, write 200, draw the arrow. There is still only ONE student, reachable two ways.');
    B.val(400, '"Smith"', { x: 540, y: 330, t: 'String' })
      .set(200, 'name', { r: 400 })
      .snap(3, 'setName("Smith") creates a NEW String object at 400 and stores its address in name. Strings can never be edited, so "John" is untouched; name just points elsewhere now. Cross out 300 and its arrow. Nothing points to "John" any more, so it is garbage.');
    B.set(200, 'age', 18).snap(4, 'setAge(18): cross out 67, write 18. This is the finished exam answer: compare it with the diagram in your notes.');
    return B.done('Array of objects: Student');
  },

  course() {
    const B = memoryBuilder().code([
      'Course[] ours = new Course[4];',
      'Course c1 = new Course("ICT101", 140);',
      'ours[1] = c1;',
      'ours[1].setCode("CSI247");',
      'ours[1].setEnrolment(230);',
    ]);
    B.snap(-1, 'This is the example from the revision notes. Empty memory to start.');
    B.arr(100, 4, { x: 240, y: 44, cw: 76, t: 'Course[]' })
      .v('ours', { r: 100 }, { y: 44 })
      .snap(0, 'An array of 4 Course references at 100, every slot null. ours holds 100.');
    B.val(300, '"ICT101"', { x: 540, y: 236, t: 'String' })
      .obj(200, [['code', { r: 300 }], ['enrol', 140]], { x: 240, y: 200, t: 'Course' })
      .v('c1', { r: 200 }, { y: 270 });
    B.snap(1, 'The constructor builds a Course at 200. code points to the String "ICT101" (its own object, at 300). enrol is an int, so 140 sits inside the box. c1 holds 200.');
    B.set(100, 1, { r: 200 }).snap(2, 'ours[1] = c1; puts the address 200 into slot [1]. Cross out null.');
    B.val(400, '"CSI247"', { x: 540, y: 320, t: 'String' })
      .set(200, 'code', { r: 400 })
      .snap(3, 'ours[1].setCode("CSI247"): go to slot [1], follow its arrow to the Course, and change code. A new String object appears at 400; cross out 300 and its arrow. "ICT101" is now garbage.');
    B.set(200, 'enrol', 230).snap(4, 'ours[1].setEnrolment(230): cross out 140, write 230. Final diagram.');
    return B.done('Array of objects: Course');
  },

  marks() {
    const B = memoryBuilder().code(['Integer[] marks = new Integer[4];', 'marks[0] = 73;', 'marks[1] = 81;', 'marks[2] = 69;', 'marks[3] = 60;']);
    B.snap(-1, 'Integer (capital I) is a class, so each mark will be an object of its own.');
    B.arr(100, 4, { x: 240, y: 44, cw: 80, t: 'Integer[]' })
      .v('marks', { r: 100 }, { y: 44 })
      .snap(0, 'An array of 4 Integer references at 100. Like every array of objects, it starts full of null.');
    [
      [73, 200],
      [81, 300],
      [69, 400],
      [60, 500],
    ].forEach(([m, a], i) => {
      B.val(a, String(m), { x: 240 + i * 80 + 6, y: 180, w: 68 })
        .set(100, i, { r: a })
        .snap(i + 1, `marks[${i}] = ${m}; — Java automatically wraps the int ${m} in an Integer object (this is called autoboxing). The object gets address ${a}; slot [${i}] holds ${a}.` + (i === 3 ? ' The array is now full: there is no 5th slot, and an array can never grow.' : ''));
    });
    return B.done('Integer[] marks');
  },

  shape() {
    const B = memoryBuilder().code(['Shape s = new Circle("Yellow", 5);', 's.setColour("Pink");', 'Shape t = s;']);
    B.snap(-1, 'Circle extends Shape. Watch what a Circle object actually contains.');
    B.val(300, '"Yellow"', { x: 520, y: 80, t: 'String' })
      .obj(200, [['colour', { r: 300 }], ['radius', 5]], { x: 240, y: 44, t: 'Circle' })
      .v('s', { r: 200 }, { y: 44, t: 'Shape' });
    B.snap(0, "One Circle object at 200. It has BOTH fields: colour (inherited from Shape) and radius (Circle's own). The variable s has type Shape, but the object it points at is a Circle. A superclass variable may point to a subclass object.");
    B.val(400, '"Pink"', { x: 520, y: 170, t: 'String' })
      .set(200, 'colour', { r: 400 })
      .snap(1, 'setColour is inherited from Shape, and it works on the colour field inside the Circle. New String at 400; cross out 300.');
    B.v('t', { r: 200 }, { y: 124 }).snap(2, 'Shape t = s; copies the address only. Still one object.');
    return B.done('Inside a subclass object');
  },

  alist() {
    const B = memoryBuilder().code([
      'ArrayList<Integer> list = new ArrayList<Integer>();',
      'list.add(73);',
      'list.add(81);',
      'list.add(69);',
      'list.add(60);',
      'list.add(70);',
      'list.add(1, 55);',
      'list.remove(0);',
    ]);
    B.snap(-1, "An ArrayList is an object that hides an ordinary array inside it. Let's watch it work.");
    B.arr(300, 4, { x: 450, y: 150, cw: 70, t: 'Object[]' })
      .obj(200, [['size', 0], ['elementData', { r: 300 }]], { x: 200, y: 50, w: 200, t: 'ArrayList' })
      .v('list', { r: 200 }, { y: 50 });
    B.snap(0, 'The ArrayList object (200) keeps two fields. size = how many values are really stored (0 so far). elementData = the address of the hidden array (300) that holds them. We use capacity 4, as in the lecture. Empty slots hold null.');
    [
      [73, 0],
      [81, 1],
      [69, 2],
      [60, 3],
    ].forEach(([v, i]) => {
      B.set(300, i, v)
        .set(200, 'size', i + 1)
        .snap(i + 1, `add(${v}): the first free slot is always at index size = ${i}. Store ${v} there and add 1 to size.` + (i === 3 ? ' Now size (4) equals the array length (4): the hidden array is FULL.' : ''));
    });
    B.clean().snap(5, 'add(70) — there is no free slot. The ArrayList must grow. (We have removed the old crossings so the next steps are easier to see.)');
    B.arr(400, 8, { x: 200, y: 282, cw: 70, t: 'Object[]' })
      .v('newArray', { r: 400 }, { y: 282 })
      .snap(5, 'Grow, step 1: create a NEW array twice as long (8 slots) at address 400. Inside the grow code a local variable, newArray, holds its address for now.');
    [73, 81, 69, 60].forEach((v, i) => B.set(400, i, v));
    B.snap(5, 'Grow, step 2: copy every value across into the same index. Copying n values is why a grow costs O(n) time.');
    B.set(200, 'elementData', { r: 400 }).snap(5, 'Grow, step 3: elementData now holds 400. The old array at 300 is unreachable, so the garbage collector will delete it.');
    B.unv('newArray').set(400, 4, 70).set(200, 'size', 5).snap(5, 'Grow, step 4: the grow code has finished, so newArray goes away. Now there is room: store 70 at index size = 4, and size becomes 5.');
    B.drop(300).clean().snap(6, 'add(1, 55): insert 55 at index 1. Everything from index 1 onwards must shift one place to the right first, starting from the END so nothing is overwritten.');
    [
      [5, 70],
      [4, 60],
      [3, 69],
      [2, 81],
    ].forEach(([k, v]) => B.set(400, k, v).snap(6, `Shift: copy the value at [${k - 1}] (${v}) into [${k}].`));
    B.set(400, 1, 55).set(200, 'size', 6).snap(6, 'Index 1 is now free to overwrite. Store 55 there; size becomes 6. The list reads [73, 55, 81, 69, 60, 70].');
    B.clean().snap(7, 'remove(0): delete the value at index 0. Every value after it shifts one place LEFT to close the gap, starting from the FRONT.');
    [
      [0, 55],
      [1, 81],
      [2, 69],
      [3, 60],
      [4, 70],
    ].forEach(([k, v]) => B.set(400, k, v).snap(7, `Shift: copy [${k + 1}] (${v}) into [${k}].`));
    B.set(400, 5, 'null').set(200, 'size', 5).snap(7, 'Clear the last used slot (null) and size becomes 5. The list reads [55, 81, 69, 60, 70]. Notice how many copies remove(0) needed: that is why adding or removing near the front of an ArrayList is O(n).');
    return B.done('ArrayList: add, grow, insert, remove');
  },

  llbuild() {
    const B = memoryBuilder().opt({}).code([
      'Node head = null;',
      'head = new Node(33);',
      'head.next = new Node(41);',
      'Node n = new Node(12);',
      'n.next = head;',
      'head = n;',
      'Node cur = head.next;',
      'Node m = new Node(57);',
      'm.next = cur.next;',
      'cur.next = m;',
      'head.next = head.next.next;',
      'head = head.next;',
    ]);
    B.snap(-1, 'We will build and change a singly linked list one pointer at a time. Each Node has two parts: data (the value) and next (the address of the following node).');
    B.v('head', 'null', { y: 150, w: 150 }).snap(0, 'An empty list: head holds null. There are no nodes at all.');
    B.node(100, 33, 'null', { x: 290, y: 150, cw: 80, t: 'Node' }).sv('head', { r: 100 }).snap(1, 'new Node(33) creates a node at 100 with data 33 and next null. head now holds 100: the list has one node.');
    B.node(290, 41, 'null', { x: 640, y: 150, cw: 80, t: 'Node' }).set(100, 'next', { r: 290 }).snap(2, "A second node at 290. head.next means \"the next field of the node head points to\", so the 33 node's next becomes 290. List: 33 → 41.");
    B.node(367, 12, 'null', { x: 260, y: 290, cw: 80, t: 'Node' }).v('n', { r: 367 }, { y: 290 }).snap(3, 'ADD AT THE FRONT, part 1: make the new node (12) at 367. It is not part of the list yet: nothing in the list points to it.');
    B.set(367, 'next', { r: 100 }).snap(4, 'Part 2: link the new node to the current first node: n.next = head copies 100 into its next field.');
    B.sv('head', { r: 367 }).snap(5, 'Part 3: head = n. head now holds 367, so the list starts at 12: 12 → 33 → 41. Order matters: if you moved head first, you would lose the address of the 33 node.');
    B.unv('n').v('cur', { r: 100 }, { y: 380 }).snap(6, 'INSERT IN THE MIDDLE (57 after 33). (n was only a helper, so we stop drawing it.) cur = head.next walks one step: cur holds 100, the 33 node.');
    B.node(450, 57, 'null', { x: 470, y: 20, cw: 80, t: 'Node' }).v('m', { r: 450 }, { y: 20 }).snap(7, 'Make the new node 57 at 450.');
    B.set(450, 'next', { r: 290 }).snap(8, 'm.next = cur.next: the new node first grabs the address of the node AFTER cur (290, the 41 node).');
    B.set(100, 'next', { r: 450 }).snap(9, 'cur.next = m: now 33 points to 57. List: 12 → 33 → 57 → 41. If you did these two lines the other way round, the 41 node would be lost.');
    B.unv('cur').unv('m').snap(10, 'REMOVE 33. (cur and m were helpers, so we stop drawing them.) head.next.next is the node after 33, which is 450.');
    B.set(367, 'next', { r: 450 }).snap(10, 'head.next = head.next.next makes 12 skip over 33 and point straight to 57. Nothing points to the 33 node now: it is garbage. List: 12 → 57 → 41.');
    B.sv('head', { r: 450 }).snap(11, 'REMOVE THE FIRST NODE: head = head.next. head jumps to 450, and the 12 node becomes garbage. Final list: 57 → 41.');
    return B.done('Singly linked list, pointer by pointer');
  },

  lltrav() {
    const B = memoryBuilder().opt({ dead: false }).code(['Node cur = head;', 'while (cur != null) {', '    System.out.print(cur.data + " ");', '    cur = cur.next;', '}']);
    const xs = [240, 380, 520, 660];
    const ad = [367, 100, 450, 290];
    const vals = [12, 33, 57, 41];
    ad.forEach((a, i) => B.node(a, vals[i], i < 3 ? { r: ad[i + 1] } : 'null', { x: xs[i], y: 44, cw: 52, t: i ? '' : 'Node' }));
    B.v('head', { r: 367 }, { y: 44 });
    B.snap(-1, 'A list 12 → 33 → 57 → 41 already exists. We want to visit every node in order. A linked list has no indexes, so the only way is to follow the next arrows.');
    B.v('cur', { r: 367 }, { y: 170, w: 240 }).snap(0, 'cur = head: cur starts at the first node (367).');
    let out = '';
    vals.forEach((v, i) => {
      B.snap(1, `cur != null? cur holds ${ad[i]}, so yes → enter the loop.`);
      out += v + ' ';
      B.snap(2, `Print cur.data → ${v}. Output so far: ${out.trim()}`);
      B.sv('cur', i < 3 ? { r: ad[i + 1] } : 'null').snap(3, `cur = cur.next: copy the next field of node ${ad[i]} into cur → ` + (i < 3 ? ad[i + 1] + '.' : 'null (that was the last node).'));
    });
    B.snap(1, "cur != null? cur is null → the loop stops. Output: 12 33 57 41. Look at cur's box: the crossed-out values are exactly the addresses it visited, in order.");
    return B.done('Traversing a linked list with cur');
  },

  book() {
    const B = memoryBuilder().code(['Book[] shelf = new Book[2];', 'Book b = new Book("Java", 2003);', 'shelf[0] = b;', 'shelf[1] = new Book("Data", 2010);', 'shelf[0].setYear(2014);', 'b = null;']);
    B.arr(100, 2, { x: 240, y: 44, cw: 96, t: 'Book[]' }).v('shelf', { r: 100 }, { y: 44 });
    B.val(300, '"Java"', { x: 262, y: 430, t: 'String' })
      .obj(200, [['year', 2003], ['title', { r: 300 }]], { x: 240, y: 200, w: 200, t: 'Book' })
      .v('b', { r: 200 }, { y: 230 });
    B.set(100, 0, { r: 200 });
    B.val(500, '"Data"', { x: 502, y: 430, t: 'String' })
      .obj(400, [['year', 2010], ['title', { r: 500 }]], { x: 480, y: 200, w: 200, t: 'Book' })
      .set(100, 1, { r: 400 });
    B.set(200, 'year', 2014).sv('b', 'null').snap(5, '');
    return B.done('Practice answer');
  },

  alstudents() {
    const B = memoryBuilder().code([
      'ArrayList<Student> group = new ArrayList<Student>();',
      'group.add(new Student("Ann", 19));',
      'group.add(new Student("Tom", 21));',
      'group.get(0).setAge(20);',
      'group.remove(0);',
    ]);
    B.snap(-1, 'Now the list holds OBJECTS. The hidden array will hold addresses of Student objects, exactly like the Student[] example on the memory-diagrams page.');
    B.arr(300, 4, { x: 450, y: 150, cw: 76, t: 'Object[]' })
      .obj(200, [['size', 0], ['elementData', { r: 300 }]], { x: 200, y: 50, w: 200, t: 'ArrayList' })
      .v('group', { r: 200 }, { y: 50 });
    B.snap(0, 'An empty ArrayList (200) with a hidden array (300) of 4 null slots. size is 0.');
    B.val(500, '"Ann"', { x: 445, y: 470, t: 'String' })
      .obj(400, [['age', 19], ['name', { r: 500 }]], { x: 420, y: 270, w: 170, t: 'Student' })
      .set(300, 0, { r: 400 })
      .set(200, 'size', 1);
    B.snap(1, 'new Student("Ann", 19) makes a Student at 400 (its name "Ann" is its own String object at 500). add() stores the ADDRESS 400 in slot [0]; size becomes 1.');
    B.val(700, '"Tom"', { x: 635, y: 470, t: 'String' })
      .obj(600, [['age', 21], ['name', { r: 700 }]], { x: 610, y: 270, w: 170, t: 'Student' })
      .set(300, 1, { r: 600 })
      .set(200, 'size', 2);
    B.snap(2, 'A second Student at 600 goes into slot [1]; size becomes 2.');
    B.set(400, 'age', 20).snap(3, 'group.get(0) returns the address in slot [0] (400). setAge(20) runs on that object: cross out 19, write 20. The list itself did not change.');
    B.clean()
      .set(300, 0, { r: 600 })
      .set(300, 1, 'null')
      .set(200, 'size', 1)
      .snap(4, "remove(0): slot [1]'s address (600) shifts left into [0], slot [1] becomes null, size becomes 1. Nothing points to Ann any more, so Ann and her String are garbage.");
    return B.done('ArrayList of objects');
  },

  llslide() {
    const B = memoryBuilder();
    B.node(100, 33, { r: 290 }, { x: 250, y: 60, cw: 70, t: 'Node' })
      .node(290, 41, 'null', { x: 470, y: 60, cw: 70, t: 'Node' })
      .v('names', { r: 100 }, { y: 60 })
      .snap(0, '');
    return B.done('A linked list with two nodes');
  },

  llq() {
    const B = memoryBuilder();
    B.node(100, 5, 'null', { x: 240, y: 44, cw: 72, t: 'Node' })
      .node(200, 9, 'null', { x: 430, y: 140, cw: 72, t: 'Node' })
      .node(300, 2, 'null', { x: 620, y: 236, cw: 72, t: 'Node' });
    B.v('a', { r: 100 }, { y: 44 })
      .set(100, 'next', { r: 200 })
      .set(200, 'next', { r: 300 })
      .v('b', { r: 200 }, { y: 140 })
      .set(200, 'data', 7)
      .snap(0, '');
    return B.done('Practice answer');
  },

  dll() {
    const B = memoryBuilder();
    B.node(100, 33, { r: 290 }, { x: 240, y: 60, cw: 54, prev: 'null', t: 'Node' })
      .node(290, 41, { r: 367 }, { x: 460, y: 60, cw: 54, prev: { r: 100 } })
      .node(367, 57, 'null', { x: 680, y: 60, cw: 54, prev: { r: 290 } });
    B.v('head', { r: 100 }, { y: 60 }).v('tail', { r: 367 }, { y: 150, via: 'under' }).snap(0, '');
    return B.done('Doubly linked list');
  },
};

export const memoryScenarioIds = Object.keys(scenarios);

/** Builds a scenario by id. Throws for an unknown id, so a typo in the notes stops the build instead of drawing nothing. */
export function buildMemoryScenario(id: string): MemScenario {
  const build = scenarios[id];
  if (!build) throw new Error(`MemoryDiagram: unknown scenario "${id}" (known: ${memoryScenarioIds.join(', ')}).`);
  return build();
}
