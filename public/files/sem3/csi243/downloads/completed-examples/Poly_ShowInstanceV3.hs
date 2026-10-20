-- Title: Write Show by hand for Direction
{-
QUESTION
Given data Direction = North | East | South | West, write a Show instance. [4]
North must display as N, East must display as E, South must display as S, West must display as W.
The output contains no quotation marks. Do not derive Show.
-}

-- Read the question: Write .
-- Plan: Give one show equation per constructor.
data Direction = North | East | South | West

instance Show Direction where
  show North = "N"  -- Required rendering.
  show East = "E"  -- Required rendering.
  show South = "S"  -- Required rendering.
  show West = "W"  -- Required rendering.

main :: IO ()
main = do
  print (North)  -- expected: N
  print (East)  -- expected: E
  print (South)  -- expected: S
  print (West)  -- expected: W
  print (([] :: [Direction]))  -- expected: []
  print ([North,West])  -- expected: [N,W]
