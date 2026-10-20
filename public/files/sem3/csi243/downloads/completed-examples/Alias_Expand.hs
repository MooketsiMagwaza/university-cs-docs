-- Title: Expand aliases and implement a client function
{-
QUESTION
Given Pos = (Int,Int) and Board = [Pos], expand both aliases in the
signature occupied :: Board -> Int, then write occupied to count positions.
Explain why an alias adds no new constructor or type safety. (5 marks)
-}

-- Read the question: The command is write; define these input/output mappings.
-- occupied :: Board -> Int
-- Plan: Expand aliases before choosing tuple projections or list traversal.
type Pos = (Int, Int)
type Board = [Pos]

occupied :: Board -> Int
-- Aliases expand to the ordinary tuple or list representation.
occupied = length

-- Expanded: Pos = (Int,Int); Board = [(Int,Int)].
-- occupied :: [(Int,Int)] -> Int. A raw position list is accepted.

main :: IO ()
main = do
  print (occupied [])  -- expected: 0
  print (occupied [(1,2)])  -- expected: 1
  print (occupied [(1,2),(3,4)])  -- expected: 2
  print (occupied [(0,0),(0,0)])  -- expected: 2
  print (occupied [(1,1),(2,2),(3,3)])  -- expected: 3
