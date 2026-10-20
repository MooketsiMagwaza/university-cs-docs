module Report (summary, highNames) where

import Model
import Core

-- Read the question: Produce one-line summaries and the high-observation names.

-- Plan: Keep missing and invalid items visible.
summary :: Sensor -> String
summary item@(Sensor name _) = name ++ ": " ++ outcome item

-- Plan: Preserve input order and repeated identifiers, using a constructor pattern.
highNames :: [Sensor] -> [String]
highNames items = [name | item@(Sensor name _) <- items,
  outcome item == "high"]
