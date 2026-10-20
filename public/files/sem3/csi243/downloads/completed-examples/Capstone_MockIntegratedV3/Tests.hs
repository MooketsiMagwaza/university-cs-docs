module Tests (checks) where

import TestSupport
import Model
import Core

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Derive outputs by hand and count list cells rather than measuring wall-clock time.
checks :: [(String, Bool)]
checks =
  [ assertEqual "missing" "missing" (outcome (Sensor "N" []))
  , assertEqual "invalid" "invalid" (outcome (Sensor "N" [-1]))
  , assertEqual "boundary" "high" (outcome (Sensor "N" [20]))
  , assertEqual "unequal" (Just 15.0)
      (classAverage [Sensor "A" [20], Sensor "B" [0,20]])
  , assertEqual "cost" (6,3) (countedTotal [1,2,3])
  ]
