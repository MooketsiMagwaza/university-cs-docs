module Client (answer) where

import TraceCore (total)

-- Read the question: implement this module through its declared interface.
-- Plan: keep representation details here and use only imported public names.
-- A thin client isolates the module boundary while the recursion remains in TraceCore.

answer :: Int -> Int
answer = total
