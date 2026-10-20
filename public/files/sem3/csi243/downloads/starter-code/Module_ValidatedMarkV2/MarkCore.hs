module MarkCore (Mark, makeMark, value, passed) where

newtype Mark = Mark Int

makeMark :: Int -> Maybe Mark
makeMark = undefined -- Your answer here

value :: Mark -> Int
value = undefined -- Your answer here

passed :: Mark -> Bool
passed = undefined -- Your answer here
