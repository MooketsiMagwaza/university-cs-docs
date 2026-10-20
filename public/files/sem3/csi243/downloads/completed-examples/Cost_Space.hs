-- Title: Model stack depth, pending sums and output cells
{-
QUESTION
Write spaceModel :: [Int] -> (Int, Int, Int). Model sum by right
recursion, counting n pending additions at maximum (exclude the terminal
base frame); a fully evaluated reverse result has n list cells; a
strict accumulator sum retains zero pending addition thunks under
immediate forcing. Return (pending additions, result cells, strict
pending additions). Input length n is finite. These are abstract slots,
not bytes or exact GHC allocations. Input storage is excluded.
The sum stack and reversed result are distinct space categories.
-}

-- Read the question: Write a definition; spaceModel has input/result type [Int] -> (Int, Int, Int).
-- Plan: Count the abstract slots demanded by the question, separately from runtime bytes.
spaceModel :: [Int] -> (Int, Int, Int)
spaceModel xs = (pending xs, length xs, 0)
  where
    pending [] = 0
    pending (_:rest) = 1 + pending rest -- One modelled pending addition.

main :: IO ()
main = do
  print (spaceModel [])  -- expected: (0,0,0)
  print (spaceModel [7])  -- expected: (1,1,0)
  print (spaceModel [1,2])  -- expected: (2,2,0)
  print (spaceModel [1,2,3])  -- expected: (3,3,0)
  print (spaceModel [0,0,0,0])  -- expected: (4,4,0)
