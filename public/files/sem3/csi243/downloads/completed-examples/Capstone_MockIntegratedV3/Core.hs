module Core (average, outcome, classAverage, countedTotal) where

import Model

-- Read the question: Apply grade-book integration patterns to an unfamiliar domain.

-- Plan: Negative observations are invalid; absent data has no mean.
average :: [Int] -> Maybe Double
average [] = Nothing
average xs
  | any (< 0) xs = Nothing
  | otherwise = Just (fromIntegral (sum xs) / fromIntegral (length xs))

-- Plan: Reject invalid observations before comparing the inclusive high boundary.
outcome :: Sensor -> String
outcome (Sensor _ xs)
  | any (< 0) xs = "invalid"
  | otherwise = case average xs of
      Nothing -> "missing"
      Just mean | mean >= 20 -> "high"
                | otherwise -> "low"

-- Plan: Reject any negative observation; otherwise average nonmissing item means.
classAverage :: [Sensor] -> Maybe Double
classAverage items
  | any (< 0) (concat [xs | Sensor _ xs <- items]) = Nothing
  | null means = Nothing
  | otherwise = Just (sum means / fromIntegral (length means))
  where
    means = [m | Sensor _ xs <- items, Just m <- [average xs]]

-- Plan: Count one visit per cons cell; the empty case contributes zero visits.
countedTotal :: [Int] -> (Int, Int)
countedTotal [] = (0,0)
countedTotal (x:xs) = (x + total, 1 + visits)
  where
    (total, visits) = countedTotal xs
