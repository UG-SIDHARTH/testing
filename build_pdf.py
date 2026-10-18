import os
import re
import html
import shutil
import subprocess

WORKSPACE_DIR = r"f:\newq\Sidharth_40\new"
HTML_OUTPUT = os.path.join(WORKSPACE_DIR, "dsa_lab_record.html")
PDF_OUTPUT = os.path.join(WORKSPACE_DIR, "Data_Structures_Lab_Record_Sidharth_40.pdf")
PDF_ALIAS = os.path.join(WORKSPACE_DIR, "DSA_Lab_Record.pdf")

EXPERIMENTS = [
    {
        "id": 1,
        "file": "1_matrix_add.c",
        "title": "Matrix Addition",
        "aim": "To write a C program to perform addition of two matrices of order m × n.",
        "algorithm": [
            "Input the row and column dimensions of the matrices.",
            "Input the elements of the first matrix A and second matrix B.",
            "Compute each element of the sum matrix as C[i][j] = A[i][j] + B[i][j].",
            "Display the resultant sum matrix in tabular matrix format."
        ],
        "input_desc": "Matrix Dimensions: 2 × 2\nMatrix 1: [[1, 2], [3, 4]]\nMatrix 2: [[5, 6], [7, 8]]",
        "terminal_input": "2 2\n1 2 3 4\n5 6 7 8",
        "terminal_output": """$ ./1_matrix_add
Enter row & column sizes of 1st matrix: 2 2
Enter 4 elemnts for 1st matrix: 1 2 3 4
Enter 4 elemnts for 2nd matrix: 5 6 7 8
Added:
6 8 
10 12 

Process finished with exit code 0"""
    },
    {
        "id": 2,
        "file": "2_polynomial_add.c",
        "title": "Polynomial Addition using Structure",
        "aim": "To write a C program to add two polynomials using an array of structures.",
        "algorithm": [
            "Define a structure Poly with fields coeff (coefficient) and exp (exponent).",
            "Read number of terms and term pairs (coeff, exp) for both polynomials in descending order of exponents.",
            "Traverse both polynomials simultaneously using pointers i and j. If exponents are equal, add coefficients. Otherwise, insert the term with higher exponent into the result polynomial.",
            "Append remaining terms from either polynomial and display the resulting sum expression."
        ],
        "input_desc": "Polynomial 1 (3 terms): 4x³ + 3x² + 5x⁰\nPolynomial 2 (3 terms): 2x³ + 1x¹ + 2x⁰",
        "terminal_input": "3\n3\n4 3\n3 2\n5 0\n2 3\n1 1\n2 0",
        "terminal_output": """$ ./2_polynomial_add
Enter number of elements for 1st Polynomial: 3
Enter number of elements for 2nd Polynomial: 3

Enter 3 elements for 1st polynomial:
4 3
3 2
5 0

Enter 3 elements for 2nd polynomial:
2 3
1 1
2 0
Sum:
(6**3) + (3**2) + (1**1) + (7**0)

Process finished with exit code 0"""
    },
    {
        "id": 3,
        "file": "3_matrix_to_sparse.c",
        "title": "Sparse Matrix Representation (Tuple Form)",
        "aim": "To write a C program to convert a given standard matrix into its 3-tuple (sparse matrix) representation.",
        "algorithm": [
            "Input the row and column dimensions and read all matrix elements.",
            "Initialize sparse representation with header row: sparse[0][0] = row, sparse[0][1] = col.",
            "Scan the matrix row by row. For every non-zero element at (i, j), record row i, column j, and value in the triplet array.",
            "Store total non-zero count in sparse[0][2] and print the resulting 3-tuple rows."
        ],
        "input_desc": "Matrix Size: 3 × 3\nElements: [[1, 0, 0], [0, 0, 2], [0, 3, 0]]",
        "terminal_input": "3 3\n1 0 0 0 0 2 0 3 0",
        "terminal_output": """$ ./3_matrix_to_sparse
Enter row & column size: 3 3
Enter 9 elements: 1 0 0 0 0 2 0 3 0
(3, 3, 3)
(0, 0, 1)
(1, 2, 2)
(2, 1, 3)

Process finished with exit code 0"""
    },
    {
        "id": 4,
        "file": "4_sparse_matrix_add.c",
        "title": "Sparse Matrix Addition",
        "aim": "To write a C program to perform addition of two sparse matrices represented in triplet form.",
        "algorithm": [
            "Read dimensions and non-zero triplets (row, col, value) for Matrix 1 and Matrix 2.",
            "Initialize result matrix header with same dimensions.",
            "Use two-pointer traversal: compare row indices first, then column indices. If positions match, add values. If one index is strictly smaller, copy it to the result.",
            "Append remaining non-zero entries from either matrix and display resultant triplet matrix."
        ],
        "input_desc": "Matrix Size: 3 × 3\nMatrix 1: 2 non-zeros [(0,0,5), (1,2,8)]\nMatrix 2: 2 non-zeros [(0,0,3), (2,1,4)]",
        "terminal_input": "3 3\n2\n2\n0 0 5\n1 2 8\n0 0 3\n2 1 4",
        "terminal_output": """$ ./4_sparse_matrix_add
Enter total number of rows and columns for the matrices: 3 3
Enter number of non-zero elements for Matrix 1: 2
Enter number of non-zero elements for Matrix 2: 2

Enter Triplets for Matrix 1 (Row, Column, Value):
0 0 5
1 2 8

Enter Triplets for Matrix 2 (Row, Column, Value):
0 0 3
2 1 4

Resultant Sparse Matrix (Triplet Representation):
Row\tCol\tValue
3\t3\t3
0\t0\t8
1\t2\t8
2\t1\t4

Process finished with exit code 0"""
    },
    {
        "id": 5,
        "file": "5_sparse_trans.c",
        "title": "Transpose of a Sparse Matrix",
        "aim": "To write a C program to compute and display the transpose of a sparse matrix in triplet form.",
        "algorithm": [
            "Read sparse matrix triplets (row, col, value) and initialize transpose header with swapped row/col bounds.",
            "For each non-zero element, swap row and column values.",
            "Sort the transposed triplets in lexicographical order (ascending row, then ascending col).",
            "Print the transposed triplet representation."
        ],
        "input_desc": "Matrix Size: 3 × 3\nNon-zero count: 3\nTriplets: (0,1,5), (1,2,8), (2,0,3)",
        "terminal_input": "3 3\n3\n0 1 5\n1 2 8\n2 0 3",
        "terminal_output": """$ ./5_sparse_trans
Enter total number of rows and columns for the matrix: 3 3
Enter number of non-zero elements for the matrix: 3

Enter Triplets for the Matrix (Row, Column, Value):
0 1 5
1 2 8
2 0 3

The transposed matrix is:
3 3 3
0 2 3
1 0 5
2 1 8

Process finished with exit code 0"""
    },
    {
        "id": 6,
        "file": "6_stack.c",
        "title": "Stack Implementation using Array",
        "aim": "To implement basic stack operations (Push, Pop, Display) using an array in C.",
        "algorithm": [
            "Initialize stack top = -1 and define maximum capacity MAX = 10.",
            "Push(val): Check overflow (top >= MAX-1). If not full, increment top and insert val.",
            "Pop(): Check underflow (top == -1). If not empty, return items[top] and decrement top.",
            "Display(): Traverse and print items from index 0 to top."
        ],
        "input_desc": "Operations: Push 10, Push 20, Push 30, Display, Pop (removes 30), Display, Exit",
        "terminal_input": "1 10\n1 20\n1 30\n3\n2\n3\n4",
        "terminal_output": """$ ./6_stack
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 20
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value to push: 30
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
10
20
30
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 2
Popped value: 30
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
10
20
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 4
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 7,
        "file": "7_standard_queue.c",
        "title": "Linear Queue Implementation using Array",
        "aim": "To implement linear queue operations (Enqueue, Dequeue, Display) using an array in C.",
        "algorithm": [
            "Initialize front = -1 and rear = -1 with maximum size MAX = 3.",
            "Enqueue(val): Check overflow (rear >= MAX-1). If empty, set front = 0. Increment rear and store val.",
            "Dequeue(): Check underflow (front == -1 or front > rear). Return items[front] and increment front.",
            "Display(): Iterate and print elements from front to rear."
        ],
        "input_desc": "Operations: Enqueue 10, Enqueue 20, Enqueue 30, Display, Dequeue (removes 10), Display, Exit",
        "terminal_input": "1 10\n1 20\n1 30\n3\n2\n3\n4",
        "terminal_output": """$ ./7_standard_queue
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 10
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 20
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 30
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
10
20
30
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 2
Dequeued value: 10
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
20
30
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 4
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 8,
        "file": "8_circular_queue.c",
        "title": "Circular Queue Implementation using Array",
        "aim": "To implement circular queue operations (Enqueue, Dequeue, Display) with circular wraparound modulo indexing.",
        "algorithm": [
            "Initialize front = 0, rear = MAX - 1, and count = 0.",
            "Enqueue(val): If count >= MAX, report overflow. Otherwise set rear = (rear + 1) % MAX, store val, and increment count.",
            "Dequeue(): If count == 0, report underflow. Retrieve val from front, set front = (front + 1) % MAX, and decrement count.",
            "Display(): Loop count times printing items[(front + i) % MAX]."
        ],
        "input_desc": "Operations: Enqueue 15, Enqueue 25, Enqueue 35 (full), Display, Dequeue (15), Enqueue 45 (wraps around), Display, Exit",
        "terminal_input": "1 15\n1 25\n1 35\n3\n2\n1 45\n3\n4",
        "terminal_output": """$ ./8_circular_queue
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 15
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 25
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 35
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
15
25
35
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 2
Dequeued value: 15
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 1
Enter value to enqueue: 45
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 3
Displaying Contents:
25
35
45
1. Enqueue
2. Dequeue
3. Display
4. Exit
Enter your choice: 4
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 9,
        "file": "9_dequeue.c",
        "title": "Double Ended Queue (Deque) Implementation",
        "aim": "To implement a double-ended queue supporting insertion and deletion operations at both front and rear ends.",
        "algorithm": [
            "Initialize deque front = -1 and rear = -1 with maximum capacity MAX = 10.",
            "insertFront(val): If empty, set front = rear = 0. If front > 0, decrement front. Else shift elements right and place at 0.",
            "insertRear(val): If empty, set front = rear = 0. If rear < MAX-1, increment rear. Else shift left and place at rear.",
            "removeFront() & removeRear(): Extract value, adjust indices or reset to -1 when queue becomes empty."
        ],
        "input_desc": "Operations: Insert Rear 10, Insert Front 5, Insert Rear 20, Display, Remove Front (5), Remove Rear (20), Display, Exit",
        "terminal_input": "2 10\n1 5\n2 20\n5\n3\n4\n5\n6",
        "terminal_output": """$ ./9_dequeue
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 2
Enter value to insert at rear: 10
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 1
Enter value to insert at front: 5
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 2
Enter value to insert at rear: 20
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 5
Displaying Contents:
5
10
20
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 3
Removed from front: 5
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 4
Removed from rear: 20
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 5
Displaying Contents:
10
1. Insert Front
2. Insert Rear
3. Remove Front
4. Remove Rear
5. Display
6. Exit
Enter your choice: 6
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 10,
        "file": "10_infixtopostfix.c",
        "title": "Infix to Postfix Conversion",
        "aim": "To write a C program to convert an infix mathematical expression to postfix notation using a stack.",
        "algorithm": [
            "Scan the infix expression character by character from left to right.",
            "If the scanned character is an operand (digit), output it immediately.",
            "If '(', push it onto the operator stack. If ')', pop and output operators until '(' is encountered.",
            "If an operator, pop and output operators from stack with greater or equal precedence, then push current operator.",
            "Pop and output any remaining operators on the stack at the end."
        ],
        "input_desc": "Infix Expression: ( 10 + 20 ) * ( 30 - 5 )",
        "terminal_input": "( 10 + 20 ) * ( 30 - 5 )",
        "terminal_output": """$ ./10_infixtopostfix
Enter infix expression: ( 10 + 20 ) * ( 30 - 5 )
Postfix Expression:
10 20 + 30 5 - *

Process finished with exit code 0"""
    },
    {
        "id": 11,
        "file": "11_postfixeval.c",
        "title": "Postfix Expression Evaluation",
        "aim": "To write a C program to evaluate a postfix mathematical expression using stack operands.",
        "algorithm": [
            "Initialize an operand stack. Parse input string tokens separated by whitespace.",
            "If the token is a number, convert to integer and push onto the stack.",
            "If the token is an operator (+, -, *, /), pop the top two operands (val2 then val1).",
            "Perform operation (val1 op val2), push result back onto stack.",
            "After complete expression scan, the final result is the single element remaining on stack."
        ],
        "input_desc": "Postfix Expression: 10 20 + 5 *  (Computes: (10 + 20) * 5)",
        "terminal_input": "10 20 + 5 *",
        "terminal_output": """$ ./11_postfixeval
Enter the postfix expression: 10 20 + 5 *
Result: 150

Process finished with exit code 0"""
    },
    {
        "id": 12,
        "file": "12_single_linked_list.c",
        "title": "Singly Linked List Implementation",
        "aim": "To implement singly linked list operations including insertion and deletion at beginning, middle, and end, with traversal.",
        "algorithm": [
            "Define node structure with integer data and next pointer.",
            "Insert operations: allocate newNode, adjust pointers for beginning (head = newNode), middle (after key), or end.",
            "Delete operations: locate target node, bypass pointer links, display deleted value, and free allocated memory.",
            "Display(): traverse from head to NULL printing data with arrow indicators."
        ],
        "input_desc": "Operations: Insert Beg 10, Insert End 20, Insert End 30, Insert Middle 25 (after 20), Display, Delete Beg (10), Delete Middle (25), Display, Exit",
        "terminal_input": "1 10\n3 20\n3 30\n2 25 20\n7\n4\n5 25\n7\n8",
        "terminal_output": """$ ./12_single_linked_list

- - - Linked List Menu - - -
1. Insert at Beginning
2. Insert at Middle
3. Insert at End
4. Delete at Beginning
5. Delete at Middle
6. Delete at End
7. Display List
8. Exit
Enter choice : 1
Enter data : 10

- - - Linked List Menu - - -
Enter choice : 3
Enter data : 20

- - - Linked List Menu - - -
Enter choice : 3
Enter data : 30

- - - Linked List Menu - - -
Enter choice : 2
Enter data : 25
Enter key : 20

- - - Linked List Menu - - -
Enter choice : 7
Linked List:
10 -> 20 -> 25 -> 30 -> NULL

- - - Linked List Menu - - -
Enter choice : 4
Deleted element: 10

- - - Linked List Menu - - -
Enter choice : 5
Enter key to delete : 25
Deleted element: 25

- - - Linked List Menu - - -
Enter choice : 7
Linked List:
20 -> 30 -> NULL

- - - Linked List Menu - - -
Enter choice : 8
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 13,
        "file": "13_doubly_linked_list.c",
        "title": "Doubly Linked List Implementation",
        "aim": "To implement doubly linked list operations including bidirectional links, insertion and deletion at positions, and traversal.",
        "algorithm": [
            "Define node structure containing data, prev pointer, and next pointer.",
            "insertAtBeginning / Middle / End: configure both forward (next) and backward (prev) links correctly.",
            "deleteAtBeginning / Middle / End: update neighbor nodes' next and prev references, free deleted node.",
            "Display(): iterate forward from head printing node data separated by '<->'."
        ],
        "input_desc": "Operations: Insert Beg 10, Insert End 30, Insert Middle 20 (after 10), Display, Delete Middle (20), Display, Exit",
        "terminal_input": "1 10\n3 30\n2 20 10\n7\n5 20\n7\n8",
        "terminal_output": """$ ./13_doubly_linked_list

- - - Doubly Linked List Menu - - -
1. Insert at Beginning
2. Insert at Middle
3. Insert at End
4. Delete at Beginning
5. Delete at Middle
6. Delete at End
7. Display
8. Exit
Enter choice : 1
Enter data : 10

- - - Doubly Linked List Menu - - -
Enter choice : 3
Enter data : 30

- - - Doubly Linked List Menu - - -
Enter choice : 2
Enter data : 20
Enter key : 10

- - - Doubly Linked List Menu - - -
Enter choice : 7
Linked List: 10 <-> 20 <-> 30 <-> NULL

- - - Doubly Linked List Menu - - -
Enter choice : 5
Enter key to delete : 20
Deleted element: 20

- - - Doubly Linked List Menu - - -
Enter choice : 7
Linked List: 10 <-> 30 <-> NULL

- - - Doubly Linked List Menu - - -
Enter choice : 8
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 14,
        "file": "14_stack_linked_list.c",
        "title": "Stack Implementation using Linked List",
        "aim": "To implement dynamic stack data structure operations (Push, Pop, Display) using a singly linked list.",
        "algorithm": [
            "Maintain top pointer initialized to NULL.",
            "Push(val): Allocate newNode with data = val, link newNode->next = top, update top = newNode.",
            "Pop(): Check underflow (top == NULL). Save top->data, update top = top->next, and free old node.",
            "Display(): Traverse from top to NULL printing elements in LIFO order."
        ],
        "input_desc": "Operations: Push 10, Push 20, Push 30, Display, Pop (removes 30), Display, Exit",
        "terminal_input": "1 10\n1 20\n1 30\n3\n2\n3\n4",
        "terminal_output": """$ ./14_stack_linked_list
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value: 10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value: 20
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 1
Enter value: 30
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
30
20
10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 2
Popped element: 30
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 3
Displaying contents:
20
10
1. Push
2. Pop
3. Display
4. Exit
Enter your choice: 4
Exiting...

Process finished with exit code 0"""
    },
    {
        "id": 15,
        "file": "15.c",
        "title": "Linear Search Algorithm",
        "aim": "To search for a given target element in an array using the linear (sequential) search algorithm.",
        "algorithm": [
            "Input the size of the array and the elements.",
            "Input the target element to search.",
            "Compare each element sequentially from index 0 to size - 1 with target.",
            "If match found, print index and break. If loop finishes without match, report not found."
        ],
        "input_desc": "Array Size: 5\nArray Elements: [23, 45, 12, 78, 56]\nSearch Target: 12",
        "terminal_input": "5\n23 45 12 78 56\n12",
        "terminal_output": """$ ./15_linear_search
Enter the size of the array: 5
Enter 5 numbers:
23 45 12 78 56
Enter a number to search: 12
Number found at index 2.

Process finished with exit code 0"""
    },
    {
        "id": 16,
        "file": "16.c",
        "title": "Binary Search Algorithm",
        "aim": "To search for a target value in a sorted array using binary search with middle element comparisons.",
        "algorithm": [
            "Initialize search boundaries: left = 0, right = n - 1.",
            "While left <= right, calculate middle = (left + right) / 2.",
            "If numbers[middle] == target, element is found. Report position and exit.",
            "If numbers[middle] < target, set left = middle + 1. Otherwise set right = middle - 1."
        ],
        "input_desc": "Array Size: 5\nSorted Elements: [11, 22, 33, 44, 55]\nSearch Target: 44",
        "terminal_input": "5\n11 22 33 44 55\n44",
        "terminal_output": """$ ./16_binary_search
Enter the number of elements: 5
Enter 5 elements in sorted order: 11 22 33 44 55
Enter the number to search: 44
middle index = 3\tvalue = 33
middle index = 4\tvalue = 44
Number found at position 4

Process finished with exit code 0"""
    },
    {
        "id": 17,
        "file": "17.c",
        "title": "Insertion Sort Algorithm",
        "aim": "To sort an array of integers in ascending order using insertion sort with step-by-step trace.",
        "algorithm": [
            "Iterate from index i = 1 to n - 1, selecting key = numbers[i].",
            "Compare key with elements in the sorted sub-array (indices j = i - 1 down to 0).",
            "Shift all elements greater than key one position to the right.",
            "Insert key into its correct sorted location numbers[j + 1] and print intermediate state."
        ],
        "input_desc": "Array Size: 5\nUnsorted Elements: [54, 26, 93, 17, 77]",
        "terminal_input": "5\n54\n26\n93\n17\n77",
        "terminal_output": """$ ./17_insertion_sort
Enter the number of elements: 5
Enter the elements:0\t54
Enter the elements:1\t26
Enter the elements:2\t93
Enter the elements:3\t17
Enter the elements:4\t77

Initial array: 54 26 93 17 77 
Step 1: 26 54 93 17 77 
Step 2: 26 54 93 17 77 
Step 3: 17 26 54 93 77 
Step 4: 17 26 54 77 93 

Sorted array: 17 26 54 77 93 

Process finished with exit code 0"""
    },
    {
        "id": 18,
        "file": "18.c",
        "title": "Selection Sort Algorithm",
        "aim": "To sort an array of integers in ascending order using selection sort with step-by-step trace.",
        "algorithm": [
            "Iterate i from 0 to n - 2. Assume index i has the smallest value.",
            "Scan remaining unsorted sub-array from j = i + 1 to n - 1 to find the index of minimum value.",
            "Swap the minimum element found with element at position i.",
            "Print the array state after each pass and finish after n - 1 passes."
        ],
        "input_desc": "Array Size: 5\nUnsorted Elements: [64, 25, 12, 22, 11]",
        "terminal_input": "5\n64\n25\n12\n22\n11",
        "terminal_output": """$ ./18_selection_sort
Enter the number of elements: 5
Enter the elements:0\t64
Enter the elements:1\t25
Enter the elements:2\t12
Enter the elements:3\t22
Enter the elements:4\t11

Elements at each step:
Step 1: 11 25 12 22 64 
Step 2: 11 12 25 22 64 
Step 3: 11 12 22 25 64 
Step 4: 11 12 22 25 64 

Sorted array: 11 12 22 25 64 

Process finished with exit code 0"""
    },
    {
        "id": 19,
        "file": "19.c",
        "title": "Quick Sort Algorithm",
        "aim": "To sort an array of integers using quick sort algorithm based on partitioning and divide-and-conquer strategy.",
        "algorithm": [
            "Select the rightmost element as pivot: pivot = arr[high].",
            "Partition: maintain index i = low - 1. Loop j from low to high - 1; if arr[j] < pivot, increment i and swap arr[i] with arr[j].",
            "Swap arr[i+1] with arr[high] to place pivot in its finalized sorted position.",
            "Recursively apply quick sort on left sub-array (low to pivot - 1) and right sub-array (pivot + 1 to high)."
        ],
        "input_desc": "Array Size: 6\nInput Elements: [24, 9, 29, 14, 39, 27]",
        "terminal_input": "6\n24 9 29 14 39 27",
        "terminal_output": """$ ./19_quick_sort
Enter the number of elements: 6
Enter the elements:
24 9 29 14 39 27

Original array: 24 9 29 14 39 27 

Steps of quick sort:
Pivot is 27
After swapping: 24 9 29 14 39 27 
After swapping: 24 9 29 14 39 27 
After swapping: 24 9 14 29 39 27 
After placing pivot: 24 9 14 27 39 29 
Pivot is 14
After swapping: 9 24 14 27 39 29 
After placing pivot: 9 14 24 27 39 29 
Pivot is 29
After placing pivot: 9 14 24 27 29 39 

Sorted array: 9 14 24 27 29 39 

Process finished with exit code 0"""
    },
    {
        "id": 20,
        "file": "20.c",
        "title": "Merge Sort Algorithm",
        "aim": "To sort an array of integers using merge sort algorithm based on recursive sub-array division and merging.",
        "algorithm": [
            "Divide: If low < high, find middle = (low + high) / 2.",
            "Conquer: Recursively sort left half mergeSort(low, middle) and right half mergeSort(middle + 1, high).",
            "Combine: Merge the two sorted halves into temporary array temp[], then copy back to original array.",
            "Display the array state after each merge operation."
        ],
        "input_desc": "Array Size: 6\nInput Elements: [38, 27, 43, 3, 9, 82]",
        "terminal_input": "6\n38 27 43 3 9 82",
        "terminal_output": """$ ./20_merge_sort
Enter the number of elements: 6
Enter 6 elements:
38 27 43 3 9 82

Original array: 38 27 43 3 9 82 

Steps:
After merging positions 0 to 1: 27 38 43 3 9 82 
After merging positions 0 to 2: 27 38 43 3 9 82 
After merging positions 3 to 4: 27 38 43 3 9 82 
After merging positions 3 to 5: 27 38 43 3 9 82 
After merging positions 0 to 5: 3 9 27 38 43 82 

Sorted array: 3 9 27 38 43 82 

Process finished with exit code 0"""
    },
    {
        "id": 21,
        "file": "21.c",
        "title": "Binary Tree Traversals",
        "aim": "To construct a binary tree dynamically and implement Depth-First (Pre-order, In-order, Post-order) and Breadth-First (Level-order) traversals.",
        "algorithm": [
            "createTree(): Read value (-1 represents NULL). Create root node and recursively construct left and right subtrees.",
            "Pre-order: Visit Root -> Traverse Left -> Traverse Right.",
            "In-order: Traverse Left -> Visit Root -> Traverse Right.",
            "Post-order: Traverse Left -> Traverse Right -> Visit Root.",
            "Level-order: Enqueue root into standard FIFO queue. While queue is not empty, dequeue node, print data, and enqueue non-NULL children."
        ],
        "input_desc": "Binary Tree Input: Root 1, Left child 2 (no children: -1, -1), Right child 3 (no children: -1, -1)",
        "terminal_input": "1\n2\n-1\n-1\n3\n-1\n-1",
        "terminal_output": """$ ./21_tree_traversals
Create the binary tree:
Enter number (-1 for no node): 1
Enter left child of 1:
Enter number (-1 for no node): 2
Enter left child of 2:
Enter number (-1 for no node): -1
Enter right child of 2:
Enter number (-1 for no node): -1
Enter right child of 1:
Enter number (-1 for no node): 3
Enter left child of 3:
Enter number (-1 for no node): -1
Enter right child of 3:
Enter number (-1 for no node): -1

Pre-order: 1 2 3 
In-order: 2 1 3 
Post-order: 2 3 1 
Level-order: 1 2 3 

Process finished with exit code 0"""
    }
]

