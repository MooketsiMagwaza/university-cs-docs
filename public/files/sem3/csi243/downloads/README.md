# CSI243 Haskell files

Every question is a pair of files with the same name. The file in `completed-examples/` holds the question at the top, the solution with the thinking in comments, and a `main` that prints the results with the expected output in a comment after each call. The file in `starter-code/` holds the same question, the type signatures with `undefined` bodies, and the same `main`, so you can write the answer yourself and compare.

Files ending in `V2` or `V3` are variations: the same kind of question with different data, a different condition or a different type.

Run a file with `runghc FileName.hs`, or load it in GHCi with `ghci FileName.hs`.
For a bundle directory, run `runghc -iBundleName BundleName/Main.hs` from its parent folder.

## Lab 1: recursion

| File | Question |
| --- | --- |
| `Lab1_AddAndSubtract.hs` | Return the sum and difference as a pair |
| `Lab1_AddAndSubtractV2.hs` | Return the product and sum as a pair |
| `Lab1_AddAndSubtractV3.hs` | Return the quotient and remainder as a pair |
| `Lab1_Concatenate.hs` | Concatenate two lists of Int values |
| `Lab1_ConcatenateV2.hs` | Concatenate two lists of Char values |
| `Lab1_ConcatenateV3.hs` | Concatenate two lists of String values |
| `Lab1_DifferenceSequences.hs` | Subtract corresponding sequence terms |
| `Lab1_DifferenceSequencesV2.hs` | Take absolute differences of corresponding sequence terms |
| `Lab1_DifferenceSequencesV3.hs` | Test equality of corresponding sequence terms |
| `Lab1_Factorial.hs` | Calculate factorial recursively |
| `Lab1_FactorialV2.hs` | Multiply the first n positive odd integers |
| `Lab1_FactorialV3.hs` | Multiply the first n positive even integers |
| `Lab1_Fibonacci.hs` | Define Fibonacci numbers and dry run F5 |
| `Lab1_FibonacciV2.hs` | Define the Lucas sequence recursively |
| `Lab1_FibonacciV3.hs` | Define the Pell sequence recursively |
| `Lab1_IsIn.hs` | Test membership in a list of Int values |
| `Lab1_IsInV2.hs` | Test membership in a list of Char values |
| `Lab1_IsInV3.hs` | Test membership in a list of String values |
| `Lab1_Length.hs` | Count the elements of a list of Int values |
| `Lab1_LengthV2.hs` | Count the elements of a list of String values |
| `Lab1_LengthV3.hs` | Count the elements of a list of Bool values |
| `Lab1_Occurrences.hs` | Count occurrences in a list of Int values |
| `Lab1_OccurrencesV2.hs` | Count occurrences in a list of Char values |
| `Lab1_OccurrencesV3.hs` | Count occurrences in a list of String values |
| `Lab1_PairProjections.hs` | Extract components using tuple patterns |
| `Lab1_PairProjectionsV2.hs` | Extract components using tuple patterns |
| `Lab1_PairProjectionsV3.hs` | Extract components using tuple patterns |
| `Lab1_RangeSum.hs` | Sum all integers in an inclusive range |
| `Lab1_RangeSumV2.hs` | Multiply all integers in an inclusive range |
| `Lab1_RangeSumV3.hs` | Sum the squares in an inclusive integer range |
| `Lab1_StructuralInduction.hs` | Prove that the generated set is the positive multiples of 3 |
| `Lab1_StructuralInductionV2.hs` | Prove that the generated set is the positive multiples of 4 |
| `Lab1_StructuralInductionV3.hs` | Prove that the generated set is the positive multiples of 5 |
| `Lab1_SumFactorials.hs` | Sum factorials from zero to n |
| `Lab1_SumFactorialsV2.hs` | Sum factorials at even indices |
| `Lab1_SumFactorialsV3.hs` | Sum factorials at odd indices |
| `Lab1_SumFirst.hs` | Sum the first n terms of a sequence |
| `Lab1_SumFirstV2.hs` | Multiply the first n terms of a sequence |
| `Lab1_SumFirstV3.hs` | Sum the squares of the first n sequence terms |
| `Lab1_SumList.hs` | Sum the terms of a sequence recursively |
| `Lab1_SumListV2.hs` | Multiply the terms of a sequence recursively |
| `Lab1_SumListV3.hs` | Join a sequence of strings recursively |
| `Lab1_SumNumbers.hs` | Sum positive integers up to and including n |
| `Lab1_SumNumbersV2.hs` | Sum the squares from 1 up to n |
| `Lab1_SumNumbersV3.hs` | Sum the first n positive odd integers |
| `Lab1_SumSequences.hs` | Add corresponding sequence terms |
| `Lab1_SumSequencesV2.hs` | Multiply corresponding sequence terms |
| `Lab1_SumSequencesV3.hs` | Take the greater of corresponding sequence terms |
| `Lab1_Swap.hs` | Rearrange tuple components with a pattern |
| `Lab1_SwapV2.hs` | Rearrange tuple components with a pattern |
| `Lab1_SwapV3.hs` | Rearrange tuple components with a pattern |
| `Lab1_TupleArithmetic.hs` | Add the components of an integer pair |
| `Lab1_TupleArithmeticV2.hs` | Multiply the components of an integer pair |
| `Lab1_TupleArithmeticV3.hs` | Subtract the second component from the first |

