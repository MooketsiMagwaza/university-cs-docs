export const quizData = [
  { question: "Which removal rule defines a stack?", options: ["Last in, first out", "First in, first out", "Smallest first", "Random first"], correctIndex: 0, explanation: "The newest item is at the top and leaves first." },
  { question: "Which removal rule defines a basic queue?", options: ["First in, first out", "Last in, first out", "Largest first", "Newest first"], correctIndex: 0, explanation: "The earliest arrival is removed from the front." },
  { question: "If top starts at -1, when is an array stack empty?", options: ["top == -1", "top == 0", "top == capacity", "top == 1"], correctIndex: 0, explanation: "No valid array index is currently occupied." },
  { question: "Why use modulo in a circular queue?", options: ["To wrap an index from the final cell to zero", "To sort values", "To avoid a size field always", "To reverse the queue"], correctIndex: 0, explanation: "(index + 1) % capacity cycles through physical cells." },
  { question: "Which structure naturally checks nested brackets?", options: ["Stack", "FIFO queue", "Hash map only", "Binary search tree"], correctIndex: 0, explanation: "The most recent unmatched opener must be checked first." },
  { question: "What is underflow?", options: ["Removing from an empty structure", "Adding to available capacity", "A hash collision", "A sorted array"], correctIndex: 0, explanation: "No element exists to return." }
];
