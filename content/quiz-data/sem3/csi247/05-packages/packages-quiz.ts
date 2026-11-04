export const quizData = [
  {
    "group": "Packages and imports",
    "question": "Which of these is an advantage of packages?",
    "options": [
      "They prevent name conflicts and promote more maintainable code",
      "They make programs run faster",
      "They remove the need to compile",
      "They let a class have several superclasses"
    ],
    "correctIndex": 0,
    "explanation": "The lecture gives two advantages: better, maintainable code and no name conflicts.",
    "optionFeedback": [
      "Correct.",
      "Packages do not affect speed.",
      "Classes are still compiled.",
      "That is about interfaces."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "Which package is imported by default?",
    "options": [
      "java.lang",
      "java.util",
      "java.io",
      "none"
    ],
    "correctIndex": 0,
    "explanation": "String, Math and Integer are in java.lang and need no import.",
    "optionFeedback": [
      "Correct.",
      "java.util needs an import.",
      "java.io needs an import.",
      "java.lang is imported automatically."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "Which package is Scanner in?",
    "options": [
      "java.util",
      "java.lang",
      "java.io",
      "java.text"
    ],
    "correctIndex": 0,
    "explanation": "Scanner is in java.util; PrintWriter is in java.io.",
    "optionFeedback": [
      "Correct.",
      "java.lang holds String and Math.",
      "java.io holds the file classes.",
      "It is not in java.text."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "What does javac report for new Scanner(...) with no import statement?",
    "options": [
      "error: cannot find symbol (symbol: class Scanner)",
      "error: package does not exist",
      "error: reference is ambiguous",
      "Nothing: Scanner is in java.lang"
    ],
    "correctIndex": 0,
    "explanation": "The class is not imported and its short name is unknown.",
    "optionFeedback": [
      "Correct.",
      "The package is not named anywhere in the code.",
      "Ambiguity needs two matches.",
      "Scanner is in java.util."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "Does import java.util.*; make Pattern from java.util.regex usable by its short name?",
    "options": [
      "No: sub-packages need their own import",
      "Yes: the asterisk includes sub-packages",
      "Yes, but only for classes",
      "It depends on the JDK version"
    ],
    "correctIndex": 0,
    "explanation": "import java.util.* imports the classes of java.util only.",
    "optionFeedback": [
      "Correct.",
      "The asterisk covers one package.",
      "Sub-packages are not covered.",
      "It does not depend on the version."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "Which statement works without any import?",
    "options": [
      "java.util.Scanner scan = new java.util.Scanner(System.in);",
      "Scanner scan = new Scanner(System.in);",
      "util.Scanner scan = new util.Scanner(System.in);",
      "java.Scanner scan = new java.Scanner(System.in);"
    ],
    "correctIndex": 0,
    "explanation": "The full name of a class is its package, a dot and its class name.",
    "optionFeedback": [
      "Correct.",
      "The short name needs an import.",
      "util is not the full package name.",
      "Scanner is not directly in java."
    ]
  },
  {
    "group": "Packages and imports",
    "question": "import java.sql.*; and import java.util.*; are both present and the code uses Date. What does javac report?",
    "options": [
      "error: reference to Date is ambiguous",
      "error: cannot find symbol",
      "error: duplicate class",
      "Nothing: java.util wins"
    ],
    "correctIndex": 0,
    "explanation": "Both packages have a class Date. Import one class, or write the full name.",
    "optionFeedback": [
      "Correct.",
      "The symbol is found twice.",
      "No class is declared twice.",
      "Neither package is preferred."
    ]
  },
  {
    "group": "Creating a package",
    "question": "Where do the source files of a package named pkg go in the lecture's layout?",
    "options": [
      "src/pkg",
      "classes/pkg",
      "src only, with no sub-folder",
      "pkg/src"
    ],
    "correctIndex": 0,
    "explanation": "The source folder mirrors the package name; the compiled classes go in classes/pkg.",
    "optionFeedback": [
      "Correct.",
      "classes/pkg is where the compiled class files go.",
      "The folder is named like the package.",
      "src is the top folder."
    ]
  },
  {
    "group": "Creating a package",
    "question": "Which package name follows the recommendation?",
    "options": [
      "bankAccounts",
      "BankAccounts",
      "bank_accounts",
      "BANKACCOUNTS"
    ],
    "correctIndex": 0,
    "explanation": "Start with a lowercase letter and use a capital at the beginning of each new word.",
    "optionFeedback": [
      "Correct.",
      "It starts with a capital letter.",
      "It joins the words with an underscore.",
      "It is all capitals."
    ]
  },
  {
    "group": "Creating a package",
    "question": "What is the first statement of a source file that belongs to the package pkg?",
    "options": [
      "package pkg;",
      "import pkg;",
      "class pkg;",
      "use pkg;"
    ],
    "correctIndex": 0,
    "explanation": "The package statement goes at the top of every source file to include in the package.",
    "optionFeedback": [
      "Correct.",
      "import is for using a package.",
      "class declares a class.",
      "There is no use statement."
    ]
  },
  {
    "group": "Creating a package",
    "question": "What does javac -d classes -sourcepath src src/pkg/A.java do?",
    "options": [
      "Compiles A and puts classes/pkg/A.class in place, creating the folder pkg",
      "Runs the class A",
      "Copies A.java into classes",
      "Compiles every file in src"
    ],
    "correctIndex": 0,
    "explanation": "-d gives the output folder and -sourcepath tells the compiler where to find other source files.",
    "optionFeedback": [
      "Correct.",
      "javac only compiles.",
      "It writes class files, not sources.",
      "Only A and what it needs are compiled."
    ]
  },
  {
    "group": "Creating a package",
    "question": "From which folder are the compile and run commands typed?",
    "options": [
      "The parent folder of src and classes",
      "Inside src",
      "Inside classes",
      "Inside the package folder"
    ],
    "correctIndex": 0,
    "explanation": "The commands use paths relative to that folder: src/pkg/A.java and -classpath classes.",
    "optionFeedback": [
      "Correct.",
      "src/pkg/A.java would not be found.",
      "-classpath classes would not be found.",
      "The relative paths start higher."
    ]
  },
  {
    "group": "Creating a package",
    "question": "Which command runs a tester pkgTester in the default package whose class file is in classes?",
    "options": [
      "java -classpath classes pkgTester",
      "java pkgTester",
      "java -classpath classes pkg.pkgTester",
      "javac -classpath classes pkgTester"
    ],
    "correctIndex": 0,
    "explanation": "Without -classpath the launcher searches only the current folder. pkg.pkgTester names a package the tester is not in.",
    "optionFeedback": [
      "Correct.",
      "It reports Could not find or load main class pkgTester.",
      "It reports Could not find or load main class pkg.pkgTester.",
      "javac compiles; it does not run."
    ]
  },
  {
    "group": "Creating a package",
    "question": "A tester is declared package app; as app.Main. Which command runs it?",
    "options": [
      "java -classpath classes app.Main",
      "java -classpath classes Main",
      "java app.Main",
      "javac -classpath classes app.Main"
    ],
    "correctIndex": 0,
    "explanation": "The package name and the class name, separated by a dot.",
    "optionFeedback": [
      "Correct.",
      "The class is in the package app.",
      "The class path is missing.",
      "javac does not run programs."
    ]
  },
  {
    "group": "Errors and access",
    "question": "A tester imports pkg.A, but is compiled with javac -d out src/pkgTester.java and no class path. What does javac report?",
    "options": [
      "error: package pkg does not exist",
      "Nothing: it compiles",
      "error: reference is ambiguous",
      "error: Could not find or load main class"
    ],
    "correctIndex": 0,
    "explanation": "The compiler looks only in the current folder, where there is no pkg.",
    "optionFeedback": [
      "Correct.",
      "The package cannot be found.",
      "There is no ambiguity.",
      "That message comes from java, not javac."
    ]
  },
  {
    "group": "Errors and access",
    "question": "What does java pkgTester report when pkgTester.class is in classes and the command is typed in the parent folder?",
    "options": [
      "Error: Could not find or load main class pkgTester",
      "Nothing: it runs",
      "error: package pkg does not exist",
      "error: cannot find symbol"
    ],
    "correctIndex": 0,
    "explanation": "The launcher searches the current folder; give -classpath classes.",
    "optionFeedback": [
      "Correct.",
      "The class is not in the current folder.",
      "That is a compiler message.",
      "That is a compiler message."
    ]
  },
  {
    "group": "Errors and access",
    "question": "Account.java, with package bankAccounts;, is saved in src instead of src/bankAccounts, and the tester is compiled with -sourcepath src. What is the first message?",
    "options": [
      "package bankAccounts does not exist",
      "Nothing: the compiler reads the package statement",
      "error: reference is ambiguous",
      "error: missing return statement"
    ],
    "correctIndex": 0,
    "explanation": "The compiler looks for bankAccounts/Account.java under src and does not find it.",
    "optionFeedback": [
      "Correct.",
      "The folder must mirror the package name.",
      "There is only one class.",
      "No method is involved."
    ]
  },
  {
    "group": "Errors and access",
    "question": "A class Item with no public modifier is in the package shop and a tester in the default package imports it. What does javac report?",
    "options": [
      "Item is not public in shop; cannot be accessed from outside package",
      "Nothing: it compiles",
      "reference to Item is ambiguous",
      "package shop does not exist"
    ],
    "correctIndex": 0,
    "explanation": "Without a modifier a class is visible only within its package.",
    "optionFeedback": [
      "Correct.",
      "It is not visible outside shop.",
      "There is only one Item.",
      "The package exists."
    ]
  },
  {
    "group": "Errors and access",
    "question": "Where can a protected method of a class in the package base be used?",
    "options": [
      "In the package, and in sub classes in any package",
      "Only inside the class",
      "Everywhere",
      "Only in the package"
    ],
    "correctIndex": 0,
    "explanation": "protected: the class, its package and all sub classes.",
    "optionFeedback": [
      "Correct.",
      "That is private.",
      "That is public.",
      "Sub classes elsewhere can also use it."
    ]
  },
  {
    "group": "Errors and access",
    "question": "Classes shop.Item and store.Item exist. How can one program use both?",
    "options": [
      "Write the full names shop.Item and store.Item",
      "Import shop.* and store.* and write Item",
      "It cannot",
      "Rename both packages"
    ],
    "correctIndex": 0,
    "explanation": "The full name includes the package, so the two classes are different.",
    "optionFeedback": [
      "Correct.",
      "The short name Item is then ambiguous.",
      "The full names tell them apart.",
      "No renaming is needed."
    ]
  },
  {
    "group": "Errors and access",
    "question": "Two packages have a class with the same name. Which advantage of packages does this show?",
    "options": [
      "They prevent name conflicts",
      "They make code run faster",
      "They make classes private",
      "They remove import statements"
    ],
    "correctIndex": 0,
    "explanation": "The full name includes the package, so the classes are told apart.",
    "optionFeedback": [
      "Correct.",
      "Speed is not involved.",
      "Packages do not make classes private.",
      "Imports are still used."
    ]
  }
];
