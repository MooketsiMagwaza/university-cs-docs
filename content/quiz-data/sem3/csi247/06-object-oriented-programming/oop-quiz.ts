export const quizData = [
  {
    "group": "Classes",
    "question": "What do the constructor of a class and its name have in common?",
    "options": [
      "The constructor has the same name as the class and no return type",
      "The constructor has a return type of void",
      "The constructor must be private",
      "The constructor has the name init"
    ],
    "correctIndex": 0,
    "explanation": "A constructor initialises the instance variables when new is used; it has no return type, not even void.",
    "optionFeedback": [
      "Correct.",
      "A constructor has no return type at all.",
      "Constructors are normally public.",
      "There is no init keyword in Java classes."
    ]
  },
  {
    "group": "Classes",
    "question": "A class has only the constructor Account(int, double). What does new Account() give?",
    "options": [
      "error: constructor Account in class Account cannot be applied to given types",
      "An account with number 0 and balance 0.0",
      "A runtime exception",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "Java adds the default constructor only when the class has no constructor at all.",
    "optionFeedback": [
      "Correct.",
      "That happens only when no constructor is written.",
      "It fails at compile time.",
      "There is no return statement involved."
    ]
  },
  {
    "group": "Classes",
    "question": "A constructor Dog(int age) contains the statement age = age; and the instance variable is also called age. What is the instance variable afterwards?",
    "options": [
      "0, its default value: the statement copies the parameter onto itself",
      "The argument passed to the constructor",
      "null",
      "The program does not compile"
    ],
    "correctIndex": 0,
    "explanation": "Write this.age = age to assign the instance variable.",
    "optionFeedback": [
      "Correct.",
      "That would need this.age = age.",
      "An int is never null.",
      "It compiles; the effect is wrong."
    ]
  },
  {
    "group": "Classes",
    "question": "AccountTester creates two Account objects with the default constructor and prints the first. What is printed (the lecture's toString has no space before Balance)?",
    "options": [
      "Acc No = 0Balance = 0.0",
      "Acc No = 0 Balance = 0",
      "Acc No = nullBalance = null",
      "Account@1a2b3c"
    ],
    "correctIndex": 0,
    "explanation": "The default constructor this(0, 0.0) sets the number to 0 and the balance to 0.0, and toString concatenates the pieces as written.",
    "optionFeedback": [
      "Correct.",
      "The balance is a double, so it prints 0.0, and there is no space in the string.",
      "int and double fields are never null.",
      "The class overrides toString, so the default form is not used."
    ]
  },
  {
    "group": "Classes",
    "question": "Which of these is part of a method signature?",
    "options": [
      "The method name and the parameter types",
      "The return type",
      "The access specifier",
      "The names of the parameters"
    ],
    "correctIndex": 0,
    "explanation": "xyz(int,double) is the signature of String xyz(int x, double y).",
    "optionFeedback": [
      "Correct.",
      "The return type is not part of the signature.",
      "Access does not distinguish overloaded methods.",
      "Only the types matter, not the names."
    ]
  },
  {
    "group": "Classes",
    "question": "A class has public void ABC(int y, double c). Which method can also be in the same class?",
    "options": [
      "public int ABC(double x, int v)",
      "public int ABC(int x, double v)",
      "private void ABC(int a, double b)",
      "public String ABC(int y, double c)"
    ],
    "correctIndex": 0,
    "explanation": "The signatures ABC(int,double) and ABC(double,int) differ. The other three repeat ABC(int,double): method ABC(int,double) is already defined.",
    "optionFeedback": [
      "Correct.",
      "Same signature, different return type: already defined.",
      "Same signature, different access: already defined.",
      "Same signature: already defined."
    ]
  },
  {
    "group": "Classes",
    "question": "In a UML class diagram, what does a minus sign in front of a member mean?",
    "options": [
      "The member is private",
      "The member is public",
      "The member is static",
      "The member is removed"
    ],
    "correctIndex": 0,
    "explanation": "- means private and + means public.",
    "optionFeedback": [
      "Correct.",
      "+ means public.",
      "UML does not use - for static.",
      "Nothing is removed."
    ]
  },
  {
    "group": "Classes",
    "question": "FullAccount.transferFunds(to, amount) is called when the first account has less than amount. What happens?",
    "options": [
      "Nothing: neither account changes",
      "The first balance becomes negative",
      "An exception is thrown",
      "The second account is credited anyway"
    ],
    "correctIndex": 0,
    "explanation": "The if (balance >= amount) test fails, so withdraw and deposit are not called.",
    "optionFeedback": [
      "Correct.",
      "The withdrawal is inside the if.",
      "No exception is written in the method.",
      "The deposit is inside the same if."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Which statement about a Shape variable is valid when Rectangle extends Shape?",
    "options": [
      "Shape s3 = new Rectangle();",
      "Rectangle s4 = new Shape();",
      "Both are valid",
      "Neither is valid"
    ],
    "correctIndex": 0,
    "explanation": "A Rectangle is a Shape; a Shape is not necessarily a Rectangle (error: incompatible types: Shape cannot be converted to Rectangle).",
    "optionFeedback": [
      "Correct.",
      "That one is rejected by the compiler.",
      "Only the first is valid.",
      "The first is valid."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Circle.toString returns colour + \" circle\", and colour is private in Shape. What does javac report?",
    "options": [
      "error: colour has private access in Shape",
      "error: cannot find symbol",
      "Nothing: it compiles",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "Private members are not inherited: use the public getter getColour().",
    "optionFeedback": [
      "Correct.",
      "The variable exists; it is not accessible.",
      "Access is checked by the compiler.",
      "The method returns a value."
    ]
  },
  {
    "group": "Inheritance",
    "question": "A sub class constructor does not call super(...) and the super class has only the constructor Base(String). What does javac report?",
    "options": [
      "error: constructor Base in class Base cannot be applied to given types",
      "Nothing: it compiles",
      "error: cannot find symbol",
      "A ClassCastException at run time"
    ],
    "correctIndex": 0,
    "explanation": "The compiler inserts super() as the first statement, and Base has no no-argument constructor.",
    "optionFeedback": [
      "Correct.",
      "The implicit super() cannot be matched.",
      "The constructor exists with other parameters.",
      "It is a compile-time error."
    ]
  },
  {
    "group": "Inheritance",
    "question": "What does System.out.println(sh) print for a class that does not override toString?",
    "options": [
      "The class name, an @ sign and the hash code, such as PlainShape@2f92e0f4",
      "The values of the instance variables",
      "null",
      "The name of the variable"
    ],
    "correctIndex": 0,
    "explanation": "The inherited Object.toString is used.",
    "optionFeedback": [
      "Correct.",
      "Only a toString written by you prints the fields.",
      "The reference is not null.",
      "The variable name is not known at run time."
    ]
  },
  {
    "group": "Inheritance",
    "question": "What is Float.valueOf(22).equals(Integer.valueOf(22))?",
    "options": [
      "false: the objects are of different classes",
      "true: the values are equal",
      "A compile error",
      "A ClassCastException"
    ],
    "correctIndex": 0,
    "explanation": "Float.equals returns false for an object that is not a Float.",
    "optionFeedback": [
      "Correct.",
      "The class is checked too.",
      "It compiles.",
      "No exception is thrown."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Integer big1 = 1000; Integer big2 = Integer.valueOf(1000); What are big1.equals(big2) and big1 == big2?",
    "options": [
      "true and false",
      "true and true",
      "false and false",
      "false and true"
    ],
    "correctIndex": 0,
    "explanation": "equals compares the values; == compares addresses, and two separate Integer objects of that size have different addresses.",
    "optionFeedback": [
      "Correct.",
      "== compares addresses.",
      "equals compares values.",
      "equals is true."
    ]
  },
  {
    "group": "Inheritance",
    "question": "A sub class writes String toString() { ... } with no public. What does javac report?",
    "options": [
      "error: toString() in Circle cannot override toString() in Object (attempting to assign weaker access privileges; was public)",
      "Nothing, it compiles",
      "error: cannot find symbol",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "An overriding method may not have weaker access than the method it overrides.",
    "optionFeedback": [
      "Correct.",
      "Access is checked.",
      "toString exists in Object.",
      "The method does return a value."
    ]
  },
  {
    "group": "Inheritance",
    "question": "What does javac report for @Override on a method that has no matching method in the super class?",
    "options": [
      "error: method does not override or implement a method from a supertype",
      "Nothing: @Override is only a comment",
      "error: cannot find symbol",
      "A warning only"
    ],
    "correctIndex": 0,
    "explanation": "@Override tells the compiler to check that the method overrides one.",
    "optionFeedback": [
      "Correct.",
      "The compiler enforces it.",
      "The method is found; it does not override.",
      "It is an error."
    ]
  },
  {
    "group": "Inheritance",
    "question": "A toString contains the statement super.toString(); on its own and then returns its own text. What does the call contribute?",
    "options": [
      "Nothing: the returned String is discarded",
      "It is added to the output",
      "It prints the super class text",
      "It causes a compile error"
    ],
    "correctIndex": 0,
    "explanation": "Use the value: return super.toString() + \" with radius = \" + radius;",
    "optionFeedback": [
      "Correct.",
      "Only a returned value that is used contributes.",
      "toString does not print.",
      "It compiles."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Shape has equals(Shape). TrapCircle extends Shape and adds equals(Object). For TrapCircle red and TrapRectangle redRect, both red, red.equals(redRect) is...",
    "options": [
      "true: the compiler chooses equals(Shape), which compares colours only",
      "false: getClass() differs",
      "A compile error",
      "A ClassCastException"
    ],
    "correctIndex": 0,
    "explanation": "The compiler picks the most specific method for the argument type; equals(Object) is used only through an Object variable.",
    "optionFeedback": [
      "Correct.",
      "That is the intention, but equals(Shape) is chosen.",
      "It compiles.",
      "No cast is made."
    ]
  },
  {
    "group": "Inheritance",
    "question": "TagClass.equals uses getClass() != o.getClass() and TagInstance.equals uses !(o instanceof TagInstance). Which is true for a BigTag that extends the tag class, with the same colour?",
    "options": [
      "tagClass.equals(bigTagClass) is false and tagInstance.equals(bigTagInstance) is true",
      "both are true",
      "both are false",
      "tagClass.equals(bigTagClass) is true and tagInstance.equals(bigTagInstance) is false"
    ],
    "correctIndex": 0,
    "explanation": "getClass() makes objects of different classes unequal; instanceof accepts a sub class object.",
    "optionFeedback": [
      "Correct.",
      "getClass() rejects the sub class object.",
      "instanceof accepts the sub class object.",
      "It is the other way round."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Shape sh holds a Circle. What does (Rectangle) sh do?",
    "options": [
      "Throws ClassCastException at run time",
      "Returns null",
      "Converts the circle to a rectangle",
      "Does not compile"
    ],
    "correctIndex": 0,
    "explanation": "A downcast compiles when the classes are related and is checked at run time.",
    "optionFeedback": [
      "Correct.",
      "A failed cast never returns null.",
      "A cast does not change the object.",
      "Shape and Rectangle are related, so it compiles."
    ]
  },
  {
    "group": "Inheritance",
    "question": "Shape sh = new Circle(\"Red\", 3); Circle c = sh; What does javac report?",
    "options": [
      "error: incompatible types: Shape cannot be converted to Circle",
      "Nothing: it compiles",
      "A ClassCastException at run time",
      "error: cannot find symbol"
    ],
    "correctIndex": 0,
    "explanation": "A downcast needs an explicit cast: Circle c = (Circle) sh;",
    "optionFeedback": [
      "Correct.",
      "The cast is required.",
      "It is rejected at compile time.",
      "The classes and variables exist."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "Animal a = new Pup(); a.describe(); where describe() in Animal returns \"Animal says \" + sound() and Pup.sound() returns super.sound() + \"!\" with Hound.sound() returning \"Woof\". What is returned?",
    "options": [
      "Animal says Woof!",
      "Animal says ...",
      "Animal says Woof",
      "Animal says !"
    ],
    "correctIndex": 0,
    "explanation": "describe is inherited, and the call to sound() inside it runs the object's own class version.",
    "optionFeedback": [
      "Correct.",
      "That is the Animal version of sound.",
      "That is the Hound version without the Pup addition.",
      "Pup calls super.sound() first."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "Which is dynamic polymorphism and which is static?",
    "options": [
      "Overriding is dynamic; overloading is static",
      "Overloading is dynamic; overriding is static",
      "Both are dynamic",
      "Both are static"
    ],
    "correctIndex": 0,
    "explanation": "Overriding is resolved at run time by the object's class; overloading is resolved at compile time by the parameter types.",
    "optionFeedback": [
      "Correct.",
      "It is the other way round.",
      "Overloading is decided by the compiler.",
      "Overriding is decided at run time."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "What does javac report for Shape s = new Shape(); when Shape is abstract?",
    "options": [
      "error: Shape is abstract; cannot be instantiated",
      "error: cannot find symbol",
      "A ClassCastException",
      "Nothing: it compiles"
    ],
    "correctIndex": 0,
    "explanation": "An abstract class is designed to be extended.",
    "optionFeedback": [
      "Correct.",
      "The class exists.",
      "The error is at compile time.",
      "It cannot be instantiated."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "A concrete class Circle extends the abstract Shape and does not implement getArea(). What does javac report?",
    "options": [
      "error: Circle is not abstract and does not override abstract method getArea() in Shape",
      "Nothing: it compiles",
      "error: abstract methods cannot have a body",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "A concrete sub class must implement every abstract method.",
    "optionFeedback": [
      "Correct.",
      "It does not compile.",
      "That is for an abstract method with a body.",
      "The method is missing altogether."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "What is wrong with abstract void bark() { } in an abstract class?",
    "options": [
      "An abstract method cannot have a body",
      "abstract must follow the return type",
      "bark must be static",
      "Nothing is wrong"
    ],
    "correctIndex": 0,
    "explanation": "Write abstract void bark(); with a semicolon.",
    "optionFeedback": [
      "Correct.",
      "The modifier position is fine.",
      "static is not needed.",
      "The body is the error."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "A class implements an interface method as void methodA() { } with no access modifier. What does javac report?",
    "options": [
      "error: methodA() in Bob cannot implement methodA() in Test (attempting to assign weaker access privileges; was public)",
      "Nothing: it compiles",
      "error: cannot find symbol",
      "error: Test is abstract; cannot be instantiated"
    ],
    "correctIndex": 0,
    "explanation": "Interface methods are public, so the implementing method must be public.",
    "optionFeedback": [
      "Correct.",
      "Access is checked.",
      "The method exists in the interface.",
      "No Test object is created."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "Test t = new Bob(); t.methodA(); t.methodB(); t.methodC(); for the lecture's Test, Mist and Bob. What is printed?",
    "options": [
      "Testing, Hello, There on three lines",
      "Hello, There, Testing",
      "Testing three times",
      "Nothing: Bob is abstract"
    ],
    "correctIndex": 0,
    "explanation": "methodA is implemented in Mist and methodB and methodC in Bob.",
    "optionFeedback": [
      "Correct.",
      "The calls are made in the order A, B, C.",
      "Each method prints its own text.",
      "Bob is concrete."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "What does javac report for class Two extends A, B { }?",
    "options": [
      "error: '{' expected: a class extends only one class",
      "Nothing: it compiles",
      "error: cannot find symbol",
      "error: A is abstract"
    ],
    "correctIndex": 0,
    "explanation": "Use interfaces for multiple inheritance: class Two extends A implements B.",
    "optionFeedback": [
      "Correct.",
      "Java has single class inheritance.",
      "The classes exist.",
      "The error is about the extends list."
    ]
  },
  {
    "group": "Polymorphism and abstraction",
    "question": "A 2 by 6 rectangle and a 3 by 4 rectangle, with equals defined as \"equal areas\" in the abstract base class. What is a.equals(b)?",
    "options": [
      "true: both areas are 12.0",
      "false: the sides differ",
      "false: the colours differ",
      "A compile error"
    ],
    "correctIndex": 0,
    "explanation": "equals uses only getArea(), so the shapes with the same area are equal.",
    "optionFeedback": [
      "Correct.",
      "The rule compares areas, not sides.",
      "The colour is not part of the rule.",
      "It compiles."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "A GP has basic pay 28000 and an allowance rate of 10 (percent). What does calculatePay() return?",
    "options": [
      "30800.0",
      "28000.0",
      "2800.0",
      "280000.0"
    ],
    "correctIndex": 0,
    "explanation": "The pay is basic pay plus basic pay x rate / 100: 28000 + 2800.",
    "optionFeedback": [
      "Correct.",
      "That is the basic pay without the allowance.",
      "That is only the allowance.",
      "The rate is a percentage."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "A Surgeon has basic pay 40000, 6 procedures and a rate of 500 per procedure. What is the monthly pay under the lab's formula?",
    "options": [
      "43000.0",
      "40000.0",
      "3000.0",
      "46000.0"
    ],
    "correctIndex": 0,
    "explanation": "The formula is monthly pay + (number of procedures x procedure rate): 40000 + 3000.",
    "optionFeedback": [
      "Correct.",
      "That ignores the procedures.",
      "That is only the procedure pay.",
      "The procedures are 6, not 12."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "In data.txt a line has four items separated by semicolons (Dube;Neo;28000;10). Which kind of doctor is it?",
    "options": [
      "A GP: the fourth item is the rate",
      "A Surgeon",
      "A plain Doctor",
      "The line is invalid"
    ],
    "correctIndex": 0,
    "explanation": "Three items: a plain Doctor; four: a GP; five: a Surgeon.",
    "optionFeedback": [
      "Correct.",
      "A Surgeon has five items.",
      "A plain doctor has three.",
      "The rate is optional."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "The payroll file has five teachers totalling 53424.60 and three administrators totalling 18500.00. What is the wage bill?",
    "options": [
      "71924.60",
      "53424.60",
      "18500.00",
      "34924.60"
    ],
    "correctIndex": 0,
    "explanation": "The wage bill is the total of both categories.",
    "optionFeedback": [
      "Correct.",
      "That is the teachers only.",
      "That is the administrators only.",
      "The two totals are added."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "Under the Lab 6 equals rules, is a Teacher equal to an Admin with the same name, ID and salary?",
    "options": [
      "No: the instanceof Teacher test fails",
      "Yes: the ID and salary match",
      "Yes: they are both Employees",
      "It does not compile"
    ],
    "correctIndex": 0,
    "explanation": "Teacher.equals begins with an instanceof Teacher test.",
    "optionFeedback": [
      "Correct.",
      "The type test comes first.",
      "Employee is not what is tested.",
      "It compiles."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "For new B(), where B() calls super(5), A(int) calls this(), and A() prints \"A()\", A(int) prints \"A(int)\" after its call, B() prints \"B()\" after its call, what is printed?",
    "options": [
      "A(), A(int), B()",
      "B(), A(int), A()",
      "A(int), A(), B()",
      "B() only"
    ],
    "correctIndex": 0,
    "explanation": "The super class is initialised before the sub class body runs, and this() runs before the rest of the constructor.",
    "optionFeedback": [
      "Correct.",
      "The sub class body runs last.",
      "A(int) calls this() first.",
      "All three constructors run."
    ]
  },
  {
    "group": "Labs 5 and 6",
    "question": "P has show(Object) and show(String); C extends P and overrides only show(Object). For P p = new C(); Object o = \"x\"; what do p.show(\"x\") and p.show(o) print?",
    "options": [
      "P-String and C-Object",
      "C-Object and C-Object",
      "P-String and P-String",
      "C-Object and P-String"
    ],
    "correctIndex": 0,
    "explanation": "The compiler chooses the signature from the static type; only show(Object) is overridden.",
    "optionFeedback": [
      "Correct.",
      "show(String) is not overridden.",
      "show(Object) is overridden.",
      "The first call uses show(String)."
    ]
  }
];