## Lab 2: recursion on lists and functions

| File | Question |
| --- | --- |
| `Lab2_ConcatLists.hs` | Concatenate two lists of Int values |
| `Lab2_ConcatListsV2.hs` | Concatenate two lists of Char values |
| `Lab2_ConcatListsV3.hs` | Concatenate two lists of String values |
| `Lab2_ElementOccurs.hs` | Count occurrences in a list of Int values |
| `Lab2_ElementOccursV2.hs` | Count occurrences in a list of Char values |
| `Lab2_ElementOccursV3.hs` | Count occurrences in a list of String values |
| `Lab2_IsElementIn.hs` | Test membership in a list of Int values |
| `Lab2_IsElementInV2.hs` | Test membership in a list of Char values |
| `Lab2_IsElementInV3.hs` | Test membership in a list of String values |
| `Lab2_ListLength.hs` | Count the elements of a list of Int values |
| `Lab2_ListLengthV2.hs` | Count the elements of a list of String values |
| `Lab2_ListLengthV3.hs` | Count the elements of a list of Bool values |
| `Lab2_PowerNum.hs` | Raise an integer to a nonnegative integer power |
| `Lab2_PowerNumV2.hs` | Raise an exact Double to a nonnegative power |
| `Lab2_PowerNumV3.hs` | Raise one more than an integer to a power |
| `Lab2_SumNumbers.hs` | Sum whole numbers strictly below n |
| `Lab2_SumNumbersV2.hs` | Sum even whole numbers strictly below n |
| `Lab2_SumNumbersV3.hs` | Sum squares of whole numbers strictly below n |

## Lab 3: recursion continued

| File | Question |
| --- | --- |
| `Lab3_AtPosition.hs` | Return an index and its list element |
| `Lab3_AtPositionV2.hs` | Return an index and its string element |
| `Lab3_AtPositionV3.hs` | Look up a list element counting from the right |
| `Lab3_IsSorted.hs` | Check whether a list is sorted in descending order |
| `Lab3_IsSortedV2.hs` | Check whether a list is sorted in ascending order |
| `Lab3_IsSortedV3.hs` | Check whether a list is strictly descending |
| `Lab3_LargerY.hs` | Keep list elements larger than a threshold |
| `Lab3_LargerYV2.hs` | Keep list elements at least a threshold |
| `Lab3_LargerYV3.hs` | Keep strings shorter than a length threshold |
| `Lab3_PositiveNumbers.hs` | Select all positive integers recursively |
| `Lab3_PositiveNumbersV2.hs` | Select all nonnegative integers recursively |
| `Lab3_PositiveNumbersV3.hs` | Select all integers divisible by three recursively |

## Lab 4: pattern matching

