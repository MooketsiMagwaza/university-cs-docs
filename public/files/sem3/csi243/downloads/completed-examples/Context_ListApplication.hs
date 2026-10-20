-- Title: Apply a list of functions in function-major order
{-
QUESTION
Write apply :: [Int] -> [Int]. Use list <*> to apply [(+1),(*2)]
to all input values. Results for the first function precede results
for the second. List Applicative branches over every combination.
-}

-- Read the question: Write a definition; apply has input/result type [Int] -> [Int].
-- Plan: Use list application with one branch for each ordered combination.
apply :: [Int] -> [Int]
apply xs = [(+ 1), (* 2)] <*> xs -- Functions are the outer loop.

main :: IO ()
main = do
  print (apply [])  -- expected: []
  print (apply [0])  -- expected: [1,0]
  print (apply [1,2])  -- expected: [2,3,2,4]
  print (apply [-1,3])  -- expected: [0,4,-2,6]
  print (apply [2,2])  -- expected: [3,3,4,4]
