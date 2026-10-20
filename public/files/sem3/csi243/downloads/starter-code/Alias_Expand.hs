-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Pos = (Int,Int) and Board = [Pos], expand both aliases in the
signature occupied :: Board -> Int, then write occupied to count positions.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

type Pos = (Int, Int)
type Board = [Pos]

occupied :: Board -> Int
occupied = undefined -- Your answer here

main :: IO ()
main = do
  print (occupied [])  -- expected: 0
  print (occupied [(1,2)])  -- expected: 1
  print (occupied [(1,2),(3,4)])  -- expected: 2
  print (occupied [(0,0),(0,0)])  -- expected: 2
  print (occupied [(1,1),(2,2),(3,3)])  -- expected: 3