| File | Question |
| --- | --- |
| `Lab4_AddSub.hs` | Return the sum and absolute difference of two integers. |
| `Lab4_AddSubV2.hs` | Return the product and absolute difference of two integers. |
| `Lab4_AddSubV3.hs` | Return the sum and signed difference of two Double values. |
| `Lab4_GradePointLetter.hs` | Convert exact grade points to letter grades. |
| `Lab4_GradePointLetterV2.hs` | Convert integer grade points to letter grades. |
| `Lab4_GradePointLetterV3.hs` | Convert exact grade points to recommendations. |
| `Lab4_GradePoints.hs` | Convert percentage scores to grade points. |
| `Lab4_GradePointsV2.hs` | Convert scores out of twenty to grade points. |
| `Lab4_GradePointsV3.hs` | Convert percentages using revised grade-point boundaries. |
| `Lab4_LetterGrade.hs` | Convert percentage scores to letter grades. |
| `Lab4_LetterGradeV2.hs` | Convert scores out of twenty to letter grades. |
| `Lab4_LetterGradeV3.hs` | Convert percentages using revised letter-grade boundaries. |
| `Lab4_Recommendation.hs` | Convert percentage scores to university recommendations. |
| `Lab4_RecommendationV2.hs` | Convert scores out of twenty to university recommendations. |
| `Lab4_RecommendationV3.hs` | Convert percentages using revised recommendation boundaries. |
| `Lab4_SwapIntegers.hs` | Swap the contents of a pair of integers. |
| `Lab4_SwapIntegersV2.hs` | Swap a pair of strings. |
| `Lab4_SwapIntegersV3.hs` | Rotate three integers one position to the left. |

## Lab 5: list comprehensions

| File | Question |
| --- | --- |
| `Lab5_Consonants.hs` | Produce the uppercase consonants of an alphabet. |
| `Lab5_ConsonantsV2.hs` | Produce uppercase vowels from a string. |
| `Lab5_ConsonantsV3.hs` | Produce lowercase consonants from uppercase letters. |
| `Lab5_MarkAverages.hs` | Find each student's test and assignment averages. |
| `Lab5_MarkAveragesV2.hs` | Find test and assignment totals for each student. |
| `Lab5_MarkAveragesV3.hs` | Average three tests and two assignments per student. |
| `Lab5_PythagoreanTriples.hs` | Generate primitive Pythagorean triples below a bound. |
| `Lab5_PythagoreanTriplesV2.hs` | Generate all Pythagorean triples up to a bound. |
| `Lab5_PythagoreanTriplesV3.hs` | Generate primitive triples with a bounded perimeter. |
| `Lab5_Squares.hs` | Square the odd integers in a list. |
| `Lab5_SquaresV2.hs` | Cube the even integers in a list. |
| `Lab5_SquaresV3.hs` | Square integers divisible by three. |

## Lab 6: polymorphism and overloading

| File | Question |
| --- | --- |
| `Lab6_LastElement.hs` | Return the last element of a nonempty list. |
| `Lab6_LastElementV2.hs` | Return the last element safely using Maybe. |
| `Lab6_LastElementV3.hs` | Return the penultimate element safely. |
| `Lab6_ReverseList.hs` | Reverse a list polymorphically. |
| `Lab6_ReverseListV2.hs` | Reverse every inner list without reordering the outer list. |
| `Lab6_ReverseListV3.hs` | Reverse only a prefix of a polymorphic list. |
| `Lab6_SwapElements.hs` | Swap the two elements of a polymorphic pair. |
| `Lab6_SwapElementsV2.hs` | Rotate three independently typed tuple elements. |
| `Lab6_SwapElementsV3.hs` | Swap the fields of every pair in a list. |
| `Lab6_TwoLists.hs` | Pair corresponding elements from two lists. |
| `Lab6_TwoListsV2.hs` | Build every combination of elements from two lists. |
| `Lab6_TwoListsV3.hs` | Combine corresponding elements of three lists. |

## Recursion on numbers

