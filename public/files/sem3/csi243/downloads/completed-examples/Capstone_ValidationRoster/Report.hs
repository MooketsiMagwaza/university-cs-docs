module Report (rosterReport) where

import Model
import Core

-- Read the question: Turn validation into one deterministic report line.

-- Plan: Do not silently remove invalid students or merge duplicate names.
rosterReport :: [Student] -> String
rosterReport students = case validate students of
  Left message -> "ERROR: " ++ message
  Right valid -> "OK: " ++ show (length valid) ++ " students"
