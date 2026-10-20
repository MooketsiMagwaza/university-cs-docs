-- Title: Keep strings shorter than a length threshold
{-
QUESTION
Given a list and integer y, define shorterThan recursively.
Return all strings whose length is strictly smaller than y.
An empty input returns an empty list. Give the signature and a dry run.
-}

-- Read the question: Write shorterThan :: [String] -> Int -> [String].
-- Plan: Retain matching heads and skip the others; always recurse on the tail.
-- Dry run: shorterThan ["a","abcd","bb"] 3 = "a" : ("bb" : []) = ["a","bb"].
shorterThan :: [String] -> Int -> [String]
shorterThan [] _ = [] -- Base: no elements left.
shorterThan (x:xs) y
  | length x < y = x : shorterThan xs y
  | otherwise = shorterThan xs y

main :: IO ()
main = do
  print (shorterThan ["a","abcd","bb"] 3)  -- expected: ["a","bb"]
  print (shorterThan [] 3)  -- expected: []
  print (shorterThan [""] 1)  -- expected: [""]
  print (shorterThan ["abc"] 3)  -- expected: []
  print (shorterThan ["a","bb"] 0)  -- expected: []