| File | Question |
| --- | --- |
| `Rec_DesignDigits.hs` | Sum decimal digits after sign normalisation |
| `Rec_DesignDigitsV2.hs` | Count decimal digits with a zero convention |
| `Rec_DesignDigitsV3.hs` | Reverse decimal digits with an accumulator |
| `Rec_DesignDigitsV4.hs` | Multiply decimal digits recursively |
| `Rec_DesignEuclid.hs` | Normalise signs in Euclid gcd |
| `Rec_DesignEuclidV2.hs` | Derive a safe least common multiple |
| `Rec_DesignEuclidV3.hs` | Recognise coprime signed integers |
| `Rec_DesignEuclidV4.hs` | Compare remainder and subtraction gcd |
| `Rec_DesignFibAcc.hs` | Compute Fibonacci numbers with two accumulators |
| `Rec_DesignFibAccV2.hs` | Change the accumulator seeds to Lucas numbers |
| `Rec_DesignFibAccV3.hs` | Change the recurrence to Pell numbers |
| `Rec_DesignFibAccV4.hs` | Return adjacent Fibonacci values together |
| `Rec_DesignMultiply.hs` | Multiply signed integers by repeated addition |
| `Rec_DesignMultiplyV2.hs` | Multiply with a signed accumulator |
| `Rec_DesignMultiplyV3.hs` | Build a signed cube from repeated addition |
| `Rec_DesignMultiplyV4.hs` | Compare repeated addition with multiplication |
| `Rec_DesignPower.hs` | Repair the zero case of recursive power |
| `Rec_DesignPowerV2.hs` | Design power by exponentiation by squaring |
| `Rec_DesignPowerV3.hs` | Extend recursive power to negative exponents |
| `Rec_DesignPowerV4.hs` | Compare linear and halving power algorithms |
| `Rec_DesignRange.hs` | Sum an inclusive range with reversed bounds empty |
| `Rec_DesignRangeV2.hs` | Sum a half-open range recursively |
| `Rec_DesignRangeV3.hs` | Sum squares over an inclusive signed range |
| `Rec_DesignRangeV4.hs` | Sum every second value in a signed range |
| `Rec_DesignSumFactorials.hs` | Sum factorials with an explicit invalid-input policy |
| `Rec_DesignSumFactorialsV2.hs` | Sum factorials below an exclusive bound |
| `Rec_DesignSumFactorialsV3.hs` | Sum factorials at even indices |
| `Rec_DesignSumFactorialsV4.hs` | Compare factorial sum with a running-factorial algorithm |
| `Rec_Digits.hs` | Sum decimal digits recursively |
| `Rec_DigitsV2.hs` | Count decimal digits recursively |
| `Rec_DigitsV3.hs` | Convert a non-negative integer to binary digits |
| `Rec_Factorial.hs` | Compute a factorial recursively |
| `Rec_FactorialV2.hs` | Compute a double factorial recursively |
| `Rec_FactorialV3.hs` | Sum factorials using recursion |
| `Rec_Fibonacci.hs` | Compute the Fibonacci recurrence |
| `Rec_FibonacciV2.hs` | Compute the Lucas recurrence |
| `Rec_FibonacciV3.hs` | Compute the shifted Fibonacci recurrence |
| `Rec_Gcd.hs` | Implement Euclid gcd with remainders |
| `Rec_GcdV2.hs` | Implement gcd by repeated subtraction |
| `Rec_GcdV3.hs` | Calculate lcm through a recursive gcd |
| `Rec_Power.hs` | Raise an integer to a non-negative power |
| `Rec_PowerV2.hs` | Compute exact powers of a fractional base |
| `Rec_PowerV3.hs` | Add a finite geometric series recursively |
| `Rec_SumTo.hs` | Sum the first n integers recursively |
| `Rec_SumToV2.hs` | Sum the first n squares recursively |
| `Rec_SumToV3.hs` | Sum the first n odd numbers recursively |

## Recursion on lists

