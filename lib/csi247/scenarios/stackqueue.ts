/**
 * Memory-diagram scenarios about the stack and queue implementations of Lectures 15 and 16. The array versions are an
 * object (the array, plus top, or front and tail) whose array holds the ADDRESSES of Integer or String objects; the linked
 * versions are an object (top, or front and tail) that points at a chain of nodes whose data points at a String.
 */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

const NODE = { cw: 46 };
const FIRST = { dx: 130, gap: 60 };

export const stackQueueScenarios: Record<string, () => MemScenario> = {
  stackarray() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Stack1 st1 = new Stack1(5);',
      'st1.push(27);',
      'st1.push(38);',
      'st1.push(92);',
      'st1.pop();',
      'st1.push(46);',
    ]);
    B.snap(-1, "Lecture 15's array stack. The stack is an object holding an Integer array and the index top of the top element. We follow a stack of capacity 5.");
    B.obj(200, [['stack', { r: 300 }], ['top', -1]], { at: { x: 0, y: 0 }, w: 190, t: 'Stack1' })
      .arr(300, 5, { at: { below: 200, gap: 56 }, t: 'Integer[]' })
      .v('st1', { r: 200 }, { t: 'Stack1' });
    B.snap(0, 'new Stack1(5): the constructor creates an array of 5 slots (all null) and sets top = -1, which means the stack is empty. size() is top + 1 = 0.');
    B.val(400, '27', { at: { below: 300, slot: 0, gap: 56 } }).set(200, 'top', 0).set(300, 0, { r: 400 });
    B.snap(1, 'push(27): stack[++top] = num. top goes up first (-1 becomes 0), then the Integer 27 (400) is stored at the new top: slot [0] holds its address. size() = 1.');
    B.val(500, '38', { at: { below: 300, slot: 1, gap: 56 } }).set(200, 'top', 1).set(300, 1, { r: 500 });
    B.snap(2, 'push(38): top becomes 1 and the address of the Integer 38 (500) is stored in slot [1].');
    B.val(600, '92', { at: { below: 300, slot: 2, gap: 56 } }).set(200, 'top', 2).set(300, 2, { r: 600 });
    B.snap(3, 'push(92): top becomes 2 and the address of the Integer 92 (600) is stored in slot [2]. Three elements; top = 2.');
    B.set(200, 'top', 1).snap(4, 'pop(): return stack[top--]. The method returns 92 and THEN top goes down to 1. Slot [2] still holds the address 600, but it is above top, so it is no longer part of the stack: nothing is erased.');
    B.val(700, '46', { at: { below: 300, slot: 3, gap: 56 } }).set(200, 'top', 2).set(300, 2, { r: 700 });
    B.snap(5, 'push(46): top becomes 2 again and the address of the Integer 46 (700) overwrites the stale 600 in slot [2]; nothing points at 92 any more. A stack of capacity 5 is full when top = 4 (N - 1); a further push prints "Stack Overflow! Can not insert...".');
    return B.done('Array stack: top moves, slots are not cleared');
  },

  stacklinked() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Stack2 stk = new Stack2();',
      'stk.push("CSI247");',
      'stk.push("CSI243");',
      'stk.push("CSI141");',
      'stk.pop();',
    ]);
    B.snap(-1, "Lecture 15's linked stack: nodes are added and removed at the front of a linked list, and the object keeps one reference, top. Each node's data points at a String.");
    // left to right: the newest node (the top) first
    B.obj(340, [['top', 'null']], { at: { x: 0, y: 0 }, w: 190, t: 'Stack2' }).v('stk', { r: 340 }, { t: 'Stack2' });
    B.snap(0, 'new Stack2(): the constructor sets top = null. The stack is empty and there is no size limit.');
    B.val(110, '"CSI247"', { at: { below: 100, gap: 50 } })
      .node(100, { r: 110 }, 'null', { at: { right: 200, gap: 70 }, ...NODE, t: 'Node' })
      .set(340, 'top', { r: 100 });
    B.snap(1, 'push("CSI247") on an empty stack: a String (110) and the first node (100) with data pointing at it and next null; the new node is the top, so top = 100.');
    B.val(210, '"CSI243"', { at: { below: 200, gap: 50 } })
      .node(200, { r: 210 }, { r: 100 }, { at: { right: 300, gap: 70 }, ...NODE })
      .set(340, 'top', { r: 200 });
    B.snap(2, 'push("CSI243"): the new node points at the old top (100), then top = 200. This is adding a node in front of a linked list.');
    B.val(310, '"CSI141"', { at: { below: 300, gap: 50 } })
      .node(300, { r: 310 }, { r: 200 }, { at: { below: 340, ...FIRST }, ...NODE })
      .set(340, 'top', { r: 300 });
    B.snap(3, 'push("CSI141"): the new node points at the old top (200), then top = 300. The top of the stack is the newest node.');
    B.set(340, 'top', { r: 200 }).snap(4, 'pop(): save top.data ("CSI141"), then top = top.next, so top holds 200. Removing a node from the front of the list: the old top node (and its String, once the returned value is used up) is isolated and becomes garbage.');
    return B.done('Linked stack: push and pop at the front');
  },

  queuelinked() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Queue1 q = new Queue1();',
      'q.enqueue("19");',
      'q.enqueue("28");',
      'q.enqueue("35");',
      'q.dequeue();',
      'q.dequeue();',
      'q.dequeue();',
    ]);
    B.snap(-1, "Lecture 16's linked queue: a singly linked list with TWO references, front (where elements leave) and tail (where they join). This follows the lecture's illustration of enqueue(19), enqueue(28), enqueue(35) and dequeue().");
    B.obj(340, [['front', 'null'], ['tail', 'null']], { at: { x: 0, y: 0 }, w: 190, t: 'Queue1' }).v('q', { r: 340 }, { t: 'Queue1' });
    B.snap(0, 'new Queue1(): front = null and tail = null. The queue is empty.');
    B.val(110, '"19"', { at: { below: 100, gap: 50 } })
      .node(100, { r: 110 }, 'null', { at: { below: 340, ...{ dx: 130, gap: 70 } }, ...NODE, t: 'Node' })
      .set(340, 'front', { r: 100 })
      .set(340, 'tail', { r: 100 });
    B.snap(1, 'enqueue("19") on an empty queue: the new node (100) points at its String and becomes the tail, and because the queue was empty it is also the front. Both fields hold 100.');
    B.val(210, '"28"', { at: { below: 200, gap: 50 } })
      .node(200, { r: 210 }, 'null', { at: { right: 100, gap: 44 }, ...NODE })
      .set(100, 'next', { r: 200 })
      .set(340, 'tail', { r: 200 });
    B.snap(2, 'enqueue("28"): oldTail = tail; tail = new node; oldTail.next = tail. The 19 node points at the 28 node and tail moves to 200. front is unchanged.');
    B.val(310, '"35"', { at: { below: 300, gap: 50 } })
      .node(300, { r: 310 }, 'null', { at: { right: 200, gap: 44 }, ...NODE })
      .set(200, 'next', { r: 300 })
      .set(340, 'tail', { r: 300 });
    B.snap(3, 'enqueue("35"): the 28 node points at the 35 node and tail = 300. The queue reads front 19, 28, 35 tail.');
    B.set(340, 'front', { r: 200 }).snap(4, 'dequeue(): save front.data ("19"), then front = front.next. front holds 200; the 19 node is isolated and becomes garbage. tail is unchanged because the queue is not empty.');
    B.set(340, 'front', { r: 300 }).snap(5, 'dequeue() again: front = 300. The 28 node is garbage. One element (35) is left, so front and tail both hold 300.');
    B.set(340, 'front', 'null').set(340, 'tail', 'null').snap(6, "dequeue() once more: front = front.next is null, so the queue is now empty. The lecture's code then sets tail = null too, otherwise tail would still refer to the removed 35 node.");
    return B.done('Linked queue: enqueue at the tail, dequeue at the front');
  },

  queuearray() {
    const B = memoryBuilder().opt({ history: false }).code([
      'Queue1 q = new Queue1(6);',
      'q.enqueue("26");',
      'q.enqueue("69");',
      'q.enqueue("48");',
      'q.dequeue();',
      'q.dequeue();',
      'q.dequeue();',
      'q.enqueue("52");',
    ]);
    B.snap(-1, "Lecture 16's array queue: an array plus two indexes, front and tail. The lecture's pictures use an array of 6 slots, indexes 0 to 5. The array holds the addresses of String objects.");
    B.obj(200, [['queue', { r: 300 }], ['front', -1], ['tail', -1]], { at: { x: 0, y: 0 }, w: 190, t: 'Queue1' })
      .arr(300, 6, { at: { below: 200, gap: 56 }, t: 'String[]' })
      .v('q', { r: 200 }, { t: 'Queue1' });
    B.snap(0, 'new Queue1(6): a String array of 6 slots, front = -1 and tail = -1 (smaller than any index): the queue is empty and the two indexes agree.');
    B.val(400, '"26"', { at: { below: 300, slot: 0, gap: 56 } }).set(200, 'front', 0).set(200, 'tail', 0).set(300, 0, { r: 400 });
    B.snap(1, 'enqueue("26") on an empty queue: front = tail = 0, and the address of the String "26" (400) is stored at tail.');
    B.val(500, '"69"', { at: { below: 300, slot: 1, gap: 56 } }).set(200, 'tail', 1).set(300, 1, { r: 500 });
    B.snap(2, 'enqueue("69"): tail++ then store the address of "69". front stays 0.');
    B.val(600, '"48"', { at: { below: 300, slot: 2, gap: 56 } }).set(200, 'tail', 2).set(300, 2, { r: 600 });
    B.snap(3, 'enqueue("48"): tail = 2. size() = tail - front + 1 = 3.');
    B.set(200, 'front', 1).snap(4, 'dequeue(): return queue[front] ("26"), then front++. The element leaves the QUEUE, not the array: slot [0] still holds the address 400. size() = 2 - 1 + 1 = 2.');
    B.set(200, 'front', 2).snap(5, 'dequeue(): returns "69"; front = 2. Only "48" is left: front and tail are both 2.');
    B.set(200, 'front', 3).snap(6, 'dequeue(): returns "48"; front = 3 is now past tail (2), so size() = 2 - 3 + 1 = 0: the queue is empty, although the three old addresses are still in the array.');
    B.val(700, '"52"', { at: { below: 300, slot: 3, gap: 56 } }).set(200, 'front', 0).set(200, 'tail', 0).set(300, 0, { r: 700 });
    B.snap(7, 'enqueue("52"): the queue is empty, so front = tail = 0 again and the address of "52" (700) overwrites the stale 400 in slot [0]. This is the only time the freed slots at the start are reused.');
    return B.done('Array queue: front and tail move forwards');
  },
};
