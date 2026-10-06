import type { PlaygroundLanguage } from './runners';

export type PlaygroundExample = { label: string; code: string };

export const LANGUAGE_META: Record<PlaygroundLanguage, { name: string; fileHint: string; tagline: string }> = {
  html: { name: 'HTML & CSS', fileHint: 'index.html', tagline: 'Edit the page and see it rendered live.' },
  javascript: { name: 'JavaScript', fileHint: 'script.js', tagline: 'Runs in a sandboxed worker. console.log writes to the output.' },
  python: { name: 'Python', fileHint: 'main.py', tagline: 'Real CPython (Pyodide) running in your browser.' },
  sql: { name: 'SQL', fileHint: 'query.sql', tagline: 'A real SQLite database, rebuilt from your script on every run.' },
};

export const EXAMPLES: Record<PlaygroundLanguage, PlaygroundExample[]> = {
  html: [
    {
      label: 'Hello, HTML',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Hello, University Docs!</h1>
  <p>Change this text and press <b>Run</b>.</p>
</body>
</html>`,
    },
    {
      label: 'CSS box model',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    .box {
      width: 200px;
      padding: 20px;       /* space inside the border */
      border: 6px solid #2563eb;
      margin: 24px;        /* space outside the border */
      background: #dbeafe;
    }
  </style>
</head>
<body>
  <div class="box">content + padding + border + margin</div>
</body>
</html>`,
    },
    {
      label: 'Flexbox layout',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    .row { display: flex; gap: 12px; justify-content: space-between; align-items: center; }
    .item { background: #16a34a; color: white; padding: 16px 24px; border-radius: 8px; }
    .item:nth-child(2) { padding: 40px 24px; background: #9333ea; }
  </style>
</head>
<body>
  <div class="row">
    <div class="item">One</div>
    <div class="item">Two</div>
    <div class="item">Three</div>
  </div>
</body>
</html>`,
    },
    {
      label: 'Table and list',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    table { border-collapse: collapse; }
    th, td { border: 1px solid #94a3b8; padding: 6px 12px; text-align: left; }
    th { background: #e2e8f0; }
  </style>
</head>
<body>
  <table>
    <tr><th>Course</th><th>Language</th></tr>
    <tr><td>CSI141</td><td>Java</td></tr>
    <tr><td>CSI243</td><td>Haskell</td></tr>
  </table>
  <ul>
    <li>Tables hold data</li>
    <li>Lists hold items</li>
  </ul>
</body>
</html>`,
    },
    {
      label: 'Button with JavaScript',
      code: `<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; padding: 1rem;">
  <button id="btn">Click me</button>
  <p id="out">Clicks: 0</p>

  <script>
    let clicks = 0;
    document.getElementById('btn').addEventListener('click', () => {
      clicks++;
      document.getElementById('out').textContent = 'Clicks: ' + clicks;
    });
  </script>
</body>
</html>`,
    },
    {
      label: 'CSS animation',
      code: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; padding: 1rem; }
    .ball {
      width: 48px; height: 48px; border-radius: 50%;
      background: #f97316;
      animation: slide 1.6s ease-in-out infinite alternate;
    }
    @keyframes slide {
      from { transform: translateX(0); }
      to   { transform: translateX(240px); }
    }
  </style>
</head>
<body>
  <div class="ball"></div>
</body>
</html>`,
    },
  ],

  javascript: [
    {
      label: 'Hello, console',
      code: `console.log('Hello, University Docs!');
console.log(2 + 3 * 4);
console.log([1, 2, 3].map((n) => n * 2));`,
    },
    {
      label: 'Variables and types',
      code: `const name = 'Ada';
let age = 36;
const scores = [90, 72, 85];
const student = { name, age, scores };

console.log(typeof name, typeof age, typeof scores, typeof student);
console.log(student);`,
    },
    {
      label: 'Loops and functions',
      code: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

for (let n = 1; n <= 20; n++) {
  if (isPrime(n)) console.log(n, 'is prime');
}`,
    },
    {
      label: 'Array methods',
      code: `const nums = [5, 3, 8, 1, 9, 2];

console.log('sorted  :', [...nums].sort((a, b) => a - b));
console.log('evens   :', nums.filter((n) => n % 2 === 0));
console.log('doubled :', nums.map((n) => n * 2));
console.log('sum     :', nums.reduce((total, n) => total + n, 0));
console.log('max     :', Math.max(...nums));`,
    },
    {
      label: 'Recursion',
      code: `const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

console.log('6! =', factorial(6));
console.log('fib 0..12:', Array.from({ length: 13 }, (_, i) => fib(i)));`,
    },
    {
      label: 'Classes',
      code: `class Stack {
  #items = [];
  push(x) { this.#items.push(x); return this; }
  pop() { return this.#items.pop(); }
  get size() { return this.#items.length; }
}

const s = new Stack().push(1).push(2).push(3);
console.log('size:', s.size);
console.log('pop :', s.pop());
console.log('size:', s.size);`,
    },
    {
      label: 'Async and promises',
      code: `const wait = (ms, value) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

console.log('start');
const a = await wait(300, 'first');
console.log(a);
const [b, c] = await Promise.all([wait(200, 'second'), wait(100, 'third')]);
console.log(b, c);
console.log('done');`,
    },
  ],

  python: [
    {
      label: 'Hello, Python',
      code: `print("Hello, University Docs!")
print(2 + 3 * 4)
print([n * 2 for n in range(5)])`,
    },
    {
      label: 'Variables and types',
      code: `name = "Ada"
age = 36
height = 1.68
scores = [90, 72, 85]

for value in (name, age, height, scores):
    print(repr(value), "->", type(value).__name__)`,
    },
    {
      label: 'Loops and conditions',
      code: `for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)`,
    },
    {
      label: 'Functions and recursion',
      code: `def factorial(n):
    return 1 if n <= 1 else n * factorial(n - 1)

def fib(n, memo={}):
    if n < 2:
        return n
    if n not in memo:
        memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]

print("6! =", factorial(6))
print("fib(50) =", fib(50))`,
    },
    {
      label: 'Lists, dicts, sets',
      code: `words = "the quick brown fox jumps over the lazy dog the end".split()

counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1

print("unique words:", len(set(words)))
print("most common :", max(counts, key=counts.get), counts[max(counts, key=counts.get)])
print("sorted      :", sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3])`,
    },
    {
      label: 'Classes',
      code: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("deposit must be positive")
        self.balance += amount

    def __repr__(self):
        return f"Account({self.owner!r}, {self.balance})"

acct = Account("Kabo", 100)
acct.deposit(50)
print(acct)

try:
    acct.deposit(-5)
except ValueError as err:
    print("Error:", err)`,
    },
    {
      label: 'Reading input',
      code: `# Type values in the Input box (one line per input() call), then press Run.
name = input("Name? ")
age = int(input("Age? "))
print(f"Hello {name}, next year you will be {age + 1}.")`,
    },
    {
      label: 'Error to diagnose',
      code: `numbers = [1, 2, 3]
total = 0
for i in range(4):
    total += numbers[i]
print(total)`,
    },
  ],

  sql: [
    {
      label: 'Create and SELECT',
      code: `CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT, course TEXT, mark INTEGER);

INSERT INTO student (name, course, mark) VALUES
  ('Kabo',   'CSI141', 78),
  ('Naledi', 'CSI141', 91),
  ('Thato',  'CSI243', 64),
  ('Lesedi', 'CSI243', 85);

SELECT * FROM student;`,
    },
    {
      label: 'WHERE and ORDER BY',
      code: `CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT, course TEXT, mark INTEGER);
INSERT INTO student (name, course, mark) VALUES
  ('Kabo', 'CSI141', 78), ('Naledi', 'CSI141', 91),
  ('Thato', 'CSI243', 64), ('Lesedi', 'CSI243', 85);

SELECT name, mark
FROM student
WHERE mark >= 70
ORDER BY mark DESC;`,
    },
    {
      label: 'GROUP BY and aggregates',
      code: `CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT, course TEXT, mark INTEGER);
INSERT INTO student (name, course, mark) VALUES
  ('Kabo', 'CSI141', 78), ('Naledi', 'CSI141', 91),
  ('Thato', 'CSI243', 64), ('Lesedi', 'CSI243', 85);

SELECT course,
       COUNT(*)  AS students,
       AVG(mark) AS average,
       MAX(mark) AS best
FROM student
GROUP BY course
HAVING COUNT(*) > 1;`,
    },
    {
      label: 'JOIN two tables',
      code: `CREATE TABLE course  (code TEXT PRIMARY KEY, title TEXT);
CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT, course TEXT REFERENCES course(code));

