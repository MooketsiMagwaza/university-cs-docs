module StreamCore (stream, prefix) where

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- The stream is productive; taking a nonpositive count demands no elements.

stream :: [Int]
stream = [1..]

prefix :: Int -> [Int]
prefix n = take n stream
