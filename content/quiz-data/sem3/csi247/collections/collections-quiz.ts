export const quizData = [
  { question: "Which interface represents an ordered sequence with duplicates?", options: ["List", "Set", "Map", "Comparable"], correctIndex: 0, explanation: "List preserves a sequence and permits repeated values." },
  { question: "Which abstraction associates a unique key with a value?", options: ["Map", "Queue", "Iterator", "Comparator"], correctIndex: 0, explanation: "A Map stores key/value entries and replaces a value for an equal key." },
  { question: "Best default implementation for a FIFO queue?", options: ["ArrayDeque", "ArrayList with remove(0)", "HashSet", "TreeMap"], correctIndex: 0, explanation: "ArrayDeque supports efficient operations at both ends." },
  { question: "How do you safely remove the current item during iterator traversal?", options: ["iterator.remove() after next()", "collection.clear() inside for-each", "Change size manually", "Use get(0)"], correctIndex: 0, explanation: "The iterator coordinates structural removal." },
  { question: "Which keeps unique values in sorted order?", options: ["TreeSet", "HashSet", "ArrayDeque", "ArrayList"], correctIndex: 0, explanation: "TreeSet combines uniqueness with ordering." },
  { question: "Equal objects used in a hash collection must have…", options: ["Equal hash codes", "Different hash codes", "Identical references", "Public fields"], correctIndex: 0, explanation: "This is required by the equals/hashCode contract." }
];