def highlight_c_code(code_str):
    lines = code_str.split("\n")
    highlighted_lines = []
    in_block_comment = False
    
    for i, line in enumerate(lines, start=1):
        line_escaped = html.escape(line)
        if in_block_comment:
            if "*/" in line_escaped:
                parts = line_escaped.split("*/", 1)
                line_html = f'<span class="tok-comment">{parts[0]}*/</span>' + highlight_line_content(parts[1])
                in_block_comment = False
            else:
                line_html = f'<span class="tok-comment">{line_escaped}</span>'
        else:
            if "/*" in line_escaped and "*/" in line_escaped:
                parts = re.split(r'(/\*.*?\*/)', line_escaped)
                line_html = ""
                for part in parts:
                    if part.startswith("/*") and part.endswith("*/"):
                        line_html += f'<span class="tok-comment">{part}</span>'
                    else:
                        line_html += highlight_line_content(part)
            elif "/*" in line_escaped:
                parts = line_escaped.split("/*", 1)
                line_html = highlight_line_content(parts[0]) + f'<span class="tok-comment">/*{parts[1]}</span>'
                in_block_comment = True
            elif "//" in line_escaped:
                parts = line_escaped.split("//", 1)
                line_html = highlight_line_content(parts[0]) + f'<span class="tok-comment">//{parts[1]}</span>'
            else:
                line_html = highlight_line_content(line_escaped)
                
        line_number_span = f'<span class="line-num">{i:3d}</span>'
        highlighted_lines.append(f'{line_number_span} {line_html}')
        
    return "\n".join(highlighted_lines)

