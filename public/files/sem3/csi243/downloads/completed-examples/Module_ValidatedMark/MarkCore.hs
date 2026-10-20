module MarkCore (Mark, makeMark, value, passed) where

newtype Mark = Mark Int

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- Only makeMark creates a value for clients; its guard enforces the inclusive valid range.

makeMark :: Int -> Maybe Mark
makeMark n
  | n < 0 || n > 100 = Nothing
  | otherwise = Just (Mark n)

value :: Mark -> Int
value (Mark n) = n

passed :: Mark -> Bool
passed (Mark n) = n >= 50
