module Core (key, validate) where

import Model
import Data.List (nub)
import Data.Char (toLower)

-- Read the question: Validate a whole roster with a stated name identity rule.

-- Plan: Apply only the stated name policy; do not alter the stored Student.
key :: String -> String
key name = map toLower name

-- Plan: Check error categories in order; an empty roster and absent marks are allowed.
validate :: [Student] -> Either String [Student]
validate students
  | any (null . words) names = Left "empty name"
  | any (\m -> m < 0 || m > 20) marks = Left "invalid mark"
  | length keys /= length (nub keys) = Left "duplicate name"
  | otherwise = Right students
  where
    names = [name | Student name _ <- students]
    marks = concat [xs | Student _ xs <- students]
    keys = map key names