| File | Question |
| --- | --- |
| `List_Append.hs` | Append two lists recursively |
| `List_AppendV2.hs` | Flatten nested lists with recursive append |
| `List_AppendV3.hs` | Interleave two lists recursively |
| `List_DesignExtrema.hs` | Find a safe maximum without a fabricated initial value |
| `List_DesignExtremaV2.hs` | Find a safe minimum of negative and positive integers |
| `List_DesignExtremaV3.hs` | Find the lexicographically greatest string safely |
| `List_DesignExtremaV4.hs` | Compute both extrema in one recursive traversal |
| `List_DesignIndex.hs` | Preserve an index when looking up integers |
| `List_DesignIndexV2.hs` | Preserve an index when looking up strings |
| `List_DesignIndexV3.hs` | Preserve an index when looking up Booleans |
| `List_DesignIndexV4.hs` | Find the penultimate element without partial functions |
| `List_DesignInterleave.hs` | Alternate two integer lists and retain the remainder |
| `List_DesignInterleaveV2.hs` | Append two lists using only cons |
| `List_DesignInterleaveV3.hs` | Add corresponding list values and stop at the shorter list |
| `List_DesignInterleaveV4.hs` | Interleave strings while retaining an unmatched suffix |
| `List_DesignPrefix.hs` | Take only the initial even run |
| `List_DesignPrefixV2.hs` | Drop only the initial negative run |
| `List_DesignPrefixV3.hs` | Split at the first value below a threshold |
| `List_DesignPrefixV4.hs` | Safely remove the last element recursively |
| `List_DesignScale.hs` | Scale every integer recursively |
| `List_DesignScaleV2.hs` | Sum even values using explicit recursion |
| `List_DesignScaleV3.hs` | Transform each string into its length recursively |
| `List_DesignScaleV4.hs` | Reverse integers with a growing accumulator |
| `List_DesignSorted.hs` | Check non-increasing order with duplicates allowed |
| `List_DesignSortedV2.hs` | Check strictly decreasing order |
| `List_DesignSortedV3.hs` | Check non-decreasing order |
| `List_DesignSortedV4.hs` | Check strictly increasing characters |
| `List_DesignTakeDrop.hs` | Take a bounded prefix with a negative-count policy |
| `List_DesignTakeDropV2.hs` | Drop a bounded prefix with a negative-count policy |
| `List_DesignTakeDropV3.hs` | Split once at a bounded position |
| `List_DesignTakeDropV4.hs` | Take a prefix from a list of strings |
| `List_DesignThreshold.hs` | Select values strictly above a threshold |
| `List_DesignThresholdV2.hs` | Select positive values while preserving order |
| `List_DesignThresholdV3.hs` | Count values at least a threshold |
| `List_DesignThresholdV4.hs` | Test recursive membership with short-circuiting |
| `List_InsertionSort.hs` | Implement ascending insertion sort |
| `List_InsertionSortV2.hs` | Implement descending insertion sort |
| `List_InsertionSortV3.hs` | Implement lexicographically ascending insertion sort |
| `List_LengthSum.hs` | Use list recursion to count its elements |
| `List_LengthSumV2.hs` | Use list recursion to sum its elements |
| `List_LengthSumV3.hs` | Use list recursion to multiply its elements |
| `List_Maximum.hs` | Find a safe maximum |
| `List_MaximumV2.hs` | Find a safe minimum |
| `List_MaximumV3.hs` | Find a safe lexicographically greatest string |
| `List_Membership.hs` | Search a list using recursive equality tests |
| `List_MembershipV2.hs` | Count occurrences recursively |
| `List_MembershipV3.hs` | Delete the first matching element recursively |
| `List_Merge.hs` | Merge two ascending lists |
| `List_MergeV2.hs` | Merge two descending lists |
| `List_MergeV3.hs` | Merge two lexicographically ascending lists |
| `List_Reverse.hs` | Reverse a list by structural recursion |
| `List_ReverseV2.hs` | Reverse a list using an accumulator |
| `List_ReverseV3.hs` | Recognise palindromes using a recursive reverse |
| `List_TakeDrop.hs` | Implement takeR recursively |
| `List_TakeDropV2.hs` | Implement dropR recursively |
| `List_TakeDropV3.hs` | Implement splitR recursively |

## Guards and pattern matching

