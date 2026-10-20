-- Title: Extract components using tuple patterns
{-
QUESTION
Specify and implement fst and snd for pairs, using the names first and second.
fst returns the first component; snd returns the second component.
-}

-- Read the question: Write first :: (a, b) -> a.
-- Read the question: Write second :: (a, b) -> b.
-- Plan: Match the tuple shape and return the requested component.
-- Dry run: first (0,True) = 0; second (0,True) = True, by the pair patterns.
-- Key step: underscores discard components without evaluating them.
first :: (a, b) -> a
first (x, _) = x

second :: (a, b) -> b
second (_, y) = y

main :: IO ()
main = do
  print (first (0, True))  -- expected: 0
  print (second (0, True))  -- expected: True
  print (first ("", 2))  -- expected: ""
  print (second ("x", 7))  -- expected: 7
  print (first ([1,2], False))  -- expected: [1,2]
  print (second (1, "ok"))  -- expected: "ok"
