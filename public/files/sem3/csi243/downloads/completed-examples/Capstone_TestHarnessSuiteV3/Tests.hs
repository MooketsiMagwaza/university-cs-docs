module Tests (suiteFor, checks, mutantChecks) where

import TestSupport
import Core

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: The oracle is literal expected data, never a call to the reference transform.
suiteFor :: ([Int] -> [Int]) -> [(String, Bool)]
suiteFor transform =
  [ assertEqual "empty" [] (transform [])
  , assertEqual "singleton" [3] (transform [0])
  , assertEqual "mixed" [2,5] (transform [-1,2])
  ]

-- Plan: The reference suite should pass every check.
checks :: [(String, Bool)]
checks = suiteFor adjust

-- Plan: The mutant passes the empty case but fails both nonempty cases.
mutantChecks :: [(String, Bool)]
mutantChecks = suiteFor faultyAdjust