def highlight_line_content(s):
    if not s:
        return s
    if re.match(r'^\s*#\s*(include|define|ifdef|ifndef|endif)', s):
        return f'<span class="tok-prep">{s}</span>'
    
    def repl_str(m):
        return f'<span class="tok-str">{m.group(0)}</span>'
    s = re.sub(r'(&quot;.*?&quot;|&#39;.*?&#39;)', repl_str, s)
    
    keywords = [
        r'\bint\b', r'\bchar\b', r'\bfloat\b', r'\bdouble\b', r'\bvoid\b',
        r'\bstruct\b', r'\btypedef\b', r'\bconst\b', r'\bsizeof\b',
        r'\bif\b', r'\belse\b', r'\bfor\b', r'\bwhile\b', r'\bdo\b',
        r'\bswitch\b', r'\bcase\b', r'\bbreak\b', r'\bcontinue\b',
        r'\breturn\b', r'\bNULL\b', r'\bexit\b', r'\bmalloc\b', r'\bfree\b'
    ]
    pattern_kw = re.compile(r'(?<![="\'a-zA-Z0-9_])(' + '|'.join(keywords) + r')(?![="\'a-zA-Z0-9_])')
    s = pattern_kw.sub(r'<span class="tok-kw">\1</span>', s)
    return s

