export const quizData = [
  {
    question: "Which statement best describes a Java package?",
    options: ["A named namespace for related types", "A file that stores every class in a program", "A command that installs libraries", "A special kind of object"],
    correctIndex: 0,
    explanation: "A package gives related types a shared namespace and supports organisation, name separation, and access boundaries.",
    optionFeedback: [
      "Correct: a package is part of a type's name and groups related types.",
      "A package may span many source files; it is not one file.",
      "Package declarations and imports do not install libraries.",
      "A package is a namespace, not an object or class."
    ],
  },
  {
    question: "Why can a program use `String` without `import java.lang.String;`?",
    options: ["String is a keyword", "The current directory always contains String.class", "java.lang is imported automatically", "All classes named String are global"],
    correctIndex: 2,
    explanation: "Java automatically makes the public types in java.lang available by simple name.",
    optionFeedback: [
      "String is a class, not a Java keyword.",
      "The lookup does not depend on a String.class file in the current directory.",
      "Correct: java.lang is the automatically available core package.",
      "Type names are not globally visible merely because of their simple name."
    ],
  },
  {
    question: "What does `import java.util.*;` include?",
    options: ["Every Java standard-library class", "Types directly in java.util, but not its subpackages", "Only Scanner", "All classes below any folder named util"],
    correctIndex: 1,
    explanation: "A wildcard import is limited to types declared directly in the named package.",
    optionFeedback: [
      "The wildcard is not global; it names one package.",
      "Correct: subpackages such as java.util.concurrent are separate packages.",
      "The wildcard includes other public types directly in java.util as well.",
      "Imports use package identity and classpaths, not an arbitrary recursive folder search."
    ],
  },
  {
    question: "Under the mirrored source-tree convention, where should `A.java` declaring `package pkg;` be placed below source root `src`?",
    options: ["src/A.java", "src/pkg/A.java", "src/pkg/A.class", "pkg/src/A.java"],
    correctIndex: 1,
    explanation: "The normal lookup path mirrors the declaration. The declaration itself, rather than a folder alone, defines package identity.",
    optionFeedback: [
      "This path omits the package directory expected for automatic source lookup.",
      "Correct: src is the root and pkg is the package directory.",
      "A .class file is compiler output, not the source file.",
      "The source root comes before the package path."
    ],
  },
  {
    question: "A method has no access modifier. Which unrelated class can call it?",
    options: ["Any class that imports it", "Only a class in the same package", "Any subclass anywhere", "No class, including its own class"],
    correctIndex: 1,
    explanation: "No modifier gives package-private access: members are available within the same package.",
    optionFeedback: [
      "An import affects names, not access control.",
      "Correct: package-private access ends at the package boundary.",
      "A subclass in another package does not receive package-private access.",
      "The declaring class itself can access its own member."
    ],
  },
  {
    question: "What does `javac -d classes` control?",
    options: ["The source package name", "The directory root for generated class files", "The runtime main class", "The Java language version"],
    correctIndex: 1,
    explanation: "The compiler writes generated package directories and .class files below the -d destination root.",
    optionFeedback: [
      "The package declaration, not -d, defines the package name.",
      "Correct: -d chooses the output root.",
      "The java launcher, not -d, chooses the class to run.",
      "Language release is controlled by options such as --release."
    ],
  },
  {
    question: "The compiled file is `classes/app/Tester.class` and declares `package app;`. Which command is correct?",
    options: ["java -cp classes app.Tester", "java -cp classes/app Tester.class", "java classes/app/Tester.class", "java -cp app classes.Tester"],
    correctIndex: 0,
    explanation: "The classpath is the root above app, and the launcher receives the fully qualified class name without .class.",
    optionFeedback: [
      "Correct: classes is the root and app.Tester is the binary name.",
      "Do not add .class or treat the package directory as the classpath root.",
      "The launcher does not take the class-file path in this form.",
      "This reverses the root and package name."
    ],
  },
  {
    question: "What is the first thing to check after `Could not find or load main class app.Tester`?",
    options: ["Whether every field is public", "Whether the array is sorted", "The classpath root and fully qualified class name", "Whether java.util.* was imported"],
    correctIndex: 2,
    explanation: "This is a runtime class lookup failure, so inspect the binary name and the root from which its package path is resolved.",
    optionFeedback: [
      "Member access is checked after the class can be loaded.",
      "Array order is unrelated to class loading.",
      "Correct: classify the failure as runtime lookup.",
      "Imports are compile-time source-name rules and cannot repair the runtime classpath."
    ],
  },
  {
    question: "Two imported classes both have the simple name `Date`. What is the clearest repair?",
    options: ["Import both with wildcards", "Rename Java's classes", "Use a fully qualified name for at least one", "Put the imports inside main"],
    correctIndex: 2,
    explanation: "A fully qualified reference identifies exactly which Date type is meant and removes the simple-name ambiguity.",
    optionFeedback: [
      "Wildcards make the ambiguity less explicit, not resolved.",
      "Library classes do not need to be renamed.",
      "Correct: qualify at least one conflicting type.",
      "Imports cannot appear inside a method."
    ],
  },
  {
    question: "Which statement correctly distinguishes an import from a classpath?",
    options: ["They are two spellings of the same setting", "An import shortens a source type name; a classpath gives roots for finding compiled classes", "A classpath controls access modifiers; an import controls folders", "Imports are runtime-only; classpaths are compile-time-only"],
    correctIndex: 1,
    explanation: "Imports participate in source name resolution. Classpaths locate compiled packages for the compiler or runtime.",
    optionFeedback: [
      "They solve different layers of the problem.",
      "Correct: source naming and compiled lookup are distinct.",
      "Access modifiers are language rules, and folders mirror package names.",
      "Classpaths matter at both compile and runtime, while imports are source-level."
    ],
  },
{
  "question": "Which pair of packages supplies FileReader and Scanner?",
  "options": [
    "java.io and java.util",
    "java.lang and java.io",
    "java.util and java.util.concurrent",
    "java.io and java.io"
  ],
  "correctIndex": 0,
  "explanation": "FileReader is java.io.FileReader; Scanner is java.util.Scanner.",
  "optionFeedback": [
    "Correct: imports must cover both packages.",
    "FileReader is not java.lang and Scanner is not java.io.",
    "FileReader is not in either of these packages.",
    "Scanner is not in java.io."
  ]
},
{
  "question": "What can be called after import static java.lang.Math.sqrt;?",
  "options": [
    "Scanner.nextLine()",
    "sqrt(81)",
    "Math()",
    "java.lang.sqrt(81)"
  ],
  "correctIndex": 1,
  "explanation": "A static import makes the member's short name available.",
  "optionFeedback": [
    "Scanner is unrelated and nextLine needs an instance.",
    "Correct: sqrt is the imported static method.",
    "Math is not constructed to call this static member.",
    "sqrt belongs to Math, not directly to the package."
  ]
},
{
  "question": "Two wildcard imports, java.util.* and java.sql.*, are present. When does the Date ambiguity matter?",
  "options": [
    "Whenever Date is used as an unresolved simple name",
    "Both imports are immediately illegal even without using Date",
    "Only on Linux",
    "Never; util automatically wins"
  ],
  "correctIndex": 0,
  "explanation": "On-demand imports can coexist; using the ambiguous simple type name requires disambiguation.",
  "optionFeedback": [
    "Correct: fully qualify the intended Date.",
    "That confuses wildcard imports with conflicting single-type imports.",
    "Platform does not decide type-name lookup.",
    "Import order does not choose an owner here."
  ]
},
{
  "question": "What detects EOF in the BufferedReader example?",
  "options": [
    "count equals zero",
    "readLine() returns null",
    "The title becomes empty",
    "A Book constructor returns -1"
  ],
  "correctIndex": 1,
  "explanation": "No remaining line is represented by null, not an empty record.",
  "optionFeedback": [
    "count begins at zero for all files.",
    "Correct: stop before parsing null.",
    "An empty line can occur before EOF.",
    "Constructors do not return this search sentinel."
  ]
},
{
  "question": "A.java declares package pkg; but is explicitly compiled from scratch/A.java with -d classes. What is its identity?",
  "options": [
    "pkg.A",
    "scratch.A",
    "A",
    "classes.pkg.A"
  ],
  "correctIndex": 0,
  "explanation": "Declaration identity is independent of the explicit input file's parent directory.",
  "optionFeedback": [
    "Correct: output becomes classes/pkg/A.class.",
    "The input folder is not a package declaration.",
    "A declaration prevents unnamed-package identity.",
    "The output root does not enter the binary name."
  ]
},
{
  "question": "Where does javac normally discover pkg.A under -sourcepath src?",
  "options": [
    "classes/pkg/A.class",
    "src/pkg/A.java",
    "src/A.java",
    "pkg/src/A.java"
  ],
  "correctIndex": 1,
  "explanation": "Source lookup maps the package path below the source root.",
  "optionFeedback": [
    "That is class output, not source discovery.",
    "Correct: src plus pkg/A.java.",
    "This omits the declared package component.",
    "The root must precede the package path."
  ]
},
{
  "question": "A is public but its constructor has no modifier. May app.Tester instantiate pkg.A?",
  "options": [
    "No, the constructor is package-private",
    "Yes, a public class opens all members",
    "Yes, importing A opens its constructor",
    "Only if folders share a parent"
  ],
  "correctIndex": 0,
  "explanation": "The class and constructor have separate access checks.",
  "optionFeedback": [
    "Correct: the caller is in another package.",
    "Members/constructors do not inherit public access from the class.",
    "Imports only help resolve names.",
    "Filesystem ancestry does not merge packages."
  ]
},
{
  "question": "Do school.people and school.people.helpers share package-private access?",
  "options": [
    "Always",
    "No, they have different exact package names",
    "Only through wildcard imports",
    "Only on Windows"
  ],
  "correctIndex": 1,
  "explanation": "Subpackages are distinct access boundaries.",
  "optionFeedback": [
    "A spelling hierarchy is not a single package.",
    "Correct: exact package membership controls access.",
    "Imports do not grant permissions.",
    "OS behaviour does not extend Java access."
  ]
},
{
  "question": "Which path is requested by java -cp classes/app app.Tester?",
  "options": [
    "classes/app/app/Tester.class",
    "classes/app/Tester.class",
    "classes/Tester.class",
    "src/app/Tester.java"
  ],
  "correctIndex": 0,
  "explanation": "The package path app/Tester.class is appended to the supplied classes/app root.",
  "optionFeedback": [
    "Correct: the doubled app reveals the wrong root.",
    "This follows root classes, not classes/app.",
    "This drops the requested package.",
    "The launcher searches compiled classes."
  ]
},
{
  "question": "What does compiling only Tester with -sourcepath src rely on to discover pkg.A?",
  "options": [
    "Executing main first",
    "src/pkg/A.java declaring pkg.A",
    "A java.util wildcard",
    "pkg.A.java saved in classes"
  ],
  "correctIndex": 1,
  "explanation": "The compiler constructs a source path from the root and declared type name.",
  "optionFeedback": [
    "Runtime execution cannot discover compiler source dependencies.",
    "Correct: source layout supports automatic discovery.",
    "java.util is unrelated to pkg.A.",
    "Neither the filename nor directory is the expected source."
  ]
},
{
  "question": "A file at classes/app/Tester.class is requested as Tester with -cp classes/app. Why may loading still fail?",
  "options": [
    "Bytecode declares app.Tester, not Tester",
    "Its private fields are inaccessible",
    "No sourcepath is passed to java",
    "Its array is empty"
  ],
  "correctIndex": 0,
  "explanation": "Requested binary identity must match the class file as well as its path.",
  "optionFeedback": [
    "Correct: use -cp classes app.Tester.",
    "Fields do not rename the class.",
    "This launcher uses compiled classes, not sourcepath.",
    "No array logic has run."
  ]
},
{
  "question": "Main method not found most directly indicates what?",
  "options": [
    "No class file was located",
    "Class found, but required entry point absent",
    "Imports malformed",
    "All dependencies missing"
  ],
  "correctIndex": 1,
  "explanation": "Class lookup and entry-point lookup occur at separate stages.",
  "optionFeedback": [
    "Missing class produces another diagnostic.",
    "Correct: inspect the main signature and chosen target.",
    "Imports were resolved during compilation.",
    "This is not a claim about every dependency."
  ]
},
];