INSERT INTO course VALUES ('CSI141', 'Programming Principles'), ('CSI243', 'Functional Programming'), ('CSI323', 'Algorithms');
INSERT INTO student (name, course) VALUES ('Kabo', 'CSI141'), ('Naledi', 'CSI141'), ('Thato', 'CSI243');

-- INNER JOIN drops CSI323 (no students); LEFT JOIN keeps it.
SELECT c.code, c.title, s.name
FROM course c
LEFT JOIN student s ON s.course = c.code
ORDER BY c.code;`,
    },
    {
      label: 'UPDATE and DELETE',
      code: `CREATE TABLE item (id INTEGER PRIMARY KEY, label TEXT, qty INTEGER);
INSERT INTO item (label, qty) VALUES ('pen', 10), ('book', 3), ('bag', 0);

UPDATE item SET qty = qty + 5 WHERE label = 'book';
DELETE FROM item WHERE qty = 0;

SELECT * FROM item;`,
    },
    {
      label: 'Subquery',
      code: `CREATE TABLE student (id INTEGER PRIMARY KEY, name TEXT, mark INTEGER);
INSERT INTO student (name, mark) VALUES ('Kabo', 78), ('Naledi', 91), ('Thato', 64), ('Lesedi', 85);

-- Students scoring above the class average
SELECT name, mark
FROM student
WHERE mark > (SELECT AVG(mark) FROM student);`,
    },
  ],
};
