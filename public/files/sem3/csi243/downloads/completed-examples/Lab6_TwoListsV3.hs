-- Title: Combine corresponding elements of three lists.
{-
QUESTION
Write threeLists :: [a] -> [b] -> [c] -> [(a,b,c)]. Form triples from
corresponding positions. Stop as soon as any input list is empty.
Keep all three element types independent.
-}

-- Read the question: Write a three-input polymorphic positional pairing function.
-- Plan: Terminate on any empty list and otherwise recurse on all three tails.
threeLists :: [a] -> [b] -> [c] -> [(a, b, c)]
-- Each empty case terminates; the recursive case consumes three heads.
threeLists [] _ _ = []
threeLists _ [] _ = []
threeLists _ _ [] = []
threeLists (x:xs) (y:ys) (z:zs) = (x,y,z) : threeLists xs ys zs

main :: IO ()
main = do
  print (threeLists ([] :: [Int]) [True] "a")  -- expected: []
  print (threeLists ([1] :: [Int]) ([] :: [Bool]) "a")  -- expected: []
  print (threeLists ([1] :: [Int]) [True] "")  -- expected: []
  print (threeLists ([1,2] :: [Int]) [True,False] "ab")  -- expected: [(1,True,'a'),(2,False,'b')]
  print (threeLists ["x","y"] "a" [False,True])  -- expected: [("x",'a',False)]
