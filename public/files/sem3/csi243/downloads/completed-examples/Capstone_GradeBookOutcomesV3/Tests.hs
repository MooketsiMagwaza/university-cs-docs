module Tests (checks) where

import TestSupport
import Model
import Core

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Use literal expected values, including unequal mark counts.
checks :: [(String, Bool)]
checks =
  [ assertEqual "empty" Nothing (average [])
  , assertEqual "pass-boundary" "pass" (outcome (Student "A" [40]))
  , assertEqual "distinction-boundary" "distinction"
      (outcome (Student "B" [70]))
  , assertEqual "invalid" Nothing (classAverage [Student "X" [101]])
  , assertEqual "unequal" (Just 75.0)
      (classAverage [Student "A" [100], Student "B" [0,100]])
  , assertEqual "missing-class" Nothing (classAverage [Student "N" []])
  ]
