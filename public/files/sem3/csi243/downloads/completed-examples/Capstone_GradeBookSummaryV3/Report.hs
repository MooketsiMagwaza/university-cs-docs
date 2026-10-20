module Report (summary, summaries, passNames) where

import Model
import Core

-- Read the question: Report outcomes without losing students who share a name.

-- Plan: Preserve the supplied name, including duplicates.
summary :: Student -> String
summary student@(Student name _) = name ++ ": " ++ outcome student

-- Plan: Produce one row per student, including missing and invalid rows.
summaries :: [Student] -> [String]
summaries students = [summary student | student <- students]

-- Plan: Match the constructor in the generator; keep both successful outcomes.
passNames :: [Student] -> [String]
passNames students = [name | student@(Student name _) <- students,
  outcome student `elem` ["pass", "distinction"]]
