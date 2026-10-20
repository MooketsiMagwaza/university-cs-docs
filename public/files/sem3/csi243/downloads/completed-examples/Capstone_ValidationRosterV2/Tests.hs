module Tests (checks) where

import TestSupport
import Model
import Core
import Report

-- Read the question: Keep test oracles independent of the implementation under test.

-- Plan: Test the identity policy separately from missing marks and validation precedence.
checks :: [(String, Bool)]
checks =
  [ assertEqual "empty" "OK: 0 students" (rosterReport [])
  , assertEqual "missing-marks" "OK: 1 students"
      (rosterReport [Student "A" []])
  , assertEqual "name-policy" "ERROR: duplicate name"
      (rosterReport [Student "Ada" [], Student "ada" []])
  , assertEqual "precedence" "ERROR: empty name"
      (rosterReport [Student " " [-1]])
  , assertEqual "invalid" "ERROR: invalid mark"
      (rosterReport [Student "A" [21]])
  ]
