/** Memory-diagram scenarios about objects: fields, Strings, references, aliasing and inheritance. */
import { memoryBuilder, type MemScenario } from '../memory-diagram';

export const objectScenarios: Record<string, () => MemScenario> = {
  student() {
    const B = memoryBuilder().code([
      'Student[] students = new Student[3];',
      'Student myStudent = new Student("John", 67, 3.5);',
      'students[2] = myStudent;',
      'myStudent.setName("Smith");',
      'myStudent.setAge(18);',
    ]);
    B.snap(-1, 'Empty memory. Stack (variables) on the left, heap (objects) on the right.');
    B.arr(100, 3, { at: { x: 0, y: 0 }, cw: 92, t: 'Student[]' })
      .v('students', { r: 100 })
      .snap(0, 'new Student[3] creates an array of 3 slots at address 100. Important: it does NOT create any Student objects. Every slot holds null, meaning "points at nothing". students holds the address 100.');
    B.val(300, '"John"', { at: { right: 200, dy: 36, gap: 80 } })
      .obj(200, [['name', { r: 300 }], ['age', 67], ['gpa', 3.5]], { at: { below: 100, gap: 64 }, w: 250, t: 'Student' })
      .v('myStudent', { r: 200 });
    B.snap(1, 'new Student("John", 67, 3.5) creates one Student object at 200 with three fields. name is a String, and every String is an object, so "John" gets its own box at 300 and name holds 300. age and gpa are primitives, so their values sit directly inside. myStudent holds 200.');
    B.set(100, 2, { r: 200 }).snap(2, 'students[2] = myStudent; copies the address 200 into slot [2]: cross out null, write 200, draw the arrow. There is still only ONE student, reachable two ways.');
    B.val(400, '"Smith"', { at: { below: 300, gap: 70 } })
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
    B.arr(100, 4, { at: { x: 0, y: 0 }, cw: 80, t: 'Course[]' })
      .v('ours', { r: 100 })
      .snap(0, 'An array of 4 Course references at 100, every slot null. ours holds 100.');
    B.val(300, '"ICT101"', { at: { right: 200, dy: 36, gap: 80 } })
      .obj(200, [['code', { r: 300 }], ['enrol', 140]], { at: { below: 100, gap: 64 }, w: 230, t: 'Course' })
      .v('c1', { r: 200 });
    B.snap(1, 'The constructor builds a Course at 200. code points to the String "ICT101" (its own object, at 300). enrol is an int, so 140 sits inside the box. c1 holds 200.');
    B.set(100, 1, { r: 200 }).snap(2, 'ours[1] = c1; puts the address 200 into slot [1]. Cross out null.');
    B.val(400, '"CSI247"', { at: { below: 300, gap: 70 } })
      .set(200, 'code', { r: 400 })
      .snap(3, 'ours[1].setCode("CSI247"): go to slot [1], follow its arrow to the Course, and change code. A new String object appears at 400; cross out 300 and its arrow. "ICT101" is now garbage.');
    B.set(200, 'enrol', 230).snap(4, 'ours[1].setEnrolment(230): cross out 140, write 230. Final diagram.');
    return B.done('Array of objects: Course');
  },

  shape() {
    const B = memoryBuilder().code(['Shape s = new Circle("Yellow", 5);', 's.setColour("Pink");', 'Shape t = s;']);
    B.snap(-1, 'Circle extends Shape. Watch what a Circle object actually contains.');
    B.val(300, '"Yellow"', { at: { right: 200, dy: 36, gap: 80 } })
      .obj(200, [['colour', { r: 300 }], ['radius', 5]], { at: { x: 0, y: 0 }, w: 230, t: 'Circle' })
      .v('s', { r: 200 }, { t: 'Shape' });
    B.snap(0, "One Circle object at 200. It has BOTH fields: colour (inherited from Shape) and radius (Circle's own). The variable s has type Shape, but the object it points at is a Circle. A superclass variable may point to a subclass object.");
    B.val(400, '"Pink"', { at: { below: 300, gap: 70 } })
      .set(200, 'colour', { r: 400 })
      .snap(1, 'setColour is inherited from Shape, and it works on the colour field inside the Circle. New String at 400; cross out 300.');
    B.v('t', { r: 200 }, { t: 'Shape' }).snap(2, 'Shape t = s; copies the address only. Still one object.');
    return B.done('Inside a subclass object');
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
    B.snap(-1, "Lecture 4's Account class, as memory. Every object has its own instance variables, and a variable of a class type holds an address.");
    B.obj(200, [['accNumber', 21347], ['balance', '38763.87']], { at: { x: 0, y: 0 }, w: 290, t: 'FullAccount' }).v('first', { r: 200 });
    B.snap(0, "new FullAccount(21347, 38763.87) makes an object (200) and the constructor copies its two arguments into the object's own instance variables. first holds the address.");
    B.obj(400, [['accNumber', 61342], ['balance', '0.00']], { at: { right: 200, gap: 90 }, w: 290, t: 'FullAccount' }).v('second', { r: 400 });
    B.snap(1, 'A second object (400). The two accounts do not share balances: each object has its own copy of every instance variable.');
    B.set(400, 'balance', '500.00').snap(2, 'second.deposit(500.00): the method runs on the object second points to (400), so balance = 0.00 + 500.00. The old value is crossed out.');
    B.set(200, 'balance', '37763.87').snap(3, 'first.withdraw(1000.00): balance = 38763.87 - 1000.00 on the object at 200. The other account is not touched.');
    B.set(200, 'balance', '37263.87').set(400, 'balance', '1000.00');
    B.snap(4, 'first.transferFunds(second, 500.00): first has enough (37763.87 >= 500), so it withdraws 500.00 from itself and calls second.deposit(500.00). The parameter "to" holds the address 400 while the method runs, so both objects change.');
    B.v('third', { r: 200 }).snap(5, 'FullAccount third = first copies the address 200. There is still ONE account at 200 and two names for it.');
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
    B.arr(100, 2, { at: { x: 0, y: 0 }, cw: 90, t: 'Shape[]' }).v('shapes', { r: 100 });
    B.snap(0, 'new Shape[2] makes an array of two references, both null. No Circle or Rectangle exists yet.');
    B.obj(200, [['colour', '"Red"'], ['radius', 3]], { at: { below: 100, gap: 64 }, w: 230, t: 'Circle' }).set(100, 0, { r: 200 });
    B.snap(1, 'A Circle object (200) holds the Shape part (colour) and its own part (radius). The Shape cell holds the address: a Circle is a Shape.');
    B.obj(300, [['colour', '"Blue"'], ['height', 2], ['width', 5]], { at: { right: 200, gap: 70 }, w: 230, t: 'Rectangle' }).set(100, 1, { r: 300 });
    B.snap(2, 'A Rectangle object (300) goes in the second cell. Both cells have the static type Shape; the objects they point to have different classes.');
    B.v('a0', '28.27').snap(3, "shapes[0].getArea(): Java looks at the object the cell points to (a Circle) at run time and runs Circle's getArea: 3.14159... x 3 x 3 = 28.27.");
    B.v('a1', '10.0').snap(4, "shapes[1].getArea(): the object is a Rectangle, so Rectangle's getArea runs: 2 x 5 = 10.0. The same call, two different methods: this is polymorphism.");
    return B.done('Polymorphism: one call, the method of the object');
  },

  book() {
    const B = memoryBuilder().code(['Book[] shelf = new Book[2];', 'Book b = new Book("Java", 2003);', 'shelf[0] = b;', 'shelf[1] = new Book("Data", 2010);', 'shelf[0].setYear(2014);', 'b = null;']);
    B.arr(100, 2, { at: { x: 0, y: 0 }, cw: 96, t: 'Book[]' }).v('shelf', { r: 100 });
    B.val(300, '"Java"', { at: { right: 200, dy: 100, gap: 70 } })
      .obj(200, [['year', 2003], ['title', { r: 300 }]], { at: { below: 100, gap: 64 }, w: 200, t: 'Book' })
      .v('b', { r: 200 });
    B.set(100, 0, { r: 200 });
    B.val(500, '"Data"', { at: { right: 400, dy: 100, gap: 70 } })
      .obj(400, [['year', 2010], ['title', { r: 500 }]], { at: { right: 300, gap: 70, dy: -100 }, w: 200, t: 'Book' })
      .set(100, 1, { r: 400 });
    B.set(200, 'year', 2014).sv('b', 'null').snap(5, '');
    return B.done('Practice answer');
  },

  objalias() {
    const B = memoryBuilder().code(['Student a = new Student("Ann", 19);', 'Student b = a;', 'b.setAge(20);', 'Student c = new Student("Tom", 21);']);
    B.snap(-1, 'Two names for one object, and two objects that merely look alike. The only thing a variable of a class type holds is an address.');
    B.val(300, '"Ann"', { at: { right: 200, dy: 36, gap: 80 } })
      .obj(200, [['name', { r: 300 }], ['age', 19]], { at: { x: 0, y: 0 }, w: 230, t: 'Student' })
      .v('a', { r: 200 });
    B.snap(0, 'new Student("Ann", 19) builds one Student at 200; its name is the String at 300. a holds 200.');
    B.v('b', { r: 200 }).snap(1, 'Student b = a copies the address 200. There is no second Student: a and b are two boxes holding the same address, so two arrows reach the same object.');
    B.set(200, 'age', 20).snap(2, 'b.setAge(20) follows the address in b to the object at 200 and changes its age. Reading a.getAge() gives 20 as well, because a points at the very same object.');
    B.val(500, '"Tom"', { at: { right: 400, dy: 36, gap: 80 } })
      .obj(400, [['name', { r: 500 }], ['age', 21]], { at: { below: 200, gap: 60 }, w: 230, t: 'Student' })
      .v('c', { r: 400 });
    B.snap(3, 'new Student("Tom", 21) is a different object (400) with its own fields, and c holds its address. a == c is false: == compares the addresses 200 and 400, not the contents. a and b stay together; c is on its own.');
    return B.done('Alias, and a separate object');
  },

  objpass() {
    const B = memoryBuilder().code([
      'Student s = new Student("Ann", 19);',
      'birthday(s);',
      '// void birthday(Student p) {',
      '//     p.setAge(20);',
      '//     p = new Student("Zed", 5);',
      '// }',
    ]);
    B.snap(-1, 'A method receives a COPY of each argument. For a class type the copy is the address, so the method can change the object but cannot change what the caller\'s variable holds.');
    B.val(300, '"Ann"', { at: { right: 200, dy: 36, gap: 80 } })
      .obj(200, [['name', { r: 300 }], ['age', 19]], { at: { x: 0, y: 0 }, w: 230, t: 'Student' })
      .v('s', { r: 200 });
    B.snap(0, 'main builds a Student at 200 and s holds its address.');
    B.v('p', { r: 200 }).snap(1, 'birthday(s) is called: the parameter p is a new box holding a COPY of s, the address 200. Two arrows, one object.');
    B.set(200, 'age', 20).snap(3, 'p.setAge(20) follows p to the object at 200 and changes its age. This change is visible through s, because it is the same object.');
    B.val(500, '"Zed"', { at: { right: 400, dy: 36, gap: 80 } })
      .obj(400, [['name', { r: 500 }], ['age', 5]], { at: { below: 200, gap: 60 }, w: 230, t: 'Student' })
      .sv('p', { r: 400 });
    B.snap(4, 'p = new Student("Zed", 5) builds a new object (400) and p now holds 400 (cross out 200 and its arrow). Only p, the method\'s own box, changed: s still holds 200.');
    B.unv('p').snap(5, 'The method ends: p disappears. Nothing points at the Student at 400 (or at "Zed"), so both are garbage. s still points at Ann, whose age is now 20: the method changed the object but could not change s.');
    return B.done('Passing an object to a method');
  },

  strings() {
    const B = memoryBuilder().code(['String a = "Java";', 'String b = a;', 'a = a + "8";']);
    B.snap(-1, 'A String is an object, and a String can never be changed. "Changing" one always builds a new String.');
    B.val(300, '"Java"', { at: { x: 0, y: 0 } }).v('a', { r: 300 });
    B.snap(0, 'The literal "Java" is a String object at 300. a holds the address.');
    B.v('b', { r: 300 }).snap(1, 'String b = a copies the address: a and b both point at the String at 300.');
    B.val(400, '"Java8"', { at: { below: 300, gap: 60 } }).sv('a', { r: 400 });
    B.snap(2, 'a + "8" cannot edit "Java", so it builds a NEW String "Java8" at 400 and a is changed to hold 400 (cross out 300 and its arrow). b still holds 300 and still reads "Java": changing a never changed b.');
    return B.done('Strings are never edited');
  },
};
