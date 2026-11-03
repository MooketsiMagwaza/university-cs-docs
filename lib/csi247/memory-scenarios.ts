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

  genset() {
    const B = memoryBuilder().code([
      'Set<Integer> s = new Set<Integer>();',
      's.add(7);',
      's.add(12);',
      's.add(7);',
      's.remove(7);',
      's.add(5);',
    ]);
    B.snap(-1, 'Lab 7\'s generic Set: an object that keeps an array of 10 cells for elements of type T. Here T is Integer. (The cells really hold references to Integer objects; the picture writes the values to stay readable.)');
    B.arr(300, 10, { x: 470, y: 40, cw: 46, t: 'Object[]' })
      .obj(200, [['items', { r: 300 }]], { x: 200, y: 30, w: 190, t: 'Set' })
      .v('s', { r: 200 }, { y: 30 });
    B.snap(0, 'new Set<Integer>(): the array has 10 cells, all null (empty).');
    B.set(300, 0, 7).snap(1, 'add(7): an element goes into the FIRST EMPTY cell, index 0.');
    B.set(300, 1, 12).snap(2, 'add(12): the first empty cell is now index 1.');
    B.set(300, 2, 7).snap(3, 'add(7) again: duplicates are allowed, so the second 7 goes into the first empty cell, index 2.');
    B.set(300, 0, 'null').snap(4, 'remove(7): the search uses equals and finds the FIRST 7, at index 0. That cell is set back to null (the 7 is crossed out). The 7 at index 2 stays, and there is now a gap at the start.');
    B.set(300, 0, 5).snap(5, 'add(5): the first empty cell is index 0 again, so 5 fills the gap. The set holds 5, 12, 7 in cells 0, 1 and 2.');
    return B.done('Generic Set: add into the first empty cell, remove leaves a gap');
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

  iterator() {
    const B = memoryBuilder().code([
      'ArrayList<Integer> nums = new ArrayList<Integer>(Arrays.asList(51, 35, 12, 81, 54, 16));',
      'Iterator<Integer> it = nums.iterator();',
      'it.next();',
      'it.next();',
      'it.next();',
      'it.remove();',
      'it.next();',
    ]);
    B.snap(-1, "Lecture 13's iterator picture, as memory. The list holds 51, 35, 12, 81, 54, 16. An iterator is a small object that remembers where it is in the list.");
    B.arr(300, 6, { x: 330, y: 40, cw: 62, t: 'Object[]' })
      .obj(200, [['size', 6], ['elementData', { r: 300 }]], { x: 20, y: 150, w: 210, t: 'ArrayList' })
      .v('nums', { r: 200 }, { y: 150 });
    [51, 35, 12, 81, 54, 16].forEach((v, i) => B.set(300, i, v));
    B.snap(0, 'The ArrayList (200) holds its elements in a hidden array (300). (The cells really hold references to Integer objects; the picture writes the numbers.) size is 6.');
    B.obj(400, [['cursor', 0], ['lastRet', -1]], { x: 330, y: 190, w: 200, t: 'Iterator' }).v('it', { r: 400 }, { y: 250 });
    B.snap(1, 'iterator() creates an Iterator object (400). cursor is the index of the NEXT element to return: 0, the position before the first element. lastRet is the index of the last element returned: -1 means none yet, which is why remove() would fail now.');
    B.set(400, 'cursor', 1).set(400, 'lastRet', 0).snap(2, 'next() returns the element at cursor (51), then cursor becomes 1 and lastRet becomes 0. The iterator now sits between 51 and 35.');
    B.set(400, 'cursor', 2).set(400, 'lastRet', 1).snap(3, 'next() returns 35. cursor 2, lastRet 1.');
    B.set(400, 'cursor', 3).set(400, 'lastRet', 2).snap(4, 'next() returns 12. cursor 3, lastRet 2. The last element seen is 12.');
    B.clean();
    [
      [2, 81],
      [3, 54],
      [4, 16],
    ].forEach(([k, v]) => B.set(300, k, v));
    B.set(300, 5, 'null').set(200, 'size', 5).set(400, 'cursor', 2).set(400, 'lastRet', -1);
    B.snap(5, 'remove() removes the element at lastRet (index 2, the 12): the later elements shift one place left, the last used slot becomes null and size becomes 5. The iterator steps back with it: cursor = 2, and lastRet is -1 again, so a second remove() with no next() in between would fail.');
    B.set(400, 'cursor', 3).set(400, 'lastRet', 2).snap(6, 'next() returns the element at cursor 2, which is now 81. The 12 is never returned again.');
    return B.done('Iterator: next() and remove()');
  },

  personlist() {
    const B = memoryBuilder().code([
      'ArrayList<Person> people = new ArrayList<Person>();',
      'people.add(new Person(265341, "Lesego Jones", 19));',
      'people.add(new Person(265476, "Thomas Kago", 25));',
      'people.add(new Person(673523, "Mpho Wangu", 28));',
      'people.add(new Person(118204, "Neo Dube", 22));',
      'people.add(new Person(540912, "Kagiso Moeng", 31));',
      'people.add(new Person(722301, "Amo Seretse", 20));',
      'people.remove(2);',
      'people.remove(8);',
    ]);
    B.snap(-1, "Lab 8, question 1 (iv): the state of memory while the records are read and two items are removed. The file has the three given records plus three more. To keep the picture readable, each name is written inside its Person (in the exam, draw each name as its own String object).");
    B.arr(300, 10, { x: 330, y: 20, cw: 46, t: 'Object[]' })
      .obj(200, [['size', 0], ['elementData', { r: 300 }]], { x: 20, y: 130, w: 210, t: 'ArrayList' })
      .v('people', { r: 200 }, { y: 130 });
    B.snap(0, 'An empty ArrayList (200). Its hidden array (300) is created with the default capacity of 10 cells, all null. size is 0.');
    const people = [
      [1000, 265341, '"Lesego Jones"', 19, 20, 120],
      [1100, 265476, '"Thomas Kago"', 25, 340, 120],
      [1200, 673523, '"Mpho Wangu"', 28, 660, 120],
      [1300, 118204, '"Neo Dube"', 22, 20, 300],
      [1400, 540912, '"Kagiso Moeng"', 31, 340, 300],
      [1500, 722301, '"Amo Seretse"', 20, 660, 300],
    ];
    people.forEach(([addr, id, name, age, x, y], i) => {
      B.obj(addr, [['id', id], ['fullname', name], ['age', age]], { x: x + 260, y: y + 90, w: 230, t: 'Person' })
        .set(300, i, { r: addr })
        .set(200, 'size', i + 1);
      B.snap(i + 1, 'One line of the file becomes a Person (' + addr + '). add() stores its address in the first free slot, index ' + i + ', and size becomes ' + (i + 1) + '.');
    });
    B.clean()
      .set(300, 2, { r: 1300 })
      .set(300, 3, { r: 1400 })
      .set(300, 4, { r: 1500 })
      .set(300, 5, 'null')
      .set(200, 'size', 5);
    B.snap(7, 'remove(2) removes the third item, Mpho Wangu (1200). The addresses after it shift one place left (1300, 1400, 1500 move to indexes 2, 3, 4), index 5 becomes null and size becomes 5. Nothing points to 1200 now, so it is garbage.');
    B.snap(8, 'remove(8): index 8 is not below size (5), so there is no item to remove. The ArrayList checks the index first, throws IndexOutOfBoundsException, and nothing in memory changes. The program stops here unless the exception is caught. This is what the lab asks you to notice.');
    return B.done('Lab 8: an ArrayList of Person, remove(2) and remove(8)');
  },

  llcourses() {
    const B = memoryBuilder().code([
      'LinkedList<String> courses = new LinkedList<String>();',
      'courses.add("DSA");',
      'courses.add("Prob");',
      'courses.addFirst("DB");',
      'courses.removeLast();',
      'courses.add(1, "Net");',
    ]);
    B.snap(-1, "Lab 8, question 2 (iii): a LinkedList of course names. Java's LinkedList is doubly linked: each node has prev, data and next, and the list object keeps first, last and size. (The names are written inside the nodes; in the exam draw each as a String object.)");
    B.obj(200, [['first', 'null'], ['last', 'null'], ['size', 0]], { x: 20, y: 130, w: 210, t: 'LinkedList' }).v('courses', { r: 200 }, { y: 130 });
    B.snap(0, 'new LinkedList: first and last are null and size is 0. No array and no capacity: nodes are created one at a time.');
    B.node(400, '"DSA"', 'null', { x: 330, y: 40, cw: 64, prev: 'null', t: 'Node' })
      .set(200, 'first', { r: 400 })
      .set(200, 'last', { r: 400 })
      .set(200, 'size', 1);
    B.snap(1, 'add("DSA") on an empty list: one node (400) with no neighbours. first and last both point at it. size 1.');
    B.node(500, '"Prob"', 'null', { x: 640, y: 40, cw: 64, prev: { r: 400 } })
      .set(400, 'next', { r: 500 })
      .set(200, 'last', { r: 500 })
      .set(200, 'size', 2);
    B.snap(2, 'add("Prob") joins at the END: the new node (500) points back at 400, 400.next points forward at 500, and last moves to 500. No other element moves.');
    B.node(600, '"DB"', { r: 400 }, { x: 330, y: 210, cw: 64, prev: 'null' })
      .set(400, 'prev', { r: 600 })
      .set(200, 'first', { r: 600 })
      .set(200, 'size', 3);
    B.snap(3, 'addFirst("DB") joins at the FRONT: the new node (600) points forward at the old first node (400), 400.prev points back at 600, and first moves to 600. size 3: DB, DSA, Prob.');
    B.set(200, 'last', { r: 400 }).set(400, 'next', 'null').set(200, 'size', 2);
    B.snap(4, 'removeLast() returns "Prob": last moves back to 400 (the old last node\'s prev) and 400.next becomes null. Nothing points at 500 now, so it is garbage. size 2: DB, DSA.');
    B.node(700, '"Net"', { r: 400 }, { x: 640, y: 210, cw: 64, prev: { r: 600 } })
      .set(600, 'next', { r: 700 })
      .set(400, 'prev', { r: 700 })
      .set(200, 'size', 3);
    B.snap(5, 'add(1, "Net") inserts between DB and DSA: the list walks to index 1, the new node (700) points back at 600 and forward at 400, then 600.next and 400.prev are changed to 700. No element is shifted. size 3: DB, Net, DSA.');
    return B.done('Lab 8: a LinkedList of course names');
  },

  account() {
    const B = memoryBuilder().code([
      'FullAccount first = new FullAccount(21347, 38763.87);',
      'FullAccount second = new FullAccount(61342, 0.00);',
      'second.deposit(500.00);',
      'first.withdraw(1000.00);',
      'first.transferFunds(second, 500.00);',
      'FullAccount third = first;',
      'third.setNumber(99999);',
    ]);
    B.snap(-1, 'Lecture 4\'s Account class, as memory. Every object has its own instance variables, and a variable of a class type holds an address.');
    B.obj(200, [['accNumber', 21347], ['balance', '38763.87']], { x: 260, y: 30, w: 210, t: 'FullAccount' }).v('first', { r: 200 }, { y: 30 });
    B.snap(0, 'new FullAccount(21347, 38763.87) makes an object (200) and the constructor copies its two arguments into the object\'s own instance variables. first holds the address.');
    B.obj(400, [['accNumber', 61342], ['balance', '0.00']], { x: 560, y: 30, w: 210, t: 'FullAccount' }).v('second', { r: 400 }, { y: 140 });
    B.snap(1, 'A second object (400). The two accounts do not share balances: each object has its own copy of every instance variable.');
    B.set(400, 'balance', '500.00').snap(2, 'second.deposit(500.00): the method runs on the object second points to (400), so balance = 0.00 + 500.00. The old value is crossed out.');
    B.set(200, 'balance', '37763.87').snap(3, 'first.withdraw(1000.00): balance = 38763.87 - 1000.00 on the object at 200. The other account is not touched.');
    B.set(200, 'balance', '37263.87').set(400, 'balance', '1000.00');
    B.snap(4, 'first.transferFunds(second, 500.00): first has enough (37763.87 >= 500), so it withdraws 500.00 from itself and calls second.deposit(500.00). The parameter "to" holds the address 400 while the method runs, so both objects change.');
    B.v('third', { r: 200 }, { y: 250 }).snap(5, 'FullAccount third = first copies the address 200. There is still ONE account at 200 and two names for it.');
    B.set(200, 'accNumber', 99999).snap(6, 'third.setNumber(99999) follows the address to the object at 200, so first.getNumber() now returns 99999 as well. No new object was created.');
    return B.done('Account objects: own values, a transfer, an alias');
  },

  polymorph() {
    const B = memoryBuilder().code([
      'Shape[] shapes = new Shape[2];',
      'shapes[0] = new Circle("Red", 3);',
      'shapes[1] = new Rectangle("Blue", 2, 5);',
      'double a0 = shapes[0].getArea();',
      'double a1 = shapes[1].getArea();',
    ]);
    B.snap(-1, 'Polymorphism, as memory. The array has the type Shape[], but each cell can hold the address of any kind of Shape.');
    B.arr(100, 2, { x: 260, y: 30, cw: 90, t: 'Shape[]' }).v('shapes', { r: 100 }, { y: 30 });
    B.snap(0, 'new Shape[2] makes an array of two references, both null. No Circle or Rectangle exists yet.');
    B.obj(200, [['colour', '"Red"'], ['radius', 3]], { x: 260, y: 170, w: 210, t: 'Circle' }).set(100, 0, { r: 200 });
    B.snap(1, 'A Circle object (200) holds the Shape part (colour) and its own part (radius). The Shape cell holds the address: a Circle is a Shape.');
    B.obj(300, [['colour', '"Blue"'], ['height', 2], ['width', 5]], { x: 540, y: 170, w: 210, t: 'Rectangle' }).set(100, 1, { r: 300 });
    B.snap(2, 'A Rectangle object (300) goes in the second cell. Both cells have the static type Shape; the objects they point to have different classes.');
    B.v('a0', '28.27', { y: 330 }).snap(3, 'shapes[0].getArea(): Java looks at the object the cell points to (a Circle) at run time and runs Circle\'s getArea: 3.14159... x 3 x 3 = 28.27.');
    B.v('a1', '10.0', { y: 420 }).snap(4, 'shapes[1].getArea(): the object is a Rectangle, so Rectangle\'s getArea runs: 2 x 5 = 10.0. The same call, two different methods: this is polymorphism.');
    return B.done('Polymorphism: one call, the method of the object');
  },

  arrinit() {
    const B = memoryBuilder().code([
      'int[] nums = {10, 6, -7, 9, 19};',
      "char[] grades = {'A', 'B', 'C', 'D', 'E', 'F'};",
      'String[] villages = {"Mochudi", "Serowe", "Kanye"};',
    ]);
    B.snap(-1, "Lecture 5's exercise: draw the memory diagram for the three initialisers. Each variable will hold an address; each array lives on the heap.");
    B.arr(100, 5, { x: 240, y: 30, cw: 62, fill: 0, t: 'int[]' }).v('nums', { r: 100 }, { y: 30 });
    [10, 6, -7, 9, 19].forEach((v, i) => B.set(100, i, v));
    B.snap(0, 'The braces make the array and fill it in one step: five cells, indexes 0 to 4, holding 10, 6, -7, 9 and 19. nums holds the address 100.');
    B.arr(200, 6, { x: 240, y: 160, cw: 50, fill: 0, t: 'char[]' }).v('grades', { r: 200 }, { y: 160 });
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach((v, i) => B.set(200, i, "'" + v + "'"));
    B.snap(1, 'A char array of six cells at 200, each holding one character.');
    B.arr(300, 3, { x: 240, y: 290, cw: 90, t: 'String[]' }).v('villages', { r: 300 }, { y: 290 });
    B.val(400, '"Mochudi"', { x: 600, y: 270, t: 'String' }).val(500, '"Serowe"', { x: 600, y: 340, t: 'String' }).val(600, '"Kanye"', { x: 600, y: 410, t: 'String' });
    B.set(300, 0, { r: 400 }).set(300, 1, { r: 500 }).set(300, 2, { r: 600 });
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
    B.v('n', 10, { y: 30 }).snap(0, 'int n = 10; a primitive box.');
    B.arr(100, 14, { x: 240, y: 90, cw: 46, fill: 0, t: 'int[]' }).v('numbers', { r: 100 }, { y: 90 });
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
    B.arr(100, 6, { x: 240, y: 40, cw: 62, fill: 0, t: 'int[]' }).v('numbers', { r: 100 }, { y: 40 });
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
    B.v('total', '10.0', { y: 30 }).snap(0, 'double total = 10; main has a variable total holding 10.0.');
    B.v('price', '10.0', { y: 130 }).v('rate', '7.5', { y: 210 });
    B.snap(1, 'addTax(total, 7.5) is called. A new set of boxes is made for the method: price receives a COPY of total (10.0) and rate receives 7.5. total is not connected to price.');
    B.v('tax', '0.75', { y: 290 }).snap(3, 'double tax = price * rate / 100 = 10.0 x 7.5 / 100 = 0.75, a local variable of addTax.');
    B.sv('price', '10.75').snap(4, 'price = price + tax changes only the method\'s own box: 10.75. total is still 10.0. The change has no effect outside the method.');
    B.unv('price').unv('rate').unv('tax').v('t', '0.75', { y: 130 });
    B.snap(1, 'return tax sends the value 0.75 back and the method ends: its boxes (price, rate, tax) disappear. main stores the value in t. total is still 10.0.');
    return B.done('Parameters are copies');
  },

  binsearch() {
    const B = memoryBuilder().code([
      'int[] arr = {8, 18, 23, 29, 34, 42, 54, 63, 72, 85};',
      'int key = 18, low = 0, high = 9;',
      'int mid = low + (high - low) / 2;   // arr[mid] > key, so high = mid - 1',
      'int mid = low + (high - low) / 2;   // arr[mid] == key: found',
    ]);
    B.snap(-1, "Lecture 8's binary search for 18 in the sorted array, using the lecture's method. Keep track of the part of the array that is still being searched: low and high.");
    B.arr(100, 10, { x: 260, y: 30, cw: 52, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [8, 18, 23, 29, 34, 42, 54, 63, 72, 85].forEach((v, i) => B.set(100, i, v));
    B.v('key', 18, { y: 110 }).v('low', 0, { y: 190 }).v('high', 9, { y: 270 });
    B.snap(1, 'The whole array is the search space: low = 0, high = 9, and the sorted array is what makes binary search possible.');
    B.v('mid', 4, { y: 350 }).snap(2, 'mid = 0 + (9 - 0) / 2 = 4. arr[4] is 34. 18 == 34? No. 18 < 34? Yes, so ignore the right side: high = mid - 1 = 3.');
    B.sv('high', 3).snap(2, 'high becomes 3. The search space is indexes 0 to 3 (8, 18, 23, 29). Half of the array has been discarded with one comparison.');
    B.sv('mid', 1).snap(3, 'mid = 0 + (3 - 0) / 2 = 1. arr[1] is 18. 18 == 18? Yes: found at index 1, after two passes of the loop. The method returns 1.');
    return B.done('Binary search: finding 18');
  },

  binmiss() {
    const B = memoryBuilder().code([
      'int[] arr = {8, 18, 23, 29, 34, 42, 54, 63, 72, 85};',
      'int key = 31, low = 0, high = 9;',
      'while (low <= high) {',
      '    int mid = low + (high - low) / 2;',
      '    if (arr[mid] < key) low = mid + 1; else if (arr[mid] > key) high = mid - 1;',
    ]);
    B.snap(-1, 'Binary search for a key that is NOT in the array: 31. The loop ends when the search space is empty, low > high.');
    B.arr(100, 10, { x: 260, y: 30, cw: 52, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [8, 18, 23, 29, 34, 42, 54, 63, 72, 85].forEach((v, i) => B.set(100, i, v));
    B.v('key', 31, { y: 110 }).v('low', 0, { y: 190 }).v('high', 9, { y: 270 });
    B.snap(1, 'low = 0, high = 9: ten cells to search.');
    B.v('mid', 4, { y: 350 }).sv('high', 3).snap(4, 'mid = 4, arr[4] = 34 > 31, so high = 3. Search space: indexes 0 to 3.');
    B.sv('mid', 1).sv('low', 2).snap(4, 'mid = 1, arr[1] = 18 < 31, so low = 2. Search space: indexes 2 to 3.');
    B.sv('mid', 2).sv('low', 3).snap(4, 'mid = 2, arr[2] = 23 < 31, so low = 3. Search space: index 3 only.');
    B.sv('mid', 3).sv('low', 4).snap(4, 'mid = 3, arr[3] = 29 < 31, so low = 4. Now low (4) > high (3): the search space is empty and the loop ends. Four passes, key not found: the method returns -1.');
    return B.done('Binary search: 31 is not there');
  },

  bubblesort() {
    const B = memoryBuilder().code([
      'int[] arr = {63, 29, 72, 85, 18};',
      'for (int i = 0; i < arr.length; i++)',
      '    for (int j = 0; j < arr.length - 1; j++)',
      '        if (arr[j] > arr[j + 1]) swap arr[j], arr[j + 1]',
    ]);
    B.snap(-1, "Lecture 9's bubble sort on 63 29 72 85 18. Show the array at the end of each pass (the lecture's exercise). Each pass compares the neighbours and swaps those out of order.");
    B.arr(100, 5, { x: 260, y: 30, cw: 62, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [63, 29, 72, 85, 18].forEach((v, i) => B.set(100, i, v));
    B.snap(0, 'The unsorted array: 63, 29, 72, 85, 18.');
    B.set(100, 0, 29).set(100, 1, 63).set(100, 3, 18).set(100, 4, 85);
    B.snap(3, 'End of pass 1: (63,29) swapped, (63,72) left, (72,85) left, (85,18) swapped. The largest value, 85, has bubbled to the end: 29, 63, 72, 18, 85.');
    B.set(100, 2, 18).set(100, 3, 72);
    B.snap(3, 'End of pass 2: only (72,18) is out of order and is swapped: 29, 63, 18, 72, 85. Now the two largest values are in place.');
    B.set(100, 1, 18).set(100, 2, 63);
    B.snap(3, 'End of pass 3: (63,18) is swapped: 29, 18, 63, 72, 85.');
    B.set(100, 0, 18).set(100, 1, 29);
    B.snap(3, 'End of pass 4: (29,18) is swapped: 18, 29, 63, 72, 85. The array is sorted.');
    B.snap(3, 'Pass 5 makes no swap. The lecture\'s version always makes 5 passes of 4 comparisons (20 comparisons), even when the array was sorted earlier.');
    return B.done('Bubble sort, pass by pass');
  },

  selectionsort() {
    const B = memoryBuilder().code([
      'int[] arr = {63, 29, 72, 85, 18};',
      'for (int i = 0; i < arr.length - 1; i++) {',
      '    int minIndex = i;',
      '    for (int j = i + 1; j < arr.length; j++) if (arr[j] < arr[minIndex]) minIndex = j;',
      '    swap arr[minIndex] and arr[i]',
    ]);
    B.snap(-1, "Lecture 9's selection sort on 63 29 72 85 18. Each pass finds the smallest value in the unsorted part and swaps it into position i.");
    B.arr(100, 5, { x: 260, y: 30, cw: 62, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [63, 29, 72, 85, 18].forEach((v, i) => B.set(100, i, v));
    B.v('i', 0, { y: 110 }).v('minIndex', 0, { y: 190 });
    B.snap(0, 'i = 0, minIndex = 0 (the value 63). The inner loop will look at indexes 1 to 4.');
    B.sv('minIndex', 4).set(100, 0, 18).set(100, 4, 63);
    B.snap(4, 'The smallest value in indexes 0 to 4 is 18, at minIndex = 4. Swap arr[4] and arr[0]: 18, 29, 72, 85, 63.');
    B.sv('i', 1).sv('minIndex', 1);
    B.snap(2, 'i = 1: the smallest of indexes 1 to 4 (29, 72, 85, 63) is 29, already at index 1. minIndex = 1, so the swap changes nothing.');
    B.sv('i', 2).sv('minIndex', 4).set(100, 2, 63).set(100, 4, 72);
    B.snap(4, 'i = 2: the smallest of indexes 2 to 4 (72, 85, 63) is 63, at minIndex = 4. Swap arr[4] and arr[2]: 18, 29, 63, 85, 72.');
    B.sv('i', 3).sv('minIndex', 4).set(100, 3, 72).set(100, 4, 85);
    B.snap(4, 'i = 3: the smaller of 85 and 72 is 72, at minIndex = 4. Swap: 18, 29, 63, 72, 85. The array is sorted after n - 1 = 4 passes and at most 4 swaps.');
    return B.done('Selection sort, pass by pass');
  },

  insertionsort() {
    const B = memoryBuilder().code([
      'int[] arr = {29, 63, 72, 85, 18};   // after i = 1, 2, 3 the first four are sorted',
      'int temp = arr[4];   // 18, the item to place; j = 4',
      'while (j > 0 && temp < arr[j - 1]) { arr[j] = arr[j - 1]; j--; }',
      'arr[j] = temp;',
    ]);
    B.snap(-1, "Lecture 9's insertion sort, the last pass (i = 4) on the array 63 29 72 85 18. The first four cells are the sorted part, and 18 is the next item taken from the unsorted part.");
    B.arr(100, 5, { x: 260, y: 30, cw: 62, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [29, 63, 72, 85, 18].forEach((v, i) => B.set(100, i, v));
    B.v('temp', 18, { y: 110 }).v('j', 4, { y: 190 });
    B.snap(1, 'temp holds the item to insert (18) and j = 4, its current position. The value at index 4 will be overwritten, so it has been saved in temp.');
    B.set(100, 4, 85).sv('j', 3);
    B.snap(2, '18 < arr[3] (85): shift 85 right into index 4, and j = 3. (A shift is one assignment, not a swap.)');
    B.set(100, 3, 72).sv('j', 2);
    B.snap(2, '18 < arr[2] (72): shift 72 right into index 3, and j = 2.');
    B.set(100, 2, 63).sv('j', 1);
    B.snap(2, '18 < arr[1] (63): shift 63 right into index 2, and j = 1.');
    B.set(100, 1, 29).sv('j', 0);
    B.snap(2, '18 < arr[0] (29): shift 29 right into index 1, and j = 0. The loop stops because j is 0.');
    B.set(100, 0, 18).snap(3, 'arr[j] = temp: 18 is placed at index 0. The array is sorted: 18, 29, 63, 72, 85. This was the worst case for one item: it moved past every sorted item.');
    return B.done('Insertion sort: placing 18');
  },

  mergearrays() {
    const B = memoryBuilder().code([
      'int[] arr = {20, 36, 13, 54};   // the halves are already sorted',
      'merge(arr, 0, 1, 3);',
      'int[] left = {20, 36};   int[] right = {13, 54};',
      'while (i < size1 && j < size2) { arr[cur++] = (left[i] <= right[j]) ? left[i++] : right[j++]; }',
      '// copy what is left of left, then what is left of right',
    ]);
    B.snap(-1, "Lab 5's merge method, as memory. merge COPIES the two halves into new arrays left and right, then writes the smaller front item back into arr each time.");
    B.arr(100, 4, { x: 260, y: 30, cw: 62, t: 'int[]' }).v('arr', { r: 100 }, { y: 30 });
    [20, 36, 13, 54].forEach((v, i) => B.set(100, i, v));
    B.snap(0, 'arr holds two sorted halves: 20, 36 (indexes 0 to 1) and 13, 54 (indexes 2 to 3). merge(arr, s = 0, m = 1, e = 3) is called.');
    B.arr(200, 2, { x: 260, y: 150, cw: 62, t: 'int[] left' }).v('left', { r: 200 }, { y: 150 });
    B.set(200, 0, 20).set(200, 1, 36);
    B.arr(300, 2, { x: 260, y: 260, cw: 62, t: 'int[] right' }).v('right', { r: 300 }, { y: 260 });
    B.set(300, 0, 13).set(300, 1, 54);
    B.v('i', 0, { y: 370 }).v('j', 0, { y: 440 }).v('cur', 0, { y: 510 });
    B.snap(2, 'size1 = m - s + 1 = 2 and size2 = e - m = 2, so two new arrays are made and filled with copies of the halves. i, j and cur start at 0 (cur is the index in arr).');
    B.set(100, 0, 13).sv('j', 1).sv('cur', 1);
    B.snap(3, 'left[0] = 20 against right[0] = 13: 20 <= 13 is false, so arr[0] = 13 and j = 1.');
    B.set(100, 1, 20).sv('i', 1).sv('cur', 2);
    B.snap(3, 'left[0] = 20 against right[1] = 54: 20 <= 54, so arr[1] = 20 and i = 1.');
    B.set(100, 2, 36).sv('i', 2).sv('cur', 3);
    B.snap(3, 'left[1] = 36 against right[1] = 54: 36 <= 54, so arr[2] = 36 and i = 2. The left array is used up (i = size1).');
    B.set(100, 3, 54).sv('j', 2).sv('cur', 4);
    B.snap(4, 'The loop ends. The leftover item of right (54) is copied: arr[3] = 54. arr is 13, 20, 36, 54. left and right are no longer needed when merge returns.');
    return B.done('Merge: left and right copied back into arr');
  },
};

export const memoryScenarioIds = Object.keys(scenarios);

/** Builds a scenario by id. Throws for an unknown id, so a typo in the notes stops the build instead of drawing nothing. */
export function buildMemoryScenario(id: string): MemScenario {
  const build = scenarios[id];
  if (!build) throw new Error(`MemoryDiagram: unknown scenario "${id}" (known: ${memoryScenarioIds.join(', ')}).`);
  return build();
}
