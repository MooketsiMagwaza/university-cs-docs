module Core (average, outcome, classAverage) where

import Model

-- Read the question: Write safe averaging and ordered classification over Student values.

-- Plan: Empty or out-of-range marks have no mean; otherwise divide total by count.
average :: [Int] -> Maybe Double
average [] = Nothing
average xs
  | any (\x -> x < 0 || x > 100) xs = Nothing
  | otherwise = Just (fromIntegral (sum xs) / fromIntegral (length xs))

-- Plan: Validate first, then test the higher boundary before the lower boundary.
outcome :: Student -> String
outcome (Student _ xs)
  | any (\x -> x < 0 || x > 100) xs = "invalid"
  | otherwise = case average xs of
      Nothing -> "missing"
      Just m | m >= 75 -> "distinction"
             | m >= 50 -> "pass"
             | otherwise -> "fail"

-- Plan: Reject any invalid mark; constructor patterns omit missing student means.
classAverage :: [Student] -> Maybe Double
classAverage students
  | any invalid students = Nothing
  | null means = Nothing
  | otherwise = Just (sum means / fromIntegral (length means))
  where
    invalid (Student _ xs) = any (\x -> x < 0 || x > 100) xs
    means = [m | Student _ xs <- students, Just m <- [average xs]]
