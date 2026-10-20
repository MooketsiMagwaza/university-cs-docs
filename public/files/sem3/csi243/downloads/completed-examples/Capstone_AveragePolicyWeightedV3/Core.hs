module Core (weighted, validWeights) where

-- Read the question: Return a checked weighted mean for a nonempty list of (mark, weight).

-- Plan: Require at least one mark, valid percentage marks and strictly positive weights.
validWeights :: [(Int, Int)] -> Bool
validWeights xs = not (null xs) &&
  all (\(mark, weight) -> mark >= 0 && mark <= 100 && weight > 0) xs

-- Plan: Use Integer products to avoid Int multiplication overflow; divide by total weight.
weighted :: [(Int, Int)] -> Either String Double
weighted xs
  | not (validWeights xs) = Left "invalid weights or marks"
  | otherwise = Right (fromIntegral numerator / fromIntegral denominator)
  where
    numerator = sum [toInteger mark * toInteger weight | (mark, weight) <- xs]
    denominator = sum [toInteger weight | (_, weight) <- xs]
