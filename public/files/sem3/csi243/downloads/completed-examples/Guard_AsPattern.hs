-- Title: Duplicate a list head with an as-pattern
{-
QUESTION
Write duplicateHead :: [a] -> [a] using an as-pattern for the non-empty case. [4]
Return [] for []; otherwise prepend a copy of the head to the whole list.
-}

-- Read the question: Write duplicateHead :: [a] -> [a].
-- Plan: Bind both the head and the original list.
duplicateHead :: [a] -> [a]
duplicateHead [] = []
duplicateHead whole@(x:_) = x : whole  -- Keep the whole matched list.

main :: IO ()
main = do
  print (duplicateHead ([] :: [Int]))  -- expected: []
  print (duplicateHead [7])  -- expected: [7,7]
  print (duplicateHead [1,2,3])  -- expected: [1,1,2,3]
  print (duplicateHead "ab")  -- expected: "aab"
  print (duplicateHead [False,True])  -- expected: [False,False,True]
