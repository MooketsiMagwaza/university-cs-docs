-- Title: Extract components using tuple patterns
{-
QUESTION
Write first and second to extract the first and second components of a triple.
-}

-- Read the question: Write first :: (a, b, c) -> a.
-- Read the question: Write second :: (a, b, c) -> b.
-- Plan: Match the tuple shape and return the requested component.
-- Dry run: first (0,True,"") = 0; second (0,True,"") = True.
-- Key step: underscores discard components without evaluating them.
first :: (a, b, c) -> a
first (x, _, _) = x

second :: (a, b, c) -> b
second (_, y, _) = y

main :: IO ()
main = do
  print (first (0, True, ""))  -- expected: 0
  print (second (0, True, ""))  -- expected: True
  print (first ("", 2, False))  -- expected: ""
  print (second ("x", 7, False))  -- expected: 7
  print (first ([1,2], False, 0))  -- expected: [1,2]
