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

  llcircular() {
    const B = memoryBuilder();
    B.node(100, 6, { r: 200 }, { x: 240, y: 60, cw: 56, t: 'Node' })
      .node(200, 3, { r: 300 }, { x: 440, y: 60, cw: 56 })
      .node(300, 9, { r: 100 }, { x: 640, y: 60, cw: 56 });
    B.v('head', { r: 100 }, { y: 60 }).snap(0, '');
    return B.done('Circular linked list');
  },

  lladdlast() {
    const B = memoryBuilder().code([
      'Node n = new Node(7);',
      'Node currNode = head;',
      'while (currNode.next != null)',
      '    currNode = currNode.next;',
      'currNode.next = n;',
    ]);
    B.node(100, 6, { r: 200 }, { x: 240, y: 60, cw: 56, t: 'Node' })
      .node(200, 3, { r: 300 }, { x: 440, y: 60, cw: 56 })
      .node(300, 9, 'null', { x: 640, y: 60, cw: 56 })
      .v('head', { r: 100 }, { y: 60 });
    B.snap(-1, 'The lecture\'s list 6 → 3 → 9. To add 7 at the END, the new node must become the tail, so we first have to find the old tail: the node whose next is null.');
    B.node(400, 7, 'null', { x: 840, y: 200, cw: 56 }).v('n', { r: 400 }, { y: 200 });
    B.snap(0, 'Create the new node: data 7, next null. n holds its address (400). It is not part of the list yet: nothing in the list points to it.');
    B.v('currNode', { r: 100 }, { y: 330 });
    B.snap(1, 'Start the traversal at the first node: currNode = head, so currNode holds 100.');
    B.snap(2, 'currNode.next != null? The 6 node\'s next is 200, so yes: keep walking.');
    B.sv('currNode', { r: 200 }).snap(3, 'currNode = currNode.next: it now holds 200, the 3 node.');
    B.snap(2, 'currNode.next != null? The 3 node\'s next is 300, so yes.');
    B.sv('currNode', { r: 300 }).snap(3, 'currNode now holds 300, the 9 node.');
    B.snap(2, 'currNode.next != null? The 9 node\'s next is null, so the loop stops. currNode is ON the tail. (For a list of n nodes this loop moves n − 1 times: addLast is O(n).)');
    B.set(300, 'next', { r: 400 }).snap(4, 'currNode.next = n: the old tail now points to the new node. The list is 6 → 3 → 9 → 7 and 7 is the new tail, its next still null.');
    return B.done('addLast: walk to the tail, then link the new node');
  },

  lladdfront() {
    const B = memoryBuilder().code(['Node n = new Node(7);', 'n.next = head;', 'head = n;']);
    B.node(100, 6, { r: 200 }, { x: 440, y: 60, cw: 56, t: 'Node' })
      .node(200, 3, { r: 300 }, { x: 640, y: 60, cw: 56 })
      .node(300, 9, 'null', { x: 840, y: 60, cw: 56 })
      .v('head', { r: 100 }, { y: 60 });
    B.snap(-1, 'The lecture\'s list 6 → 3 → 9. To add 7 in FRONT nothing needs to be traversed: only head and the new node\'s next change.');
    B.node(400, 7, 'null', { x: 240, y: 200, cw: 56, t: 'Node' }).v('n', { r: 400 }, { y: 200 });
    B.snap(0, 'Create the new node (400) with data 7 and next null. It is outside the list for now.');
    B.set(400, 'next', { r: 100 }).snap(1, 'n.next = head: the new node points at the current first node (100). Do this FIRST, while head still holds the address of the old list.');
    B.sv('head', { r: 400 }).snap(2, 'head = n: head now holds 400, so the list is 7 → 6 → 3 → 9. Only two assignments, whatever the length of the list: addFront is O(1).');
    return B.done('addFront: two assignments');
  },

  lladdat() {
    const B = memoryBuilder().code([
      'Node n = new Node(7);',
      'Node cur = head;      // the node BEFORE the position (position 1: the first node)',
      'n.next = cur.next;',
      'cur.next = n;',
    ]);
    B.node(100, 6, { r: 200 }, { x: 240, y: 60, cw: 56, t: 'Node' })
      .node(200, 3, { r: 300 }, { x: 540, y: 60, cw: 56 })
      .node(300, 9, 'null', { x: 760, y: 60, cw: 56 })
      .v('head', { r: 100 }, { y: 60 });
    B.snap(-1, 'The lecture\'s list 6 → 3 → 9. We add 7 as the SECOND node (index 1): the new node must end up between 6 and 3.');
    B.node(400, 7, 'null', { x: 390, y: 200, cw: 56, t: 'Node' }).v('n', { r: 400 }, { y: 200 });
    B.snap(0, 'Create the new node (400): data 7, next null.');
    B.v('cur', { r: 100 }, { y: 330 });
    B.snap(1, 'Traverse until the node BEFORE the position. For index 1 that is the first node, so cur = head and the loop moves 0 times.');
    B.set(400, 'next', { r: 200 }).snap(2, 'n.next = cur.next: the new node first grabs the address of its right neighbour (200, the 3 node).');
    B.set(100, 'next', { r: 400 }).snap(3, 'cur.next = n: now 6 points to 7. The list is 6 → 7 → 3 → 9. Done in this order, nothing is lost; the other way round, the 3 → 9 part of the list would be unreachable.');
    return B.done('add at a position: link the new node to its right neighbour first');
  },

  llremove() {
    const B = memoryBuilder().code([
      'head = head.next;      // removeFront()',
      'Node cur = head;       // removeLast() starts here',
      'while (cur.next.next != null)',
      '    cur = cur.next;',
      'cur.next = null;',
    ]);
    B.node(100, 6, { r: 200 }, { x: 240, y: 60, cw: 56, t: 'Node' })
      .node(200, 3, { r: 300 }, { x: 440, y: 60, cw: 56 })
      .node(300, 9, { r: 400 }, { x: 640, y: 60, cw: 56 })
      .node(400, 7, 'null', { x: 840, y: 60, cw: 56 })
      .v('head', { r: 100 }, { y: 60 });
    B.snap(-1, 'A list 6 → 3 → 9 → 7. We remove the first node, then the last.');
    B.sv('head', { r: 200 }).snap(0, 'removeFront: head = head.next. head now holds 200. Nothing points to the 6 node any more, so it is isolated: the garbage collector reclaims its memory. List: 3 → 9 → 7.');
    B.v('cur', { r: 200 }, { y: 200 });
    B.snap(1, 'removeLast: start at the first node, cur = head.');
    B.snap(2, 'cur.next.next != null? cur.next is 300 and its next is 400, not null: keep walking.');
    B.sv('cur', { r: 300 }).snap(3, 'cur = cur.next: cur holds 300, the 9 node.');
    B.snap(2, 'cur.next.next != null? cur.next is 400 and its next is null: stop. cur is the SECOND-LAST node.');
    B.set(300, 'next', 'null').snap(4, 'cur.next = null: the 9 node no longer points to the 7 node, which is isolated and becomes garbage. List: 3 → 9. (On a one-node list cur.next.next would fail: cur.next is null.)');
    return B.done('removeFront and removeLast');
  },

  stackarray() {
    const B = memoryBuilder().code([
      'Stack1 st1 = new Stack1(5);',
      'st1.push(27);',
      'st1.push(38);',
      'st1.push(92);',
      'st1.pop();',
      'st1.push(46);',
    ]);
    B.snap(-1, 'Lecture 15\'s array stack. The stack is an object holding an array and the index top of the top element. We follow a stack of capacity 5.');
    B.arr(300, 5, { x: 470, y: 40, cw: 64, t: 'Integer[]' })
      .obj(200, [['stack', { r: 300 }], ['top', -1]], { x: 200, y: 30, w: 190, t: 'Stack1' })
      .v('st1', { r: 200 }, { y: 30 });
    B.snap(0, 'new Stack1(5): the constructor creates an array of 5 slots (all null) and sets top = -1, which means the stack is empty. size() is top + 1 = 0.');
    B.set(200, 'top', 0).set(300, 0, 27);
    B.snap(1, 'push(27): stack[++top] = num. top goes up first (-1 becomes 0), then the value is stored at the new top. size() = 1: top is 0 with one element.');
    B.set(200, 'top', 1).set(300, 1, 38);
    B.snap(2, 'push(38): top becomes 1 and 38 is stored in slot [1].');
    B.set(200, 'top', 2).set(300, 2, 92);
    B.snap(3, 'push(92): top becomes 2 and 92 is stored in slot [2]. Three elements; top = 2.');
    B.set(200, 'top', 1).snap(4, 'pop(): return stack[top--]. The method returns 92 and THEN top goes down to 1. Slot [2] still holds 92, but it is above top, so it is no longer part of the stack: nothing is erased.');
    B.set(200, 'top', 2).set(300, 2, 46);
    B.snap(5, 'push(46): top becomes 2 again and 46 overwrites the stale 92 in slot [2]. A stack of capacity 5 is full when top = 4 (N - 1); a further push prints "Stack Overflow! Can not insert...".');
    return B.done('Array stack: top moves, slots are not cleared');
  },

  stacklinked() {
    const B = memoryBuilder().code([
      'Stack2 stk = new Stack2();',
      'stk.push("CSI247");',
      'stk.push("CSI243");',
      'stk.push("CSI141");',
      'stk.pop();',
    ]);
    B.snap(-1, 'Lecture 15\'s linked stack: nodes are added and removed at the front of a linked list, and the object keeps one reference, top.');
    B.obj(340, [['top', 'null']], { x: 200, y: 30, w: 190, t: 'Stack2' }).v('stk', { r: 340 }, { y: 30 });
    B.snap(0, 'new Stack2(): the constructor sets top = null. The stack is empty and there is no size limit.');
    B.node(100, 'CSI247', 'null', { x: 560, y: 230, cw: 76, t: 'Node' }).set(340, 'top', { r: 100 });
    B.snap(1, 'push("CSI247") on an empty stack: the new node is the first node, so top = 100.');
    B.node(200, 'CSI243', { r: 100 }, { x: 400, y: 130, cw: 76 }).set(340, 'top', { r: 200 });
    B.snap(2, 'push("CSI243"): the new node points at the old top (100), then top = 200. This is adding a node in front of a linked list.');
    B.node(300, 'CSI141', { r: 200 }, { x: 240, y: 30, cw: 76 }).set(340, 'top', { r: 300 });
    B.snap(3, 'push("CSI141"): the new node points at the old top (200), then top = 300. The top of the stack is the newest node.');
    B.set(340, 'top', { r: 200 }).snap(4, 'pop(): save top.data ("CSI141"), then top = top.next, so top holds 200. Removing a node from the front of the list: the old top node is isolated and becomes garbage.');
    return B.done('Linked stack: push and pop at the front');
  },

  queuelinked() {
    const B = memoryBuilder().code([
      'Queue1 q = new Queue1();',
      'q.enqueue("19");',
      'q.enqueue("28");',
      'q.enqueue("35");',
      'q.dequeue();',
      'q.dequeue();',
      'q.dequeue();',
    ]);
    B.snap(-1, 'Lecture 16\'s linked queue: a singly linked list with TWO references, front (where elements leave) and tail (where they join). This follows the lecture\'s illustration of enqueue(19), enqueue(28), enqueue(35) and dequeue().');
    B.obj(340, [['front', 'null'], ['tail', 'null']], { x: 200, y: 30, w: 190, t: 'Queue1' }).v('q', { r: 340 }, { y: 30 });
    B.snap(0, 'new Queue1(): front = null and tail = null. The queue is empty.');
    B.node(100, '19', 'null', { x: 460, y: 40, cw: 52, t: 'Node' }).set(340, 'front', { r: 100 }).set(340, 'tail', { r: 100 });
    B.snap(1, 'enqueue("19") on an empty queue: the new node becomes the tail, and because the queue was empty it is also the front. Both fields hold 100.');
    B.node(200, '28', 'null', { x: 640, y: 40, cw: 52 }).set(100, 'next', { r: 200 }).set(340, 'tail', { r: 200 });
    B.snap(2, 'enqueue("28"): oldTail = tail; tail = new node; oldTail.next = tail. The 19 node points at the 28 node and tail moves to 200. front is unchanged.');
    B.node(300, '35', 'null', { x: 820, y: 40, cw: 52 }).set(200, 'next', { r: 300 }).set(340, 'tail', { r: 300 });
    B.snap(3, 'enqueue("35"): the 28 node points at the 35 node and tail = 300. The queue reads front 19, 28, 35 tail.');
    B.set(340, 'front', { r: 200 }).snap(4, 'dequeue(): save front.data ("19"), then front = front.next. front holds 200; the 19 node is isolated and becomes garbage. tail is unchanged because the queue is not empty.');
    B.set(340, 'front', { r: 300 }).snap(5, 'dequeue() again: front = 300. The 28 node is garbage. One element (35) is left, so front and tail both hold 300.');
    B.set(340, 'front', 'null').set(340, 'tail', 'null').snap(6, 'dequeue() once more: front = front.next is null, so the queue is now empty. The lecture\'s code then sets tail = null too, otherwise tail would still refer to the removed 35 node.');
    return B.done('Linked queue: enqueue at the tail, dequeue at the front');
  },

  queuearray() {
    const B = memoryBuilder().code([
      'Queue1 q = new Queue1(6);',
      'q.enqueue("26");',
      'q.enqueue("69");',
      'q.enqueue("48");',
      'q.dequeue();',
      'q.dequeue();',
      'q.dequeue();',
      'q.enqueue("52");',
    ]);
    B.snap(-1, 'Lecture 16\'s array queue: an array plus two indexes, front and tail. The lecture\'s pictures use an array of 6 slots, indexes 0 to 5.');
    B.arr(300, 6, { x: 470, y: 40, cw: 60, t: 'String[]' })
      .obj(200, [['queue', { r: 300 }], ['front', -1], ['tail', -1]], { x: 200, y: 30, w: 190, t: 'Queue1' })
      .v('q', { r: 200 }, { y: 30 });
    B.snap(0, 'new Queue1(6): a String array of 6 slots, front = -1 and tail = -1 (smaller than any index): the queue is empty and the two indexes agree.');
    B.set(200, 'front', 0).set(200, 'tail', 0).set(300, 0, '26');
    B.snap(1, 'enqueue("26") on an empty queue: front = tail = 0, and the element is stored at tail.');
    B.set(200, 'tail', 1).set(300, 1, '69');
    B.snap(2, 'enqueue("69"): tail++ then store. front stays 0.');
    B.set(200, 'tail', 2).set(300, 2, '48');
    B.snap(3, 'enqueue("48"): tail = 2. size() = tail - front + 1 = 3.');
    B.set(200, 'front', 1).snap(4, 'dequeue(): return queue[front] ("26"), then front++. The element leaves the QUEUE, not the array: slot [0] still holds "26". size() = 2 - 1 + 1 = 2.');
    B.set(200, 'front', 2).snap(5, 'dequeue(): returns "69"; front = 2. Only "48" is left: front and tail are both 2.');
    B.set(200, 'front', 3).snap(6, 'dequeue(): returns "48"; front = 3 is now past tail (2), so size() = 2 - 3 + 1 = 0: the queue is empty, although the three old values are still in the array.');
    B.set(200, 'front', 0).set(200, 'tail', 0).set(300, 0, '52');
    B.snap(7, 'enqueue("52"): the queue is empty, so front = tail = 0 again and "52" overwrites the stale "26". This is the only time the freed slots at the start are reused.');
    return B.done('Array queue: front and tail move forwards');
  },

  llpractice() {
    const B = memoryBuilder().code([
      'Node a = new Node(4);',
      'a.next = new Node(8);',
      'Node b = a.next;',
      'b.next = new Node(2);',
      'a = a.next;',
    ]);
    B.snap(-1, 'Five lines of Java, no list class: just Node variables. Work out what each line does to the boxes before you step on.');
    B.node(100, 4, 'null', { x: 300, y: 60, cw: 56, t: 'Node' }).v('a', { r: 100 }, { y: 60 });
    B.snap(0, 'new Node(4) makes a node at 100 with next null. a holds its address.');
    B.node(200, 8, 'null', { x: 500, y: 60, cw: 56 }).set(100, 'next', { r: 200 });
    B.snap(1, 'A second node (200) is created and its address is stored in the first node\'s next. a is unchanged: it still holds 100.');
    B.v('b', { r: 200 }, { y: 200 });
    B.snap(2, 'b = a.next: follow a to the 4 node, read its next field (200) and copy it into b. b and the first node\'s next now hold the same address.');
    B.node(300, 2, 'null', { x: 700, y: 60, cw: 56 }).set(200, 'next', { r: 300 });
    B.snap(3, 'b.next = new Node(2): follow b to the 8 node and store the address of a new node (300) in its next field. The chain is 4 → 8 → 2.');
    B.sv('a', { r: 200 }).snap(4, 'a = a.next: a moves to 200. Nothing points to the 4 node now (a no longer does, and no next field does), so it is garbage. a and b both point at the 8 node; the reachable list is 8 → 2.');
    return B.done('Node variables: what each line does');
  },

  llexercise() {
    const B = memoryBuilder().code([
      'LinkedList myList = new LinkedList();',
      'myList.addLast(6);',
      'myList.addLast(3);',
      'myList.addLast(9);',
      'myList.removeFront();',
      'myList.addFront(12);',
      'myList.addFront(8);',
    ]);
    B.snap(-1, 'The end of Lecture 14 asks for a memory diagram of every action of the tester, in order. This is that diagram for a shorter run: three nodes added, the first removed, two added in front.');
    B.obj(340, [['head', 'null']], { x: 200, y: 30, w: 190, t: 'LinkedList' }).v('myList', { r: 340 }, { y: 30 });
    B.snap(0, 'new LinkedList(): the constructor sets head to null. myList holds the address of the LinkedList object (340). The list is empty.');
    B.node(100, 6, 'null', { x: 480, y: 40, cw: 56, t: 'Node' }).set(340, 'head', { r: 100 });
    B.snap(1, 'addLast(6) on an empty list: the new node becomes the first node, so head = 100.');
    B.node(200, 3, 'null', { x: 660, y: 40, cw: 56 }).set(100, 'next', { r: 200 });
    B.snap(2, 'addLast(3): walk to the tail (the 6 node) and link the new node (200) after it.');
    B.node(300, 9, 'null', { x: 840, y: 40, cw: 56 }).set(200, 'next', { r: 300 });
    B.snap(3, 'addLast(9): walk to the tail (the 3 node) and link the new node (300) after it. List: 6 → 3 → 9.');
    B.set(340, 'head', { r: 200 }).snap(4, 'removeFront: head = head.next, so head holds 200. The 6 node is isolated: garbage. List: 3 → 9.');
    B.node(400, 12, { r: 200 }, { x: 480, y: 170, cw: 56 }).set(340, 'head', { r: 400 });
    B.snap(5, 'addFront(12): the new node (400) points at the old first node (200), then head = 400. List: 12 → 3 → 9.');
    B.node(500, 8, { r: 400 }, { x: 480, y: 300, cw: 56 }).set(340, 'head', { r: 500 });
    B.snap(6, 'addFront(8): the new node (500) points at 400, then head = 500. Final list: 8 → 12 → 3 → 9, with the 6 node left as garbage.');
    return B.done('The Lecture 14 tester, action by action');
  },
};

export const memoryScenarioIds = Object.keys(scenarios);

/** Builds a scenario by id. Throws for an unknown id, so a typo in the notes stops the build instead of drawing nothing. */
export function buildMemoryScenario(id: string): MemScenario {
  const build = scenarios[id];
  if (!build) throw new Error(`MemoryDiagram: unknown scenario "${id}" (known: ${memoryScenarioIds.join(', ')}).`);
  return build();
}
