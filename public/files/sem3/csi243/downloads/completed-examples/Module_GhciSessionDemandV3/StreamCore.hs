module StreamCore (stream, prefix) where

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- The stream is productive; taking a nonpositive count demands no elements.

stream :: [Bool]
stream = cycle [False, True]

prefix :: Int -> [Bool]
prefix n = take n stream
