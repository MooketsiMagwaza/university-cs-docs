/**
 * Memory-diagram scenarios about linked lists (Lectures 13 and 14). Two shapes are drawn: a bare `Node head` variable that
 * points straight at the first node, and the lecture's LinkedList class, where the variable points at a LinkedList OBJECT
 * (a box holding head, and sometimes tail and size) that points at the first node. Nodes sit in a row in the order the list
 * has at the end, so an arrow that skips a node is an arrow that skips a node.
 */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

const NODE = { cw: 46 };
const FIRST = { dx: 130, gap: 60 }; // the first node, below the list object and a little to its right

export const linkedListScenarios: Record<string, () => MemScenario> = {
  llbuild() {
    const B = memoryBuilder().opt({ history: false }).code([
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
    // final order of the nodes, left to right: 12, 33, 57, 41
    const at12 = { at: { x: 0, y: 0 }, ...NODE, t: 'Node' };
    const at33 = { at: { right: 367, gap: 56 }, ...NODE };
    const at57 = { at: { right: 100, gap: 56 }, ...NODE };
    const at41 = { at: { right: 450, gap: 56 }, ...NODE };
    B.snap(-1, 'We will build and change a singly linked list one pointer at a time. Each Node has two parts: data (the value) and next (the address of the following node).');
    B.v('head', 'null').snap(0, 'An empty list: head holds null. There are no nodes at all.');
    B.node(100, 33, 'null', { ...at33, t: 'Node' }).sv('head', { r: 100 }).snap(1, 'new Node(33) creates a node at 100 with data 33 and next null. head now holds 100: the list has one node.');
    B.node(290, 41, 'null', at41).set(100, 'next', { r: 290 }).snap(2, "A second node at 290. head.next means \"the next field of the node head points to\", so the 33 node's next becomes 290. List: 33 → 41.");
    B.node(367, 12, 'null', at12).v('n', { r: 367 }).snap(3, 'ADD AT THE FRONT, part 1: make the new node (12) at 367. It is not part of the list yet: nothing in the list points to it.');
    B.set(367, 'next', { r: 100 }).snap(4, 'Part 2: link the new node to the current first node: n.next = head copies 100 into its next field.');
    B.sv('head', { r: 367 }).snap(5, 'Part 3: head = n. head now holds 367, so the list starts at 12: 12 → 33 → 41. Order matters: if you moved head first, you would lose the address of the 33 node.');
    B.unv('n').v('cur', { r: 100 }).snap(6, 'INSERT IN THE MIDDLE (57 after 33). (n was only a helper, so we stop drawing it.) cur = head.next walks one step: cur holds 100, the 33 node.');
    B.node(450, 57, 'null', at57).v('m', { r: 450 }).snap(7, 'Make the new node 57 at 450.');
    B.set(450, 'next', { r: 290 }).snap(8, 'm.next = cur.next: the new node first grabs the address of the node AFTER cur (290, the 41 node).');
    B.set(100, 'next', { r: 450 }).snap(9, 'cur.next = m: now 33 points to 57. List: 12 → 33 → 57 → 41. If you did these two lines the other way round, the 41 node would be lost.');
    B.unv('cur').unv('m').snap(10, 'REMOVE 33. (cur and m were helpers, so we stop drawing them.) head.next.next is the node after 33, which is 450.');
    B.set(367, 'next', { r: 450 }).snap(10, 'head.next = head.next.next makes 12 skip over 33 and point straight to 57. Nothing points to the 33 node now: it is garbage. List: 12 → 57 → 41.');
    B.sv('head', { r: 450 }).snap(11, 'REMOVE THE FIRST NODE: head = head.next. head jumps to 450, and the 12 node becomes garbage. Final list: 57 → 41.');
    return B.done('Singly linked list, pointer by pointer');
  },

  lltrav() {
    const B = memoryBuilder().opt({ dead: false }).code(['Node cur = head;', 'while (cur != null) {', '    System.out.print(cur.data + " ");', '    cur = cur.next;', '}']);
    const ad = [367, 100, 450, 290];
    const vals = [12, 33, 57, 41];
    ad.forEach((a, i) => B.node(a, vals[i], i < 3 ? { r: ad[i + 1] } : 'null', { at: i ? { right: ad[i - 1], gap: 56 } : { x: 0, y: 0 }, ...NODE, ...(i ? {} : { t: 'Node' }) }));
    B.v('head', { r: 367 });
    B.snap(-1, 'A list 12 → 33 → 57 → 41 already exists. We want to visit every node in order. A linked list has no indexes, so the only way is to follow the next arrows.');
    B.v('cur', { r: 367 }, { w: 200 }).snap(0, 'cur = head: cur starts at the first node (367).');
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

  llslide() {
    const B = memoryBuilder();
    B.obj(100, [['head', { r: 290 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(290, 33, { r: 367 }, { at: { right: 100, dy: 35, gap: 70 }, ...NODE, t: 'Node' })
      .node(367, 41, 'null', { at: { right: 290, gap: 56 }, ...NODE })
      .v('names', { r: 100 }, { t: 'LinkedList' })
      .snap(0, '');
    return B.done('A linked list with two nodes');
  },

  llq() {
    const B = memoryBuilder();
    B.node(100, 5, 'null', { at: { x: 0, y: 0 }, ...NODE, t: 'Node' })
      .node(200, 9, 'null', { at: { right: 100, gap: 56 }, ...NODE })
      .node(300, 2, 'null', { at: { right: 200, gap: 56 }, ...NODE });
    B.v('a', { r: 100 })
      .set(100, 'next', { r: 200 })
      .set(200, 'next', { r: 300 })
      .v('b', { r: 200 })
      .set(200, 'data', 7)
      .snap(0, '');
    return B.done('Practice answer');
  },

  dll() {
    const B = memoryBuilder();
    B.obj(500, [['head', { r: 100 }], ['tail', { r: 367 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(100, 33, { r: 290 }, { at: { below: 500, ...FIRST }, ...NODE, prev: 'null', t: 'Node' })
      .node(290, 41, { r: 367 }, { at: { right: 100, gap: 60 }, ...NODE, prev: { r: 100 } })
      .node(367, 57, 'null', { at: { right: 290, gap: 60 }, ...NODE, prev: { r: 290 } });
    B.v('list', { r: 500 }, { t: 'LinkedList' }).snap(0, '');
    return B.done('Doubly linked list');
  },

  llcircular() {
    const B = memoryBuilder();
    B.node(100, 6, { r: 200 }, { at: { x: 0, y: 0 }, ...NODE, t: 'Node' })
      .node(200, 3, { r: 300 }, { at: { right: 100, gap: 56 }, ...NODE })
      .node(300, 9, { r: 100 }, { at: { right: 200, gap: 56 }, ...NODE });
    B.v('head', { r: 100 }).snap(0, '');
    return B.done('Circular linked list');
  },

  lladdlast() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Node n = new Node(7);',
      'Node currNode = head;',
      'while (currNode.next != null)',
      '    currNode = currNode.next;',
      'currNode.next = n;',
    ]);
    B.snap(-1, "The lecture's list 6 → 3 → 9, inside a LinkedList object. To add 7 at the END, the new node must become the tail, so we first have to find the old tail: the node whose next is null.");
    B.obj(340, [['head', { r: 100 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(100, 6, { r: 200 }, { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' })
      .node(200, 3, { r: 300 }, { at: { right: 100, gap: 44 }, ...NODE })
      .node(300, 9, 'null', { at: { right: 200, gap: 44 }, ...NODE })
      .v('myList', { r: 340 }, { t: 'LinkedList' });
    B.snap(-1, 'myList points at the LinkedList object (340), whose head field holds 100, the address of the first node.');
    B.node(400, 7, 'null', { at: { right: 300, gap: 44 }, ...NODE }).v('n', { r: 400 });
    B.snap(0, 'Create the new node: data 7, next null. n holds its address (400). It is not part of the list yet: nothing in the list points to it.');
    B.v('currNode', { r: 100 });
    B.snap(1, 'Start the traversal at the first node: currNode = head, so currNode holds 100.');
    B.snap(2, "currNode.next != null? The 6 node's next is 200, so yes: keep walking.");
    B.sv('currNode', { r: 200 }).snap(3, 'currNode = currNode.next: it now holds 200, the 3 node.');
    B.snap(2, "currNode.next != null? The 3 node's next is 300, so yes.");
    B.sv('currNode', { r: 300 }).snap(3, 'currNode now holds 300, the 9 node.');
    B.snap(2, "currNode.next != null? The 9 node's next is null, so the loop stops. currNode is ON the tail. (For a list of n nodes this loop moves n − 1 times: addLast is O(n).)");
    B.set(300, 'next', { r: 400 }).snap(4, 'currNode.next = n: the old tail now points to the new node. The list is 6 → 3 → 9 → 7 and 7 is the new tail, its next still null.');
    return B.done('addLast: walk to the tail, then link the new node');
  },

  lladdfront() {
    const B = memoryBuilder().opt({ history: false }).code(['Node n = new Node(7);', 'n.next = head;', 'head = n;']);
    B.snap(-1, "The lecture's list 6 → 3 → 9, inside a LinkedList object. To add 7 in FRONT nothing needs to be traversed: only head and the new node's next change.");
    B.obj(340, [['head', { r: 100 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(100, 6, { r: 200 }, { at: { right: 400, gap: 44 }, ...NODE, t: 'Node' })
      .node(200, 3, { r: 300 }, { at: { right: 100, gap: 44 }, ...NODE })
      .node(300, 9, 'null', { at: { right: 200, gap: 44 }, ...NODE })
      .v('myList', { r: 340 }, { t: 'LinkedList' });
    B.node(400, 7, 'null', { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' }).v('n', { r: 400 });
    B.snap(0, 'The list object (340) holds head = 100. Create the new node (400) with data 7 and next null. It is outside the list for now.');
    B.set(400, 'next', { r: 100 }).snap(1, 'n.next = head: the new node points at the current first node (100). Do this FIRST, while head still holds the address of the old list.');
    B.set(340, 'head', { r: 400 }).snap(2, 'head = n: the head field of the list object now holds 400, so the list is 7 → 6 → 3 → 9. Only two assignments, whatever the length of the list: addFront is O(1).');
    return B.done('addFront: two assignments');
  },

  lladdat() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Node n = new Node(7);',
      'Node cur = head;      // the node BEFORE the position (position 1: the first node)',
      'n.next = cur.next;',
      'cur.next = n;',
    ]);
    B.snap(-1, "The lecture's list 6 → 3 → 9, inside a LinkedList object. We add 7 as the SECOND node (index 1): the new node must end up between 6 and 3.");
    B.obj(340, [['head', { r: 100 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(100, 6, { r: 200 }, { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' })
      .node(200, 3, { r: 300 }, { at: { right: 400, gap: 44 }, ...NODE })
      .node(300, 9, 'null', { at: { right: 200, gap: 44 }, ...NODE })
      .v('myList', { r: 340 }, { t: 'LinkedList' });
    B.node(400, 7, 'null', { at: { right: 100, gap: 44 }, ...NODE }).v('n', { r: 400 });
    B.snap(0, 'Create the new node (400): data 7, next null.');
    B.v('cur', { r: 100 });
    B.snap(1, 'Traverse until the node BEFORE the position. For index 1 that is the first node, so cur = head and the loop moves 0 times.');
    B.set(400, 'next', { r: 200 }).snap(2, 'n.next = cur.next: the new node first grabs the address of its right neighbour (200, the 3 node).');
    B.set(100, 'next', { r: 400 }).snap(3, 'cur.next = n: now 6 points to 7. The list is 6 → 7 → 3 → 9. Done in this order, nothing is lost; the other way round, the 3 → 9 part of the list would be unreachable.');
    return B.done('add at a position: link the new node to its right neighbour first');
  },

  llremove() {
    const B = memoryBuilder().opt({ history: false }).code([
      'head = head.next;      // removeFront()',
      'Node cur = head;       // removeLast() starts here',
      'while (cur.next.next != null)',
      '    cur = cur.next;',
      'cur.next = null;',
    ]);
    B.snap(-1, 'A list 6 → 3 → 9 → 7, inside a LinkedList object. We remove the first node, then the last.');
    B.obj(340, [['head', { r: 100 }]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' })
      .node(100, 6, { r: 200 }, { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' })
      .node(200, 3, { r: 300 }, { at: { right: 100, gap: 44 }, ...NODE })
      .node(300, 9, { r: 400 }, { at: { right: 200, gap: 44 }, ...NODE })
      .node(400, 7, 'null', { at: { right: 300, gap: 44 }, ...NODE })
      .v('myList', { r: 340 }, { t: 'LinkedList' });
    B.snap(-1, 'The list object (340) holds head = 100.');
    B.set(340, 'head', { r: 200 }).snap(0, 'removeFront: head = head.next. head now holds 200. Nothing points to the 6 node any more, so it is isolated: the garbage collector reclaims its memory. List: 3 → 9 → 7.');
    B.v('cur', { r: 200 });
    B.snap(1, 'removeLast: start at the first node, cur = head.');
    B.snap(2, 'cur.next.next != null? cur.next is 300 and its next is 400, not null: keep walking.');
    B.sv('cur', { r: 300 }).snap(3, 'cur = cur.next: cur holds 300, the 9 node.');
    B.snap(2, 'cur.next.next != null? cur.next is 400 and its next is null: stop. cur is the SECOND-LAST node.');
    B.set(300, 'next', 'null').snap(4, 'cur.next = null: the 9 node no longer points to the 7 node, which is isolated and becomes garbage. List: 3 → 9. (On a one-node list cur.next.next would fail: cur.next is null.)');
    return B.done('removeFront and removeLast');
  },

  llpractice() {
    const B = memoryBuilder().opt({ history: false }).code(['Node a = new Node(4);', 'a.next = new Node(8);', 'Node b = a.next;', 'b.next = new Node(2);', 'a = a.next;']);
    B.snap(-1, 'Five lines of Java, no list class: just Node variables. Work out what each line does to the boxes before you step on.');
    B.node(100, 4, 'null', { at: { x: 0, y: 0 }, ...NODE, t: 'Node' }).v('a', { r: 100 });
    B.snap(0, 'new Node(4) makes a node at 100 with next null. a holds its address.');
    B.node(200, 8, 'null', { at: { right: 100, gap: 56 }, ...NODE }).set(100, 'next', { r: 200 });
    B.snap(1, "A second node (200) is created and its address is stored in the first node's next. a is unchanged: it still holds 100.");
    B.v('b', { r: 200 });
    B.snap(2, "b = a.next: follow a to the 4 node, read its next field (200) and copy it into b. b and the first node's next now hold the same address.");
    B.node(300, 2, 'null', { at: { right: 200, gap: 56 }, ...NODE }).set(200, 'next', { r: 300 });
    B.snap(3, 'b.next = new Node(2): follow b to the 8 node and store the address of a new node (300) in its next field. The chain is 4 → 8 → 2.');
    B.sv('a', { r: 200 }).snap(4, 'a = a.next: a moves to 200. Nothing points to the 4 node now (a no longer does, and no next field does), so it is garbage. a and b both point at the 8 node; the reachable list is 8 → 2.');
    return B.done('Node variables: what each line does');
  },

  llexercise() {
    const B = memoryBuilder().opt({ history: false }).code([
      'LinkedList myList = new LinkedList();',
      'myList.addLast(6);',
      'myList.addLast(3);',
      'myList.addLast(9);',
      'myList.removeFront();',
      'myList.addFront(12);',
      'myList.addFront(8);',
    ]);
    B.snap(-1, 'The end of Lecture 14 asks for a memory diagram of every action of the tester, in order. This is that diagram for a shorter run: three nodes added, the first removed, two added in front.');
    // final order, left to right: 8, 12, 6 (removed), 3, 9
    B.obj(340, [['head', 'null']], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' }).v('myList', { r: 340 }, { t: 'LinkedList' });
    B.snap(0, 'new LinkedList(): the constructor sets head to null. myList holds the address of the LinkedList object (340). The list is empty.');
    B.node(100, 6, 'null', { at: { right: 400, gap: 40 }, ...NODE, t: 'Node' }).set(340, 'head', { r: 100 });
    B.snap(1, 'addLast(6) on an empty list: the new node becomes the first node, so head = 100.');
    B.node(200, 3, 'null', { at: { right: 100, gap: 40 }, ...NODE }).set(100, 'next', { r: 200 });
    B.snap(2, 'addLast(3): walk to the tail (the 6 node) and link the new node (200) after it.');
    B.node(300, 9, 'null', { at: { right: 200, gap: 40 }, ...NODE }).set(200, 'next', { r: 300 });
    B.snap(3, 'addLast(9): walk to the tail (the 3 node) and link the new node (300) after it. List: 6 → 3 → 9.');
    B.set(340, 'head', { r: 200 }).snap(4, 'removeFront: head = head.next, so head holds 200. The 6 node is isolated: garbage. List: 3 → 9.');
    B.node(500, 8, { r: 400 }, { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' });
    B.node(400, 12, { r: 200 }, { at: { right: 500, gap: 40 }, ...NODE }).set(340, 'head', { r: 400 });
    B.snap(5, 'addFront(12): the new node (400) points at the old first node (200), then head = 400. List: 12 → 3 → 9.');
    B.set(340, 'head', { r: 500 }).snap(6, 'addFront(8): the new node (500) points at 400, then head = 500. Final list: 8 → 12 → 3 → 9, with the 6 node left as garbage.');
    return B.done('The Lecture 14 tester, action by action');
  },

  lltail() {
    const B = memoryBuilder().opt({ history: false }).code([
      'LinkedList names = new LinkedList();   // head, tail and size',
      'names.addLast(33);',
      'names.addLast(41);',
      'names.addLast(57);',
      'names.removeFront();',
    ]);
    B.snap(-1, 'A linked list class that keeps a tail reference as well as head (Lecture 13 marks both on its picture). The extra reference means addLast does not have to walk to the end: it is O(1).');
    B.obj(340, [['head', 'null'], ['tail', 'null'], ['size', 0]], { at: { x: 0, y: 0 }, w: 190, t: 'LinkedList' }).v('names', { r: 340 }, { t: 'LinkedList' });
    B.snap(0, 'new LinkedList(): head and tail are null and size is 0. names holds the address of the list object (340).');
    B.node(100, 33, 'null', { at: { below: 340, ...FIRST }, ...NODE, t: 'Node' }).set(340, 'head', { r: 100 }).set(340, 'tail', { r: 100 }).set(340, 'size', 1);
    B.snap(1, 'addLast(33) on an empty list: the one node is both the first and the last, so head and tail both hold 100. size 1.');
    B.node(200, 41, 'null', { at: { right: 100, gap: 44 }, ...NODE }).set(100, 'next', { r: 200 }).set(340, 'tail', { r: 200 }).set(340, 'size', 2);
    B.snap(2, 'addLast(41): no walking. tail.next = new node (100.next = 200), then tail = 200. head is unchanged. size 2.');
    B.node(300, 57, 'null', { at: { right: 200, gap: 44 }, ...NODE }).set(200, 'next', { r: 300 }).set(340, 'tail', { r: 300 }).set(340, 'size', 3);
    B.snap(3, 'addLast(57): again two assignments: 200.next = 300 and tail = 300. List: 33 → 41 → 57. size 3.');
    B.set(340, 'head', { r: 200 }).set(340, 'size', 2).snap(4, 'removeFront: head = head.next, so head holds 200 and size is 2. The 33 node is isolated and becomes garbage. tail is unchanged because the list is not empty.');
    return B.done('A list with head, tail and size');
  },
};
