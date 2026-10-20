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

-- Read the question: Write a definition; classify has input/result type [String] -> [String].
-- Plan: Model the concrete descriptions with pure functions and compare their results.
classify :: [String] -> [String]
classify = map label
  where
    label "HTML" = "markup"
    label "SQL" = "declarative query"
    label "Haskell" = "functional"
    label "objects with methods" = "object-oriented"
    label "mutable loop" = "procedural"
    label _ = "unknown" -- Explicit policy for unrecognised descriptions.

main :: IO ()
main = do
  print (classify [])  -- expected: []
  print (classify ["HTML"])  -- expected: ["markup"]
  print (classify ["SQL","Haskell"])  -- expected: ["declarative query","functional"]
  print (classify ["objects with methods","mutable loop"])  -- expected: ["object-oriented","procedural"]
  print (classify ["other"])  -- expected: ["unknown"]