| File | Question |
| --- | --- |
| `Guard_AsPattern.hs` | Duplicate a list head with an as-pattern |
| `Guard_AsPatternV2.hs` | Keep or remove a head using an as-pattern |
| `Guard_AsPatternV3.hs` | Retain a tuple while extracting its first field |
| `Guard_Grade.hs` | Classify marks using ordered guards |
| `Guard_GradeV2.hs` | Classify marks using ordered guards |
| `Guard_GradeV3.hs` | Classify marks using ordered guards |
| `Guard_LeapYear.hs` | Recognise Gregorian leap years |
| `Guard_LeapYearV2.hs` | Find the number of days in February |
| `Guard_LeapYearV3.hs` | Classify leap years and ordinary centuries |
| `Guard_Sign.hs` | Write a sign function with guards |
| `Guard_SignV2.hs` | Clamp an integer using guards |
| `Guard_SignV3.hs` | Compute an absolute difference with guards |
| `Guard_TupleCase.hs` | Classify a pair of Boolean flags with case |
| `Guard_TupleCaseV2.hs` | Use case on coordinate tests |
| `Guard_TupleCaseV3.hs` | Classify a pair using guarded case alternatives |

## List comprehensions

| File | Question |
| --- | --- |
| `Comp_Cartesian.hs` | Build a Cartesian product |
| `Comp_CartesianV2.hs` | Build a table of pairwise sums |
| `Comp_CartesianV3.hs` | Generate index pairs above the diagonal |
| `Comp_Factors.hs` | Find all positive factors |
| `Comp_FactorsV2.hs` | Find proper positive factors (excluding n) |
| `Comp_FactorsV3.hs` | Find even positive factors |
| `Comp_Filter.hs` | Select even numbers with a comprehension |
| `Comp_FilterV2.hs` | Select multiples of three with a comprehension |
| `Comp_FilterV3.hs` | Select valid passing marks with a comprehension |
| `Comp_Primes.hs` | Test primality with a factor comprehension |
| `Comp_PrimesV2.hs` | Generate primes up to a limit |
| `Comp_PrimesV3.hs` | Generate prime pairs separated by two |
| `Comp_Pythagorean.hs` | Generate all ordered-side triples |
| `Comp_PythagoreanV2.hs` | Generate primitive triples |
| `Comp_PythagoreanV3.hs` | Generate triples bounded by perimeter |
| `Comp_Squares.hs` | Generate squares with a comprehension |
| `Comp_SquaresV2.hs` | Generate cubes with a comprehension |
| `Comp_SquaresV3.hs` | Generate number-square pairs with a comprehension |
| `Comp_StringProcessing.hs` | Remove spaces with a string comprehension |
| `Comp_StringProcessingV2.hs` | Extract lowercase vowels with a comprehension |
| `Comp_StringProcessingV3.hs` | Extract names of passing students |

## Higher-order functions

| File | Question |
| --- | --- |
| `Hof_Composition.hs` | Compose filtering and summation |
| `Hof_CompositionV2.hs` | Compose mapping and a product |
| `Hof_CompositionV3.hs` | Compose word lengths and a sum |
| `Hof_Filter.hs` | Use filter to retain marks at least 50 |
| `Hof_FilterV2.hs` | Use filter to retain multiples of three |
| `Hof_FilterV3.hs` | Use filter to retain strings of length at least three |
| `Hof_Foldl.hs` | Compute left-associated subtraction with foldl |
| `Hof_FoldlV2.hs` | Compute a decimal digit value with foldl |
| `Hof_FoldlV3.hs` | Compute a reversed list with foldl |
| `Hof_Foldr.hs` | Compute right-associated subtraction |
| `Hof_FoldrV2.hs` | Compute a weighted right fold |
| `Hof_FoldrV3.hs` | Compute a product by right fold |
| `Hof_Map.hs` | Use map to add three |
| `Hof_MapV2.hs` | Use map to square each value |
| `Hof_MapV3.hs` | Use map to subtract each value from ten |
| `Hof_Scanl.hs` | Produce running totals using scanl |
| `Hof_ScanlV2.hs` | Produce running products using scanl |
| `Hof_ScanlV3.hs` | Produce running differences using scanl |
| `Hof_TakeWhile.hs` | Take the initial run of values below four |
| `Hof_TakeWhileV2.hs` | Take the initial run of even values |
| `Hof_TakeWhileV3.hs` | Take the initial run of non-negative values |
| `Hof_ZipWith.hs` | Calculate pairwise sums using zipWith |
| `Hof_ZipWithV2.hs` | Calculate pairwise products using zipWith |
| `Hof_ZipWithV3.hs` | Calculate pairwise differences using zipWith |

