-- Title: Combine corresponding elements of three lists.
{-
QUESTION
Write threeLists :: [a] -> [b] -> [c] -> [(a,b,c)]. Form triples from
corresponding positions. Stop as soon as any input list is empty.
Keep all three element types independent.
-}

threeLists :: [a] -> [b] -> [c] -> [(a, b, c)]
threeLists = undefined -- Your answer here

main :: IO ()
main = do
  print (threeLists ([] :: [Int]) [True] "a")  -- expected: []
  print (threeLists ([1] :: [Int]) ([] :: [Bool]) "a")  -- expected: []
  print (threeLists ([1] :: [Int]) [True] "")  -- expected: []
  print (threeLists ([1,2] :: [Int]) [True,False] "ab")  -- expected: [(1,True,'a'),(2,False,'b')]
  print (threeLists ["x","y"] "a" [False,True])  -- expected: [("x",'a',False)]
