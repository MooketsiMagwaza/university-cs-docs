-- Title: Use list bind for dependent branching
{-
QUESTION
Write branches :: [Int] -> [Int] using >>=. For each n produce [1..n],
in input order. Non-positive n contributes []. Unlike independent list
application, the length of the next list depends on the current value.
-}

-- Read the question: Write a definition; branches has input/result type [Int] -> [Int].
-- Plan: Bind the first result and choose the next computation from that value.
branches :: [Int] -> [Int]
branches xs = xs >>= (\n -> [1..n]) -- Concatenate dependent branches.

main :: IO ()
main = do
  print (branches [])  -- expected: []
  print (branches [0])  -- expected: []
  print (branches [1])  -- expected: [1]
  print (branches [2,3])  -- expected: [1,2,1,2,3]
  print (branches [-2,2,0,1])  -- expected: [1,2,1]
