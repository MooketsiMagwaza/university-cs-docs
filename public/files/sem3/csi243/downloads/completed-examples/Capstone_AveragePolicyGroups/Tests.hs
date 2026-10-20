module Tests (checks) where

import TestSupport
import Core
import Report

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Hand-calculate sums and counts before using the tested functions.
checks :: [(String, Bool)]
checks =
  [ assertEqual "empty" Nothing (meanOfMeans [])
  , assertEqual "all-missing" Nothing (pooledMean [[],[]])
  , assertEqual "equal-groups" (Just 50.0) (meanOfMeans [[100],[0]])
  , assertEqual "unequal-total" (100,3) (totals [[100],[0,0]])
  , assertEqual "pooled-unequal" (Just 25.0)
      (pooledMean [[100],[0,0,0]])
  , assertTrue "policies-differ" (policyGap [[100],[0,0]])
  ]
