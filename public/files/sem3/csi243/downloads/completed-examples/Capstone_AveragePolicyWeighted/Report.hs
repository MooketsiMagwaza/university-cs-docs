module Report (decision) where

import Core

-- Read the question: Render either a validation error or a weighted pass decision.

-- Plan: Propagate errors before applying the 60-mark inclusive boundary.
decision :: [(Int, Int)] -> String
decision xs = case weighted xs of
  Left message -> "ERROR: " ++ message
  Right mean | mean >= 60 -> "pass"
             | otherwise -> "fail"
