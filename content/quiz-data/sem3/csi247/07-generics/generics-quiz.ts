export const quizData = [
  {
    "group": "Why generics",
    "question": "Which of these is an advantage of generics?",
    "options": [
      "Errors are caught at compile time rather than at run time",
      "Programs always run faster",
      "Primitive types can be used as type arguments",
      "No classes are needed"
    ],
    "correctIndex": 0,
    "explanation": "The advantages are code reuse, type safety, no need for type casting, and compile-time error detection.",
    "optionFeedback": [
      "Correct.",
      "Generics are about type safety and reuse, not speed.",
      "Type arguments must be reference types.",
      "Generics still use classes."
    ]
  },
  {
    "group": "Why generics",
    "question": "A class stores its value as an Object. A String is stored where an Integer was expected, and the value is cast to Integer. When is the mistake found?",
    "options": [
      "At run time, as a ClassCastException",
      "At compile time",
      "Never",
      "When the class is loaded"
    ],
    "correctIndex": 0,
    "explanation": "The program compiles because every value is an Object. The wrong cast fails when it runs. A type parameter turns this into a compile-time error.",
    "optionFeedback": [
      "Correct.",
      "The compiler accepts any Object, so it cannot see the mistake.",
      "The cast fails when it is executed.",
      "Loading does not check casts."
    ]
  },
  {
    "group": "Generic classes",
    "question": "How many times does T occur in class GenTest<T> { private T obj; void modify(T obj) {...} T get() {...} }?",
    "options": [
      "4",
      "2",
      "3",
      "5"
    ],
    "correctIndex": 0,
    "explanation": "In the class header, as the type of obj, as the type of the parameter of modify, and as the return type of get.",
    "optionFeedback": [
      "Correct.",
      "That misses two of the occurrences.",
      "That misses one of the occurrences.",
      "There are four, not five."
    ]
  },
  {
    "group": "Generic classes",
    "question": "GenTest<Integer> a = new GenTest<Integer>(); Which line does not compile?",
    "code": "GenTest<Integer> a = new GenTest<Integer>();",
    "options": [
      "a.modify(\"CSI247\");",
      "a.modify(17);",
      "int x = a.get();",
      "System.out.println(a.get());"
    ],
    "correctIndex": 0,
    "explanation": "a stores only Integer values: error: incompatible types: String cannot be converted to Integer.",
    "optionFeedback": [
      "Correct. This is type safety, found at compile time.",
      "17 is boxed to an Integer.",
      "get() returns an Integer, which unboxes to int.",
      "Printing an Integer is fine."
    ]
  },
  {
    "group": "Generic classes",
    "question": "What does javac report for GenTest<int> a = new GenTest<int>(); ?",
    "options": [
      "error: unexpected type (required: reference, found: int)",
      "error: cannot find symbol",
      "error: missing return statement",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "Only reference types are allowed in the angle brackets. Use the wrapper class Integer.",
    "optionFeedback": [
      "Correct.",
      "The class exists; the type argument is the problem.",
      "There is no method here.",
      "A primitive is not allowed as a type argument."
    ]
  },
  {
    "group": "Generic classes",
    "question": "What does javac report for GenTest<Integer> a = new GenTest<String>(); ?",
    "options": [
      "error: incompatible types: GenTest<String> cannot be converted to GenTest<Integer>",
      "error: unexpected type",
      "error: generic array creation",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "The types on the left and the right of = must be identical.",
    "optionFeedback": [
      "Correct.",
      "Both type arguments are reference types.",
      "No array is created.",
      "GenTest<String> and GenTest<Integer> are different types."
    ]
  },
  {
    "group": "Generic classes",
    "question": "What does javac report for new GenTest<Integer>; (the parentheses are omitted)?",
    "options": [
      "error: '(' or '[' expected",
      "error: unexpected type",
      "error: cannot find symbol",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "Do not omit the () at the end of the creation.",
    "optionFeedback": [
      "Correct.",
      "The type argument is fine.",
      "The class exists.",
      "The statement is not complete without ()."
    ]
  },
  {
    "group": "Generic classes",
    "question": "What does javac report for T[] arr = new T[20]; inside a generic class?",
    "options": [
      "error: generic array creation",
      "error: unexpected type",
      "error: incompatible types",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "T cannot be used to allocate memory. The workaround is (T[]) new Object[20].",
    "optionFeedback": [
      "Correct.",
      "T is a type parameter, not a primitive.",
      "The error is about creating the array.",
      "The lecture lists this as not allowed."
    ]
  },
  {
    "group": "Generic classes",
    "question": "In which order are the letters usually used: which letter conventionally stands for a Key and which for a Value?",
    "options": [
      "K and V",
      "T and U",
      "E and N",
      "V and K"
    ],
    "correctIndex": 0,
    "explanation": "The conventions are T for Type, E for Element, K for Key, N for Number and V for Value.",
    "optionFeedback": [
      "Correct.",
      "T is a general type and U a second parameter.",
      "E is an element and N a number.",
      "K is the key and V the value, in that order."
    ]
  },
  {
    "group": "Bounded types",
    "question": "For class Nums<T extends Number>, which one is not valid?",
    "options": [
      "Nums<String>",
      "Nums<Integer>",
      "Nums<Double>",
      "Nums<Float>"
    ],
    "correctIndex": 0,
    "explanation": "String is not a subclass of Number: error: type argument String is not within bounds of type-variable T.",
    "optionFeedback": [
      "Correct.",
      "Integer extends Number.",
      "Double extends Number.",
      "Float extends Number."
    ]
  },
  {
    "group": "Bounded types",
    "question": "Why can a class with T extends Number call value.doubleValue() on a T?",
    "options": [
      "The bound tells the compiler that every T is a Number",
      "Every Object has doubleValue()",
      "T is always a Double",
      "Generics add the method automatically"
    ],
    "correctIndex": 0,
    "explanation": "Without the bound T is only known to be an Object, which has no doubleValue().",
    "optionFeedback": [
      "Correct.",
      "Object does not have doubleValue().",
      "T can be Integer, Float and so on.",
      "Generics do not add methods."
    ]
  },
  {
    "group": "Generic methods",
    "question": "Where does the type parameter of a generic method go?",
    "options": [
      "In angle brackets before the return type",
      "After the method name",
      "After the parameter list",
      "In the class header only"
    ],
    "correctIndex": 0,
    "explanation": "For example public static <E> void printArray(E[] elements). Its scope is that method.",
    "optionFeedback": [
      "Correct.",
      "Angle brackets after the name would look like a generic class.",
      "The parameter list uses the type, it does not declare it.",
      "A method may declare its own parameter in addition to the class's."
    ]
  },
  {
    "group": "Generic methods",
    "question": "What does printArray print for Integer[] numbers = {2, 4, 5, 7, 8} when it uses printf(\"%s \", element) in a loop and then println()?",
    "code": "public static <E> void printArray(E[] elements) {\n    for (E element : elements) {\n        System.out.printf(\"%s \", element);\n    }\n    System.out.println();\n}",
    "options": [
      "2 4 5 7 8",
      "[2, 4, 5, 7, 8]",
      "24578",
      "8 7 5 4 2"
    ],
    "correctIndex": 0,
    "explanation": "Each element is printed followed by a space, in array order.",
    "optionFeedback": [
      "Correct (with a space after each element).",
      "That is the output of Arrays.toString, not of this loop.",
      "There is a space after each element.",
      "The loop runs from the first element to the last."
    ]
  },
  {
    "group": "Generic methods",
    "question": "Why does printArray(new int[] {1, 2}) not compile for printArray(E[] elements)?",
    "options": [
      "E must be a reference type, so int[] is not an E[]",
      "printArray is not static",
      "The array is too small",
      "int[] has no length"
    ],
    "correctIndex": 0,
    "explanation": "javac reports that the method cannot be applied to given types (required E[], found int[]). Use an Integer[].",
    "optionFeedback": [
      "Correct.",
      "The method is static.",
      "The size does not matter.",
      "int[] has a length."
    ]
  },
  {
    "group": "Generic interfaces",
    "question": "class G implements GenI<T> { ... } does not declare T on the class. What does javac report?",
    "options": [
      "error: cannot find symbol (symbol: class T)",
      "error: unexpected type",
      "error: incompatible types",
      "It compiles"
    ],
    "correctIndex": 0,
    "explanation": "The class must be generic (class G<T> implements GenI<T>) so that T exists.",
    "optionFeedback": [
      "Correct.",
      "The problem is that T is not declared.",
      "There is no assignment.",
      "T is not a known type here."
    ]
  },
  {
    "group": "Generic interfaces",
    "question": "Why is BigAndSmall declared as BigAndSmall<T extends Comparable<T>>?",
    "options": [
      "So that values of type T can be compared with compareTo",
      "So that T can be a primitive",
      "So that the interface can have fields",
      "So that T[] can be created"
    ],
    "correctIndex": 0,
    "explanation": "The bound promises that every T implements Comparable, so small() and big() can compare values.",
    "optionFeedback": [
      "Correct.",
      "A primitive is not a Comparable and cannot be a type argument.",
      "The bound is not about fields.",
      "Arrays of T still cannot be created with new T[]."
    ]
  },
  {
    "group": "Generic interfaces",
    "question": "A Range of Integer {42, 7, 19, 63} implements BigAndSmall. What do small() and big() return?",
    "options": [
      "7 and 63",
      "42 and 63",
      "7 and 42",
      "19 and 63"
    ],
    "correctIndex": 0,
    "explanation": "small() returns the least value, 7, and big() the greatest, 63.",
    "optionFeedback": [
      "Correct.",
      "42 is the first element, not the smallest.",
      "42 is not the largest.",
      "19 is not the smallest."
    ]
  },
  {
    "group": "Lab 7",
    "question": "In a new Set<Integer> of 10 cells: add(7), add(12), add(7), remove(7), add(5). What are cells 0, 1 and 2?",
    "options": [
      "5, 12, 7",
      "7, 12, 5",
      "12, 7, 5",
      "5, 12, null"
    ],
    "correctIndex": 0,
    "explanation": "remove(7) empties the first 7 (cell 0); the next add takes the first empty cell, which is cell 0 again. The second 7 is still in cell 2.",
    "optionFeedback": [
      "Correct.",
      "The 5 goes into the first empty cell, which is cell 0.",
      "Cell 0 is reused for the 5.",
      "The second 7 is still in cell 2."
    ]
  },
  {
    "group": "Lab 7",
    "question": "Why does the Set constructor use (T[]) new Object[10] instead of new T[10]?",
    "options": [
      "new T[10] gives \"generic array creation\": T cannot be used to allocate memory",
      "Object arrays are faster",
      "T[] cannot hold null",
      "A Set must hold Objects only"
    ],
    "correctIndex": 0,
    "explanation": "The cast is unchecked, which is why the constructor carries @SuppressWarnings(\"unchecked\").",
    "optionFeedback": [
      "Correct.",
      "Speed is not the reason.",
      "T[] can hold null; the Set uses null for empty cells.",
      "The Set holds elements of type T."
    ]
  },
  {
    "group": "Lab 7",
    "question": "Set<String> names holds a new String(\"Kago\") and key is another new String(\"Kago\"). What does names.search(key) return?",
    "options": [
      "The stored \"Kago\", which equals the key but is not the same object",
      "null, because the objects are different",
      "The key itself",
      "It throws an exception"
    ],
    "correctIndex": 0,
    "explanation": "search uses equals, which compares the contents. The stored object is returned, and it is not the same object as the key.",
    "optionFeedback": [
      "Correct.",
      "null would be the result of using ==.",
      "The stored element is returned, not the argument.",
      "No exception is involved."
    ]
  },
  {
    "group": "Lab 7",
    "question": "Pair<Integer, Integer> (7, 2) divide (2, 4) with the operations done on doubleValue(). What is the result?",
    "options": [
      "(3.5, 0.5)",
      "(3, 0)",
      "(3.5, 0)",
      "(3, 0.5)"
    ],
    "correctIndex": 0,
    "explanation": "Both members are converted to double, so 7 / 2 is 3.5 and 2 / 4 is 0.5. The result is a Pair<Double, Double>.",
    "optionFeedback": [
      "Correct.",
      "That would be integer division.",
      "The second member is 0.5 as a double.",
      "The first member is 3.5 as a double."
    ]
  },
  {
    "group": "Lab 7",
    "question": "Pair<Integer, Integer> (7, 2) divide (0, 0), done on doubles. What happens?",
    "options": [
      "The result is (Infinity, Infinity); no exception is thrown",
      "ArithmeticException",
      "The result is (0.0, 0.0)",
      "It does not compile"
    ],
    "correctIndex": 0,
    "explanation": "Division of doubles by zero does not throw an exception. Integer division by zero would.",
    "optionFeedback": [
      "Correct.",
      "ArithmeticException belongs to integer division.",
      "Dividing a non-zero number by zero gives Infinity.",
      "It compiles; the bound allows doubleValue()."
    ]
  },
  {
    "group": "Lab 7",
    "question": "Pair<Float, Float> (1.1f, 2.2f) added to itself, done on doubleValue(). Why does the result show 2.200000047683716?",
    "options": [
      "The float values are widened to double and show the extra digits of the float representation",
      "The addition is wrong",
      "Float cannot be added",
      "Pair rounds up"
    ],
    "correctIndex": 0,
    "explanation": "A float cannot represent 1.1 exactly. Converting to double exposes the stored value.",
    "optionFeedback": [
      "Correct.",
      "The addition is exact on the stored values.",
      "Floats are converted with doubleValue().",
      "Nothing is rounded up."
    ]
  }
];