## Custom data types

| File | Question |
| --- | --- |
| `Data_BinaryTree.hs` | Implement binary tree insert |
| `Data_BinaryTreeV2.hs` | Implement binary tree size |
| `Data_BinaryTreeV3.hs` | Implement binary tree inorder |
| `Data_Enumeration.hs` | Define next over an enumeration |
| `Data_EnumerationV2.hs` | Define weekend over an enumeration |
| `Data_EnumerationV3.hs` | Define promote over an enumeration |
| `Data_Expression.hs` | Evaluate an expression tree with addition and multiplication |
| `Data_ExpressionV2.hs` | Evaluate an expression tree with addition and subtraction |
| `Data_ExpressionV3.hs` | Evaluate an expression tree with addition and maximum |
| `Data_Optional.hs` | Write safeHead using a Maybe-like type |
| `Data_OptionalV2.hs` | Write divideSafe using a Maybe-like type |
| `Data_OptionalV3.hs` | Write mapOptional using a Maybe-like type |
| `Data_Records.hs` | Use a Student record to award |
| `Data_RecordsV2.hs` | Use a Student record to resetMark |
| `Data_RecordsV3.hs` | Use a Student record to passed |
| `Data_Shapes.hs` | Calculate area by matching shape constructors |
| `Data_ShapesV2.hs` | Calculate volume by matching shape constructors |
| `Data_ShapesV3.hs` | Calculate perimeter by matching shape constructors |

## Polymorphism and type classes

| File | Question |
| --- | --- |
| `Poly_EqInstance.hs` | Write Item equality using code fields |
| `Poly_EqInstanceV2.hs` | Write Item equality using label fields |
| `Poly_EqInstanceV3.hs` | Write Item equality using both fields |
| `Poly_Equality.hs` | Test whether all list elements are equal |
| `Poly_EqualityV2.hs` | Look up a key with an Eq constraint |
| `Poly_EqualityV3.hs` | Test whether two lists share an element |
| `Poly_Ordering.hs` | Order a pair with an Ord constraint |
| `Poly_OrderingV2.hs` | Check whether a polymorphic list is sorted |
| `Poly_OrderingV3.hs` | Find a safe polymorphic minimum |
| `Poly_Rearrange.hs` | Swap the components of a polymorphic pair |
| `Poly_RearrangeV2.hs` | Duplicate a value polymorphically |
| `Poly_RearrangeV3.hs` | Project first components polymorphically |
| `Poly_ShowInstance.hs` | Write Show by hand for Result |
| `Poly_ShowInstanceV2.hs` | Write Show by hand for Switch |
| `Poly_ShowInstanceV3.hs` | Write Show by hand for Direction |

## Lazy evaluation and infinite data

| File | Question |
| --- | --- |
| `Lazy_ConstantStream.hs` | Define the infinite ones stream |
| `Lazy_ConstantStreamV2.hs` | Define the infinite zeros stream |
| `Lazy_ConstantStreamV3.hs` | Define the infinite letters stream |
| `Lazy_Cycle.hs` | Use cycle for a repeating three-number pattern |
| `Lazy_CycleV2.hs` | Use cycle for alternating letters |
| `Lazy_CycleV3.hs` | Use cycle for alternating Boolean values |
| `Lazy_Fibonacci.hs` | Define a self-referential Fibonacci stream |
| `Lazy_FibonacciV2.hs` | Define a self-referential Lucas stream |
| `Lazy_FibonacciV3.hs` | Define a self-referential shifted Fibonacci stream |
| `Lazy_Iterate.hs` | Use iterate to produce powers of two |
| `Lazy_IterateV2.hs` | Use iterate to produce multiples of three |
| `Lazy_IterateV3.hs` | Use iterate to produce the recurrence n becomes 2*n+1 from zero |
| `Lazy_NumsFrom.hs` | Generate successive integers lazily |
| `Lazy_NumsFromV2.hs` | Generate integers increasing by two lazily |
| `Lazy_NumsFromV3.hs` | Generate successive descending integers lazily |
| `Lazy_Primes.hs` | Generate primes with a lazy sieve |
| `Lazy_PrimesV2.hs` | Observe prime gaps from a lazy sieve |
| `Lazy_PrimesV3.hs` | Generate twin primes from an infinite prime stream |

