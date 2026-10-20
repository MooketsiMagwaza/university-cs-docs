-- Title: Pair corresponding elements from two lists.
{-
QUESTION
Given two lists, define the polymorphic function twoLists to create a
list of tuples using corresponding elements of the two lists.
For example, twoLists [1,2,3] [4,5,6] returns [(1,4),(2,5),(3,6)].
Stop when either list is empty; allow different element types.
-}

-- Read the question: Write [a] -> [b] -> [(a,b)] for corresponding positions.
-- Plan: Use two empty cases and consume one element from each list together.
twoLists :: [a] -> [b] -> [(a, b)]
-- Either empty input ends pairing; otherwise consume both heads.
twoLists [] _ = []
twoLists _ [] = []
twoLists (x:xs) (y:ys) = (x,y) : twoLists xs ys

main :: IO ()
main = do
  print (twoLists ([] :: [Int]) [True])  -- expected: []
  print (twoLists [True] ([] :: [Int]))  -- expected: []
  print (twoLists ([1,2,3] :: [Int]) ([4,5,6] :: [Int]))  -- expected: [(1,4),(2,5),(3,6)]
  print (twoLists ([1,2] :: [Int]) "a")  -- expected: [(1,'a')]
  print (twoLists [False] ["yes","no"])  -- expected: [(False,"yes")]
