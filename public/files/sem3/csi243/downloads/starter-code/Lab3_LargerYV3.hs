-- Title: Keep strings shorter than a length threshold
{-
QUESTION
Given a list and integer y, define shorterThan recursively.
Return all strings whose length is strictly smaller than y.
An empty input returns an empty list. Give the signature and a dry run.
-}

shorterThan :: [String] -> Int -> [String]
shorterThan = undefined -- Your answer here

main :: IO ()
main = do
  print (shorterThan ["a","abcd","bb"] 3)  -- expected: ["a","bb"]
  print (shorterThan [] 3)  -- expected: []
  print (shorterThan [""] 1)  -- expected: [""]
  print (shorterThan ["abc"] 3)  -- expected: []
  print (shorterThan ["a","bb"] 0)  -- expected: []
