-- Title: Use filter to retain strings of length at least three
{-
QUESTION
Write select :: [String] -> [String] using filter. [3]
Keep strings of length at least three in input order.
-}

-- Read the question: Write select :: [String] -> [String].
-- Plan: Supply the predicate to filter.
select :: [String] -> [String]
select = filter (\s -> length s >= 3)  -- Test every input element.

main :: IO ()
main = do
  print (select [])  -- expected: []
  print (select [""])  -- expected: []
  print (select ["cat"])  -- expected: ["cat"]
  print (select ["a","dog","bird"])  -- expected: ["dog","bird"]
  print (select ["abc","xy","xyz"])  -- expected: ["abc","xyz"]
