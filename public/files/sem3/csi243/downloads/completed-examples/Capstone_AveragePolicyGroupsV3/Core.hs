module Core (average, meanOfMeans, pooledMean, totals) where

-- Read the question: Distinguish equally weighted group means from equally weighted observations.

-- Plan: The empty list has no denominator; every Int is valid in this exercise.
average :: [Int] -> Maybe Double
average [] = Nothing
average xs = Just (fromIntegral (sum xs) / fromIntegral (length xs))

-- Plan: Each nonempty group receives one vote, regardless of its size.
meanOfMeans :: [[Int]] -> Maybe Double
meanOfMeans groups = case [m | xs <- groups, Just m <- [average xs]] of
  [] -> Nothing
  ms -> Just (sum ms / fromIntegral (length ms))

-- Plan: Each observation receives one vote; empty groups contribute none.
pooledMean :: [[Int]] -> Maybe Double
pooledMean groups = average (concat groups)

-- Plan: Expose total and count so a recurring mean need not be printed.
totals :: [[Int]] -> (Int, Int)
totals groups = (sum (map sum groups), sum (map length groups))
