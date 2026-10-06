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
    question: "Where should `A.java` be placed below source root `src` if it declares `package pkg;`?",
    options: ["src/A.java", "src/pkg/A.java", "src/pkg/A.class", "pkg/src/A.java"],
    correctIndex: 1,
    explanation: "The package path below the source root mirrors the declaration, and the source filename matches the public class.",
    optionFeedback: [
      "This path corresponds to the unnamed package, not pkg.",
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
];