## Proofs about programs

| File | Question |
| --- | --- |
| `Proof_AppendMeasure.hs` | Prove that append preserves length combination |
| `Proof_AppendMeasureV2.hs` | Prove that append preserves sum combination |
| `Proof_AppendMeasureV3.hs` | Prove that append preserves product combination |
| `Proof_MapLaw.hs` | Prove mapping id leaves a list unchanged |
| `Proof_MapLawV2.hs` | Prove the map composition law |
| `Proof_MapLawV3.hs` | Prove mapping preserves list length |
| `Proof_NumberSum.hs` | Prove the formula for twice the sum to n |
| `Proof_NumberSumV2.hs` | Prove the formula for the sum of the first n odd numbers |
| `Proof_NumberSumV3.hs` | Prove the formula for the sum of the first n positive even numbers |
| `Proof_TreeMirror.hs` | Prove mirroring preserves tree size |
| `Proof_TreeMirrorV2.hs` | Prove mirroring preserves tree height |
| `Proof_TreeMirrorV3.hs` | Prove mirroring a tree twice restores it |

## Arithmetic and numeric operators

| File | Question |
| --- | --- |
| `Arith_Conversions.hs` | Convert before dividing |
| `Arith_ConversionsV2.hs` | Compare rounding rules on signed inputs |
| `Arith_ConversionsV3.hs` | Widen an Int before squaring |
| `Arith_ConversionsV4.hs` | Compare truncation before and after division |
| `Arith_DivisionPairs.hs` | Check the divMod reconstruction identity |
| `Arith_DivisionPairsV2.hs` | Check the quotRem reconstruction identity |
| `Arith_DivisionPairsV3.hs` | Check the divMod reconstruction identity |
| `Arith_DivisionPairsV4.hs` | Check the quotRem reconstruction identity |
| `Arith_ExponentChoice.hs` | Use integral exponents with ^ |
| `Arith_ExponentChoiceV2.hs` | Use signed integral exponents with ^^ |
| `Arith_ExponentChoiceV3.hs` | Check floating powers with a tolerance |
| `Arith_ExponentChoiceV4.hs` | Compare non-negative power operators |
| `Arith_ExpressionTrace.hs` | Trace arithmetic and Boolean precedence |
| `Arith_ExpressionTraceV2.hs` | Construct an expression from a price specification |
| `Arith_ExpressionTraceV3.hs` | Expose the negative repeated-addition counterexample |
| `Arith_ExpressionTraceV4.hs` | Distinguish subtract from negation |
| `Arith_FloatingDomain.hs` | Test absolute tolerance |
| `Arith_FloatingDomainV2.hs` | Test combined relative and absolute tolerance |
| `Arith_FloatingDomainV3.hs` | Classify floating domain results |
| `Arith_FloatingDomainV4.hs` | Check elementary functions at exact reference points |
| `Arith_SignedDivision.hs` | Apply div to signed integers |
| `Arith_SignedDivisionV2.hs` | Apply mod to signed integers |
| `Arith_SignedDivisionV3.hs` | Apply quot to signed integers |
| `Arith_SignedDivisionV4.hs` | Apply rem to signed integers |

## First programs and the first lab

| File | Note |
| --- | --- |
| `FirstProgram.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |
| `FunctionPractice.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |
| `Lab01Solution.hs` | Introductory file; it may read from the keyboard, so run it in a terminal. |
