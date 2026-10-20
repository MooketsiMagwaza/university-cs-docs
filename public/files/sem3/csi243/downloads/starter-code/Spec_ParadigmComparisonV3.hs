-- Title: Classify concrete programming and markup descriptions
{-
QUESTION
Write classify :: [String] -> [String], preserving order.
Use this fixed classification table:
"HTML" -> "markup", "SQL" -> "declarative query",
"Haskell" -> "functional", "objects with methods" -> "object-oriented",
"mutable loop" -> "procedural", anything else -> "unknown".
HTML describes document structure; it is not an algorithm in this table.
Paradigm labels can overlap: this exercise chooses the principal
description, not an exclusive classification of every language feature.
Do not infer concurrency or speed from a label alone.
-}

classify :: [String] -> [String]
classify = undefined -- Your answer here

main :: IO ()
main = do
  print (classify [])  -- expected: []
  print (classify ["HTML"])  -- expected: ["markup"]
  print (classify ["SQL","Haskell"])  -- expected: ["declarative query","functional"]
  print (classify ["objects with methods","mutable loop"])  -- expected: ["object-oriented","procedural"]
  print (classify ["other"])  -- expected: ["unknown"]
