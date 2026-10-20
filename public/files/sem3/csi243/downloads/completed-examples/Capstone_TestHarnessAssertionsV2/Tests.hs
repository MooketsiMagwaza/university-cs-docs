module Tests (checks) where

import TestSupport

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Deliberate failed checks test the harness itself; retain their labels.
checks :: [(String, Bool)]
checks =
  [ assertEqual "equal" (4 :: Int) 4
  , assertEqual "wrong-total" (4 :: Int) 5
  , assertTrue "empty-domain" (all even ([] :: [Int]))
  , assertApprox "near" 0.25 2.0 2.0
  , assertApprox "far" 0.25 2.0 4.0
  , assertApprox "negative-tolerance" (-1.0) 2.0 2.0
  ]