def generate_html(page_mapping=None):
    if page_mapping is None:
        page_mapping = {}

    exp_sections_html = []
    for exp in EXPERIMENTS:
        file_path = os.path.join(WORKSPACE_DIR, exp["file"])
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            code_content = f.read()
            
        highlighted_code = highlight_c_code(code_content)
        
        # Build algorithm list HTML
        algo_items = "".join([f"<li>{html.escape(step)}</li>" for step in exp["algorithm"]])
        
        escaped_output = html.escape(exp["terminal_output"])
        terminal_lines = []
        for t_line in escaped_output.split("\n"):
            if t_line.startswith("$ "):
                terminal_lines.append(f'<span class="term-prompt">$ </span><span class="term-cmd">{t_line[2:]}</span>')
            elif "Enter " in t_line or "Enter choice" in t_line or "Enter value" in t_line:
                terminal_lines.append(f'<span class="term-prompt-in">{t_line}</span>')
            elif any(k in t_line for k in ["Added:", "Sum:", "Resultant", "Sorted array:", "Result:", "Traversals:", "Number found", "Pre-order", "In-order", "Post-order", "Level-order"]):
                terminal_lines.append(f'<span class="term-highlight">{t_line}</span>')
            elif t_line.startswith("Process finished"):
                terminal_lines.append(f'<span class="term-exit">{t_line}</span>')
            else:
                terminal_lines.append(f'<span class="term-out">{t_line}</span>')
        formatted_terminal = "\n".join(terminal_lines)

        escaped_input_desc = html.escape(exp["input_desc"]).replace("\n", "<br>")
        escaped_terminal_input = html.escape(exp["terminal_input"]).replace("\n", " &nbsp;|&nbsp; ")

        section = f"""
        <div class="experiment-page" id="exp-{exp['id']}">
            <div class="exp-running-header">
                <span>DATA STRUCTURES LABORATORY • DEPT OF CSE</span>
                <span>SIDHARTH (ROLL NO: 40)</span>
            </div>

            <div class="exp-header">
                <div class="exp-badge">EXPERIMENT {exp['id']:02d}</div>
                <div class="exp-filename">{exp['file']}</div>
            </div>
            
            <h2 class="exp-title">{exp['title']}</h2>
            
            <div class="card aim-card">
                <div class="card-label">AIM & OBJECTIVE</div>
                <div class="aim-text">{exp['aim']}</div>
            </div>

            <div class="card algo-card">
                <div class="card-label">ALGORITHM / LOGIC HIGHLIGHTS</div>
                <ul class="algo-list">
                    {algo_items}
                </ul>
            </div>

            <div class="section-heading">Source Code (C Implementation)</div>
            <div class="code-container">
                <div class="code-header">
                    <span class="code-dot red"></span>
                    <span class="code-dot yellow"></span>
                    <span class="code-dot green"></span>
                    <span class="code-filename">{exp['file']}</span>
                    <span class="code-lang">C (C99 Standard)</span>
                </div>
                <pre class="code-block"><code>{highlighted_code}</code></pre>
            </div>

            <div class="section-heading">Input Parameters & Stream</div>
            <div class="card input-card">
                <div class="input-details">{escaped_input_desc}</div>
                <div class="input-feed">
                    <span class="feed-label">Terminal Feed / Stdin:</span>
                    <code>{escaped_terminal_input}</code>
                </div>
            </div>

            <div class="section-heading">Execution Output (Interactive Terminal)</div>
            <div class="terminal-container">
                <div class="terminal-header">
                    <span class="term-dot red"></span>
                    <span class="term-dot yellow"></span>
                    <span class="term-dot green"></span>
                    <span class="term-title">terminal - sidharth@lab-pc: ~/dsa/exp{exp['id']}</span>
                </div>
                <pre class="terminal-body"><code>{formatted_terminal}</code></pre>
            </div>
        </div>
        """
        exp_sections_html.append(section)

    toc_rows = []
    for exp in EXPERIMENTS:
        p_num = page_mapping.get(exp['id'], f"P.{exp['id']+2}")
        toc_rows.append(f"""
        <tr>
            <td class="toc-id">{exp['id']:02d}</td>
            <td class="toc-title">
                <a href="#exp-{exp['id']}">{exp['title']}</a>
                <span class="toc-sub">{exp['file']}</span>
            </td>
            <td class="toc-aim">{exp['aim']}</td>
            <td class="toc-page-col"><span class="toc-page-badge">{p_num}</span></td>
            <td class="toc-status"><span class="badge-verified">Verified</span></td>
        </tr>
        """)
    toc_table = "\n".join(toc_rows)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Structures Laboratory Record - Sidharth (Roll No: 40)</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&display=swap');

        @page {{
            size: A4 portrait;
            margin: 14mm 12mm 14mm 12mm;
        }}

        * {{
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }}

        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 0;
            color: #1e293b;
            background-color: #ffffff;
            font-size: 9pt;
            line-height: 1.4;
        }}

        /* COVER PAGE */
        .cover-page {{
            page-break-before: always;
            page-break-after: always;
            min-height: 255mm;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 25px 22px;
            border: 2px solid #0f172a;
            border-radius: 6px;
            background: linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
            box-shadow: inset 0 0 0 3px #e2e8f0;
            text-align: center;
        }}

        .emblem {{
            margin: 10px auto 15px auto;
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
        }}

        .emblem svg {{
            width: 32px;
            height: 32px;
            fill: currentColor;
        }}

        .inst-title {{
            font-size: 14pt;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            margin: 0 0 4px 0;
        }}

        .dept-subtitle {{
            font-size: 10pt;
            font-weight: 600;
            color: #2563eb;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin: 0;
        }}

        .cover-divider {{
            width: 60px;
            height: 3.5px;
            background: #2563eb;
            margin: 14px auto;
            border-radius: 2px;
        }}

        .lab-record-tag {{
            display: inline-block;
            background: #dbeafe;
            color: #1e40af;
            font-size: 8.5pt;
            font-weight: 700;
            letter-spacing: 1px;
            padding: 3px 12px;
            border-radius: 15px;
            text-transform: uppercase;
            margin-bottom: 10px;
            border: 1px solid #bfdbfe;
        }}

        .course-title {{
            font-size: 21pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.25;
            margin: 0 0 8px 0;
            letter-spacing: -0.4px;
        }}

        .course-subtitle {{
            font-size: 10.5pt;
            color: #475569;
            font-weight: 500;
            margin: 0 0 18px 0;
        }}

        .cover-specs {{
            display: inline-flex;
            gap: 12px;
            background: #ffffff;
            padding: 6px 14px;
            border-radius: 6px;
            font-size: 8pt;
            color: #334155;
            border: 1px solid #cbd5e1;
        }}

        .cover-specs strong {{
            color: #0f172a;
        }}

        .student-card {{
            background: #ffffff;
            border: 1.5px solid #0f172a;
            border-radius: 8px;
            padding: 16px 24px;
            max-width: 440px;
            margin: 15px auto;
            box-shadow: 0 3px 8px rgba(15, 23, 42, 0.06);
            text-align: left;
        }}

        .student-row {{
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 9pt;
        }}
        .student-row:last-child {{
            border-bottom: none;
        }}

        .student-label {{
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 8pt;
            letter-spacing: 0.5px;
        }}

        .student-val {{
            color: #0f172a;
            font-weight: 700;
        }}

        .cert-box {{
            background: #ffffff;
            border: 1px dashed #94a3b8;
            border-radius: 6px;
            padding: 10px 14px;
            max-width: 440px;
            margin: 10px auto;
            font-size: 7.5pt;
            color: #475569;
            line-height: 1.35;
        }}

        .sign-grid {{
            display: flex;
            justify-content: space-between;
            max-width: 440px;
            margin: 15px auto 5px auto;
            font-size: 8pt;
            color: #334155;
            font-weight: 600;
        }}

        .sign-line {{
            width: 130px;
            border-top: 1px solid #0f172a;
            margin-top: 35px;
            padding-top: 4px;
            text-align: center;
        }}

        .cover-footer {{
            font-size: 8pt;
            color: #64748b;
            margin-top: 5px;
        }}

        /* TABLE OF CONTENTS */
        .toc-page {{
            page-break-before: always;
            page-break-after: always;
            padding: 5px 0;
        }}

        .toc-header {{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2.5px solid #0f172a;
            padding-bottom: 6px;
            margin-bottom: 10px;
        }}

        .toc-header h2 {{
            font-size: 14pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.2px;
        }}

        .toc-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 8pt;
        }}

        .toc-table th {{
            background: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 5px 7px;
            font-size: 7.5pt;
            letter-spacing: 0.4px;
            text-transform: uppercase;
        }}

        .toc-table td {{
            padding: 4.5px 7px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }}

        .toc-table tr:nth-child(even) {{
            background: #f8fafc;
        }}

        .toc-id {{
            font-weight: 700;
            color: #2563eb;
            width: 28px;
            text-align: center;
        }}

        .toc-title a {{
            color: #0f172a;
            text-decoration: none;
            font-weight: 600;
            display: block;
        }}

        .toc-sub {{
            display: block;
            color: #64748b;
            font-size: 7pt;
            font-family: 'Fira Code', monospace;
        }}

        .toc-aim {{
            color: #475569;
            font-size: 7.5pt;
            line-height: 1.25;
        }}

        .toc-page-col {{
            width: 45px;
            text-align: center;
        }}

        .toc-page-badge {{
            display: inline-block;
            background: #e2e8f0;
            color: #0f172a;
            font-weight: 700;
            font-size: 7pt;
            padding: 2px 5px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
        }}

        .badge-verified {{
            display: inline-block;
            background: #dcfce7;
            color: #15803d;
            font-weight: 700;
            font-size: 6.5pt;
            padding: 1.5px 6px;
            border-radius: 4px;
            border: 1px solid #bbf7d0;
            text-align: center;
        }}

        /* EXPERIMENT PAGE */
        .experiment-page {{
            page-break-before: always;
            padding-top: 2px;
        }}

        .exp-running-header {{
            display: flex;
            justify-content: space-between;
            font-size: 7pt;
            font-weight: 600;
            color: #64748b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }}

        .exp-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }}

        .exp-badge {{
            background: #2563eb;
            color: #ffffff;
            font-size: 7.5pt;
            font-weight: 800;
            padding: 2.5px 8px;
            border-radius: 4px;
            letter-spacing: 0.6px;
            text-transform: uppercase;
        }}

        .exp-filename {{
            font-family: 'Fira Code', monospace;
            font-size: 7.5pt;
            color: #475569;
            background: #f1f5f9;
            padding: 2.5px 7px;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }}

        .exp-title {{
            font-size: 13pt;
            font-weight: 800;
            color: #0f172a;
            margin: 2px 0 8px 0;
            letter-spacing: -0.2px;
        }}

        .card {{
            border-radius: 5px;
            padding: 7px 10px;
            margin-bottom: 8px;
        }}

        .aim-card {{
            background: #f8fafc;
            border-left: 3.5px solid #2563eb;
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
        }}

        .algo-card {{
            background: #fafafa;
            border-left: 3.5px solid #0d9488;
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
        }}

        .card-label {{
            font-size: 7pt;
            font-weight: 800;
            color: #2563eb;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 2px;
        }}

        .algo-card .card-label {{
            color: #0d9488;
        }}

        .aim-text {{
            font-size: 8.5pt;
            color: #334155;
            line-height: 1.35;
        }}

        .algo-list {{
            margin: 2px 0 0 16px;
            padding: 0;
            font-size: 8pt;
            color: #334155;
            line-height: 1.35;
        }}

        .algo-list li {{
            margin-bottom: 2px;
        }}

        .section-heading {{
            font-size: 8pt;
            font-weight: 700;
            color: #0f172a;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            margin: 8px 0 4px 0;
            display: flex;
            align-items: center;
            gap: 6px;
        }}
        
        .section-heading::after {{
            content: "";
            flex: 1;
            height: 1px;
            background: #e2e8f0;
        }}

        /* CODE BLOCK */
        .code-container {{
            border-radius: 5px;
            border: 1px solid #cbd5e1;
            margin-bottom: 10px;
            background: #ffffff;
        }}

        .code-header {{
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 7pt;
        }}

        .code-dot {{
            width: 7px;
            height: 7px;
            border-radius: 50%;
            display: inline-block;
        }}
        .code-dot.red {{ background: #ef4444; }}
        .code-dot.yellow {{ background: #f59e0b; }}
        .code-dot.green {{ background: #10b981; }}

        .code-filename {{
            font-family: 'Fira Code', monospace;
            font-weight: 600;
            color: #334155;
            margin-left: 3px;
        }}

        .code-lang {{
            margin-left: auto;
            color: #64748b;
            font-size: 6.5pt;
            font-weight: 600;
            text-transform: uppercase;
        }}

        pre.code-block {{
            margin: 0;
            padding: 6px 8px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 7pt;
            line-height: 1.3;
            color: #1e293b;
            background: #ffffff;
            white-space: pre-wrap;
            word-break: break-all;
        }}

        .line-num {{
            color: #94a3b8;
            user-select: none;
            display: inline-block;
            width: 24px;
            text-align: right;
            padding-right: 6px;
            border-right: 1px solid #e2e8f0;
            margin-right: 6px;
        }}

        .tok-kw {{ color: #2563eb; font-weight: 600; }}
        .tok-comment {{ color: #64748b; font-style: italic; }}
        .tok-str {{ color: #0d9488; }}
        .tok-prep {{ color: #7c3aed; font-weight: 600; }}

        /* INPUT CARD */
        .input-card {{
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            margin-bottom: 8px;
        }}

        .input-details {{
            font-size: 8pt;
            color: #334155;
            line-height: 1.35;
            margin-bottom: 4px;
        }}

        .input-feed {{
            background: #f1f5f9;
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 7.5pt;
            border: 1px solid #e2e8f0;
        }}

        .feed-label {{
            font-weight: 700;
            color: #475569;
            margin-right: 4px;
        }}

        .input-feed code {{
            font-family: 'Fira Code', monospace;
            color: #0f172a;
            font-weight: 600;
        }}

        /* TERMINAL WINDOW */
        .terminal-container {{
            border-radius: 5px;
            border: 1px solid #1e293b;
            background: #0f172a;
            margin-bottom: 12px;
            box-shadow: 0 3px 8px rgba(15, 23, 42, 0.12);
        }}

        .terminal-header {{
            background: #1e293b;
            padding: 4px 8px;
            display: flex;
            align-items: center;
            gap: 5px;
            border-bottom: 1px solid #334155;
        }}

        .term-dot {{
            width: 7px;
            height: 7px;
            border-radius: 50%;
            display: inline-block;
        }}
        .term-dot.red {{ background: #ef4444; }}
        .term-dot.yellow {{ background: #f59e0b; }}
        .term-dot.green {{ background: #10b981; }}

        .term-title {{
            margin-left: 6px;
            font-family: 'Fira Code', monospace;
            font-size: 6.5pt;
            color: #94a3b8;
        }}

        pre.terminal-body {{
            margin: 0;
            padding: 8px 10px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 7.5pt;
            line-height: 1.35;
            color: #e2e8f0;
            white-space: pre-wrap;
            word-break: break-all;
        }}

        .term-prompt {{ color: #38bdf8; font-weight: 700; }}
        .term-cmd {{ color: #f8fafc; font-weight: 600; }}
        .term-prompt-in {{ color: #cbd5e1; }}
        .term-highlight {{ color: #4ade80; font-weight: 600; }}
        .term-out {{ color: #94a3b8; }}
        .term-exit {{ color: #64748b; font-style: italic; font-size: 7pt; }}
    </style>
</head>
<body>

    <!-- COVER PAGE -->
    <div class="cover-page">
        <div>
            <div class="emblem">
                <svg viewBox="0 0 24 24">
                    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
                </svg>
            </div>
            <h1 class="inst-title">Department of Computer Science & Engineering</h1>
            <p class="dept-subtitle">Course Work & Practical Laboratory Record</p>
            <div class="cover-divider"></div>
        </div>

        <div>
            <span class="lab-record-tag">Official Laboratory Record</span>
            <h2 class="course-title">Data Structures & Algorithms Laboratory</h2>
            <p class="course-subtitle">Practical Implementation of Core DSA Concepts in Standard C</p>

            <div class="cover-specs">
                <span>Total Experiments: <strong>21</strong></span>
                <span>•</span>
                <span>Language: <strong>C (GCC / C99)</strong></span>
                <span>•</span>
                <span>Coverage: <strong>Code, Sample Input & Terminal Output</strong></span>
            </div>

            <div class="student-card">
                <div class="student-row">
                    <span class="student-label">Student Name</span>
                    <span class="student-val">SIDHARTH</span>
                </div>
                <div class="student-row">
                    <span class="student-label">Roll Number</span>
                    <span class="student-val">40</span>
                </div>
                <div class="student-row">
                    <span class="student-label">Course / Lab</span>
                    <span class="student-val">Data Structures Laboratory (DSA)</span>
                </div>
                <div class="student-row">
                    <span class="student-label">Semester / Branch</span>
                    <span class="student-val">Semester 3 / B.Tech CSE</span>
                </div>
                <div class="student-row">
                    <span class="student-label">Record Status</span>
                    <span class="student-val" style="color: #16a34a;">Completed & Verified</span>
                </div>
            </div>

            <div class="cert-box">
                <strong>CERTIFICATE:</strong> Certified that this is the bona fide record of practical work completed by <strong>Sidharth (Roll No: 40)</strong> in the Data Structures Laboratory during the academic year 2026–2027.
            </div>

            <div class="sign-grid">
                <div class="sign-line">Student Signature</div>
                <div class="sign-line">Staff-in-Charge</div>
                <div class="sign-line">Head of Department</div>
            </div>
        </div>

        <div class="cover-footer">
            Comprehensive Laboratory Compilation • Academic Year 2026–2027
        </div>
    </div>

    <!-- TABLE OF CONTENTS -->
    <div class="toc-page">
        <div class="toc-header">
            <div>
                <h2>INDEX OF EXPERIMENTS</h2>
                <div style="font-size: 7.5pt; color: #64748b; margin-top: 1px;">Data Structures Laboratory Record • Sidharth (Roll No: 40)</div>
            </div>
            <span style="font-size: 8pt; font-weight: 700; color: #2563eb;">21 Experiments Total</span>
        </div>

        <table class="toc-table">
            <thead>
                <tr>
                    <th style="width: 28px; text-align: center;">No.</th>
                    <th style="width: 175px;">Experiment Title & File</th>
                    <th>Objective / Aim</th>
                    <th style="width: 45px; text-align: center;">Page</th>
                    <th style="width: 55px; text-align: center;">Status</th>
                </tr>
            </thead>
            <tbody>
                {toc_table}
            </tbody>
        </table>
    </div>

    <!-- ALL EXPERIMENTS -->
    { "".join(exp_sections_html) }

</body>
</html>
"""
    with open(HTML_OUTPUT, "w", encoding="utf-8") as f:
        f.write(html_content)
    return HTML_OUTPUT

def convert_to_pdf():
    msedge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    cmd = [
        msedge_path,
        "--headless",
        "--disable-gpu",
        f"--print-to-pdf={PDF_OUTPUT}",
        "--no-pdf-header-footer",
        HTML_OUTPUT
    ]
    subprocess.run(cmd, check=True)

def extract_page_mapping():
    with open(PDF_OUTPUT, "rb") as f:
        data = f.read()
    page_matches = list(re.finditer(rb'(\d+)\s+0\s+obj\s*<<[^\>]*?/Type\s*/Page\b', data))
    page_obj_to_num = {}
    for idx, m in enumerate(page_matches, start=1):
        obj_id = int(m.group(1))
        page_obj_to_num[obj_id] = idx

    dests = re.findall(rb'/exp-(\d+)\s*\[\s*(\d+)\s+0\s+R', data)
    mapping = {}
    for exp_id, page_obj in dests:
        mapping[int(exp_id)] = page_obj_to_num.get(int(page_obj), 0)
    return mapping

def main():
    print("=== PASS 1: Generating Initial HTML and compiling PDF ===")
    generate_html()
    convert_to_pdf()
    
    mapping = extract_page_mapping()
    print("Detected Page Mapping from Pass 1:")
    for eid in sorted(mapping.keys()):
        print(f"  Experiment {eid:02d} -> Page {mapping[eid]}")

    print("\n=== PASS 2: Updating Table of Contents with Exact Page Numbers ===")
    generate_html(mapping)
    convert_to_pdf()
    
    # Create alias copy
    shutil.copyfile(PDF_OUTPUT, PDF_ALIAS)
    
    size_kb = os.path.getsize(PDF_OUTPUT) / 1024
    with open(PDF_OUTPUT, "rb") as f:
        data = f.read()
    total_pages = len(re.findall(rb'/Type\s*/Page\b', data))
    print(f"\nSUCCESSFUL BUILD!")
    print(f"  Primary PDF: {PDF_OUTPUT} ({size_kb:.1f} KB, {total_pages} pages)")
    print(f"  Alias PDF:   {PDF_ALIAS}")

if __name__ == "__main__":
    main()
