const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { PDFParse } = require('pdf-parse');

// 1. Metadata for all 11 programs
const programs = [
  {
    "number": 1,
    "file": "1.c",
    "title": "Matrix Addition",
    "category": "Arrays & Matrices",
    "aim": "To write a C program to perform addition of two matrices using two-dimensional arrays and display the resultant matrix.",
    "algorithm": [
      "Read the row and column dimensions of the matrices from the user.",
      "Read elements of Matrix A and Matrix B of size (row × col).",
      "Iterate through the rows and columns, adding corresponding elements: C[i][j] = A[i][j] + B[i][j].",
      "Display the resultant matrix C."
    ],
    "output": "Enter row & column sizes of 1st matrix: 2 2\nEnter 4 elemnts for 1st matrix: 1 2 3 4\nEnter 4 elemnts for 2nd matrix: 5 6 7 8\nAdded:\n6 8 \n10 12 "
  },
  {
    "number": 2,
    "file": "2.c",
    "title": "Addition of Two Polynomials Using Structures",
    "category": "Structures & Polynomials",
    "aim": "To write a C program to represent polynomials using an array of structures and compute the sum of two polynomials.",
    "algorithm": [
      "Define a structure Poly containing coeff (coefficient) and exp (exponent).",
      "Input the terms of two polynomials A and B in decreasing order of exponents.",
      "Compare terms from both polynomials using pointers i and j:",
      "  • If exponents are equal: SUM[k].coeff = A[i].coeff + B[j].coeff; i++; j++;",
      "  • If exponent A > B: SUM[k] = A[i]; i++;",
      "  • If exponent B > A: SUM[k] = B[j]; j++;",
      "Copy any remaining terms of A or B into SUM.",
      "Display the resultant polynomial expression."
    ],
    "output": "Enter number of elements for 1st Polynomial: 2\nEnter number of elements for 2nd Polynomial: 2\n\nEnter 2 elements for 1st polynomial:\n4 2\n3 1\n\nEnter 2 elements for 2nd polynomial:\n5 2\n2 0\nSum:\n(9**2) + (3**1) + (2**0)"
  },
  {
    "number": 3,
    "file": "3.c",
    "title": "Tuple Representation of Sparse Matrix",
    "category": "Sparse Matrices",
    "aim": "To write a C program to convert a standard 2D matrix into its 3-tuple (triplet) representation (Row, Column, Value).",
    "algorithm": [
      "Read matrix dimensions (row, col) and input all elements of the matrix.",
      "Traverse the matrix to locate all non-zero entries.",
      "Record header metadata at index 0: sparse[0][0] = row, sparse[0][1] = col, sparse[0][2] = non_zero_count.",
      "Store each non-zero entry's row index, column index, and value in subsequent rows.",
      "Print the sparse matrix in triplet form (row, column, value)."
    ],
    "output": "Enter row & column size: 3 3\nEnter 9 elements: 0 0 5 0 8 0 0 0 0\n(3, 3, 2)\n(0, 2, 5)\n(1, 1, 8)"
  },
  {
    "number": 4,
    "file": "4.c",
    "title": "Sparse Matrix Addition",
    "category": "Sparse Matrices",
    "aim": "To write a C program to add two sparse matrices represented in triplet form.",
    "algorithm": [
      "Read dimensions and number of non-zero elements for both sparse matrices.",
      "Read triplets (Row, Col, Value) for Matrix 1 and Matrix 2 in row-major order.",
      "Compare triplets from both matrices using pointers i and j:",
      "  • Same row & col: Add values, store in result triplet, increment i, j, k.",
      "  • Matrix 1 position comes earlier: Copy Matrix 1 triplet, increment i, k.",
      "  • Matrix 2 position comes earlier: Copy Matrix 2 triplet, increment j, k.",
      "Copy any remaining triplets to the result matrix.",
      "Set the total non-zero count in result[0][2] and display the table."
    ],
    "output": "Enter total number of rows and columns for the matrices: 3 3\nEnter number of non-zero elements for Matrix 1: 2\nEnter number of non-zero elements for Matrix 2: 2\n\nEnter Triplets for Matrix 1 (Row, Column, Value):\n0 0 5\n1 1 3\n\nEnter Triplets for Matrix 2 (Row, Column, Value):\n0 0 2\n2 2 4\n\nResultant Sparse Matrix (Triplet Representation):\nRow\tCol\tValue\n3\t3\t3\n0\t0\t7\n1\t1\t3\n2\t2\t4"
  },
  {
    "number": 5,
    "file": "5.c",
    "title": "Transpose of Sparse Matrix",
    "category": "Sparse Matrices",
    "aim": "To write a C program to compute the transpose of a sparse matrix in triplet representation and sort the result.",
    "algorithm": [
      "Read rows, columns, and non-zero element count of the sparse matrix.",
      "Read the triplets (Row, Column, Value) of the sparse matrix.",
      "Swap row and column dimensions for transpose metadata: transpose[0][0] = cols, transpose[0][1] = rows, transpose[0][2] = non_zero.",
      "For each triplet, swap row and column coordinates: transpose[i][0] = sparse[i][1], transpose[i][1] = sparse[i][0], transpose[i][2] = sparse[i][2].",
      "Sort the transposed triplets in ascending order by row index, then column index.",
      "Display the transposed sparse matrix."
    ],
    "output": "Enter total number of rows and columns for the matrix: 3 3\nEnter number of non-zero elements for the matrix: 3\n\nEnter Triplets for the Matrix (Row, Column, Value):\n0 1 5\n1 2 8\n2 0 3\n\nThe transposed matrix is:\n3 3 3\n0 2 3\n1 0 5\n2 1 8"
  },
  {
    "number": 6,
    "file": "6.c",
    "title": "Stack Operations Using Array",
    "category": "Stacks",
    "aim": "To write a menu-driven C program to implement Stack operations (Push, Pop, Display) using an array.",
    "algorithm": [
      "Initialize stack pointer top = -1.",
      "PUSH(val): Check if top >= MAX - 1 (Overflow). If not, items[++top] = val.",
      "POP(): Check if top == -1 (Underflow). If not, return items[top--].",
      "DISPLAY(): If top == -1, print Underflow; else print elements from items[0] to items[top].",
      "Provide a menu-driven interface with choices 1: Push, 2: Pop, 3: Display, 4: Exit."
    ],
    "output": "1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n10\n20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 2\nPopped value: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 7,
    "file": "7.c",
    "title": "Linear Queue Operations Using Array",
    "category": "Queues",
    "aim": "To write a menu-driven C program to implement Linear Queue operations (Enqueue, Dequeue, Display) using an array.",
    "algorithm": [
      "Initialize front = -1 and rear = -1.",
      "ENQUEUE(val): Check if rear >= MAX - 1 (Overflow). If front == -1 set front = 0. Set items[++rear] = val.",
      "DEQUEUE(): Check if front == -1 or front > rear (Underflow). Else return items[front++].",
      "DISPLAY(): If front == -1 or front > rear, queue is empty. Else display items from front to rear.",
      "Loop menu choices until user exits."
    ],
    "output": "1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n100\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 2\nDequeued value: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 8,
    "file": "8.c",
    "title": "Circular Queue Operations Using Array",
    "category": "Queues",
    "aim": "To write a menu-driven C program to implement a Circular Queue with count variable to optimize space utilization.",
    "algorithm": [
      "Initialize front = 0, rear = MAX - 1, and count = 0.",
      "ENQUEUE(val): Check if count >= MAX (Overflow). Set rear = (rear + 1) % MAX, items[rear] = val, count++.",
      "DEQUEUE(): Check if count == 0 (Underflow). Retrieve val = items[front], set front = (front + 1) % MAX, count--, return val.",
      "DISPLAY(): If count == 0, print empty. Else loop i from front to front + count - 1 and print items[i % MAX].",
      "Provide interactive menu with options 1: Enqueue, 2: Dequeue, 3: Display, 4: Exit."
    ],
    "output": "1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 10\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 20\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 30\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n10\n20\n30\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 2\nDequeued value: 10\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 40\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n20\n30\n40\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 9,
    "file": "9.c",
    "title": "Double Ended Queue (Deque) Operations",
    "category": "Queues",
    "aim": "To write a menu-driven C program to implement a Double Ended Queue (Deque) supporting insertions and deletions at both front and rear.",
    "algorithm": [
      "Initialize front = -1 and rear = -1.",
      "INSERT FRONT: If full, display overflow. If empty, front = rear = 0. Else shift elements right or decrement front, then insert.",
      "INSERT REAR: If full, display overflow. If empty, front = rear = 0. Else if rear < MAX-1, items[++rear] = val; else shift left.",
      "REMOVE FRONT: If empty, display underflow. Retrieve items[front]. If front == rear, reset front = rear = -1, else front++.",
      "REMOVE REAR: If empty, display underflow. Retrieve items[rear]. If front == rear, reset front = rear = -1, else rear--.",
      "DISPLAY: Print all elements from front to rear."
    ],
    "output": "1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 2\nEnter value to insert at rear: 10\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 2\nEnter value to insert at rear: 20\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 1\nEnter value to insert at front: 5\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 5\nDisplaying Contents:\n5\n10\n20\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 3\nRemoved from front: 5\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 4\nRemoved from rear: 20\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 5\nDisplaying Contents:\n10\n1. Insert Front\n2. Insert Rear\n3. Remove Front\n4. Remove Rear\n5. Display\n6. Exit\nEnter your choice: 6\nExiting..."
  },
  {
    "number": 10,
    "file": "10.c",
    "title": "Infix to Postfix Expression Conversion",
    "category": "Expression Processing",
    "aim": "To write a C program to convert an infix arithmetic expression into a postfix expression using an operator stack.",
    "algorithm": [
      "Initialize an empty character operator stack.",
      "Scan the infix expression character by character from left to right:",
      "  • If character is an operand (digit), append directly to postfix output.",
      "  • If character is '(', push onto stack.",
      "  • If character is ')', pop and output operators until '(' is encountered, then discard '('.",
      "  • If operator: Pop operators of greater or equal precedence from stack to output, then push current operator.",
      "After scan completes, pop and output all remaining operators in stack.",
      "Display the resulting postfix expression."
    ],
    "output": "Enter infix expression: (2+3)*(4-5)\nPostfix Expression:\n2 3 + 4 5 - *"
  },
  {
    "number": 11,
    "file": "11.c",
    "title": "Evaluation of Postfix Expression Using Stack",
    "category": "Expression Processing",
    "aim": "To write a C program to evaluate a postfix expression using an operand stack and arithmetic operators (+, -, *, /).",
    "algorithm": [
      "Initialize an empty integer stack.",
      "Scan the postfix expression from left to right:",
      "  • If character is a digit, convert to int value and push onto stack.",
      "  • If whitespace, ignore and continue.",
      "  • If character is an operator (+, -, *, /):",
      "      1. Pop two operands val2 and val1.",
      "      2. Compute result = val1 <op> val2.",
      "      3. Push the computed result back onto the stack.",
      "At the end of the expression, pop the final result from the stack and print."
    ],
    "output": "Enter the postfix expression: 2 3 + 4 5 - *\nResult: -5"
  },
  {
    "number": 12,
    "file": "12.c",
    "title": "Singly Linked List Operations",
    "category": "Linked Lists",
    "aim": "To write a menu-driven C program to implement Singly Linked List operations: Creation, Display, Search, Insertion (Beginning, Middle, End), and Deletion (Beginning, Middle, End).",
    "algorithm": [
      "Define a structure Node containing integer data and a pointer next. Set head = NULL.",
      "CREATE: Read data, allocate newNode. If head == NULL, set head = newNode. Else traverse to end and attach newNode.",
      "DISPLAY: If head == NULL, print empty. Else traverse and print each node data until NULL.",
      "SEARCH: Read key to search. Traverse nodes tracking position. If node->data == key, display position; else report not found.",
      "INSERT AT BEGINNING: Allocate newNode, set newNode->next = head, head = newNode.",
      "INSERT AT MIDDLE: Read data and position pos. Traverse to (pos - 1)-th node, set newNode->next = temp->next, temp->next = newNode.",
      "INSERT AT END: Allocate newNode. Traverse to the last node and set temp->next = newNode.",
      "DELETE AT BEGINNING: Set temp = head, head = head->next, free(temp).",
      "DELETE AT MIDDLE: Traverse to (pos - 1)-th node. Unlink target node delNode = temp->next, temp->next = delNode->next, free(delNode).",
      "DELETE AT END: Traverse to the second-to-last node. Unlink last node, free it, and set temp->next = NULL."
    ],
    "output": "- - - Linked List Menu - - -\n1. Create\n2. Display\n3. Search\n4. Insert at Beginning\n5. Insert at Middle\n6. Insert at End\n7. Delete at Beginning\n8. Delete at Middle\n9. Delete at End\n10. Exit\nEnter choice : 1\nEnter data : 10\nNode created successfully\n\n- - - Linked List Menu - - -\nEnter choice : 2\nLinked List: 10 -> NULL\n\n- - - Linked List Menu - - -\nEnter choice : 4\nEnter data : 5\nNode inserted successfully at beginning\n\n- - - Linked List Menu - - -\nEnter choice : 6\nEnter data : 30\nNode inserted successfully at end\n\n- - - Linked List Menu - - -\nEnter choice : 5\nEnter data : 20\nEnter position : 3\nNode inserted successfully at position 3\n\n- - - Linked List Menu - - -\nEnter choice : 2\nLinked List: 5 -> 10 -> 20 -> 30 -> NULL\n\n- - - Linked List Menu - - -\nEnter choice : 3\nEnter element to search : 20\nElement 20 found at position 3\n\n- - - Linked List Menu - - -\nEnter choice : 8\nEnter position to delete : 3\nDeleted element: 20\n\n- - - Linked List Menu - - -\nEnter choice : 7\nDeleted element: 5\n\n- - - Linked List Menu - - -\nEnter choice : 9\nDeleted element: 30\n\n- - - Linked List Menu - - -\nEnter choice : 2\nLinked List: 10 -> NULL\n\n- - - Linked List Menu - - -\nEnter choice : 10\nExiting..."
  },
  {
    "number": 13,
    "file": "13.c",
    "title": "Doubly Linked List Operations",
    "category": "Linked Lists",
    "aim": "To write a menu-driven C program to implement Doubly Linked List operations: Creation, Display, Search, Insertion (Beginning, Middle, End), and Deletion (Beginning, Middle, End).",
    "algorithm": [
      "Define a structure Node containing integer data, pointer prev, and pointer next. Set head = NULL.",
      "CREATE: Read data, allocate newNode with prev = NULL and next = NULL. If head == NULL, set head = newNode. Else traverse to end and link newNode.",
      "DISPLAY: If head == NULL, print empty. Else traverse and print each node data with <-> until NULL.",
      "SEARCH: Read key. Traverse nodes tracking position. If node->data == key, print found position; else report not found.",
      "INSERT AT BEGINNING: Allocate newNode, set newNode->next = head, newNode->prev = NULL. If head != NULL, head->prev = newNode. Set head = newNode.",
      "INSERT AT MIDDLE: Read data and position pos. Traverse to (pos - 1)-th node. Link newNode between temp and temp->next adjusting next and prev pointers.",
      "INSERT AT END: Allocate newNode. Traverse to the last node, set temp->next = newNode, and newNode->prev = temp.",
      "DELETE AT BEGINNING: Set temp = head, head = head->next. If head != NULL, set head->prev = NULL. Free temp.",
      "DELETE AT MIDDLE: Traverse to the pos-th node. Adjust delNode->prev->next = delNode->next and delNode->next->prev = delNode->prev. Free delNode.",
      "DELETE AT END: Traverse to the last node. Set temp->prev->next = NULL. Free temp."
    ],
    "output": "- - - Doubly Linked List Menu - - -\n1. Create\n2. Display\n3. Search\n4. Insert at Beginning\n5. Insert at Middle\n6. Insert at End\n7. Delete at Beginning\n8. Delete at Middle\n9. Delete at End\n10. Exit\nEnter choice : 1\nEnter data : 10\nNode created successfully\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 4\nEnter data : 5\nNode inserted successfully at beginning\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 6\nEnter data : 30\nNode inserted successfully at end\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 5\nEnter data : 20\nEnter position : 3\nNode inserted successfully at position 3\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 2\nLinked List: 5 <-> 10 <-> 20 <-> 30 <-> NULL\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 3\nEnter element to search : 20\nElement 20 found at position 3\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 8\nEnter position to delete : 3\nDeleted element: 20\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 7\nDeleted element: 5\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 9\nDeleted element: 30\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 2\nLinked List: 10 <-> NULL\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 10\nExiting..."
  },
  {
    "number": 14,
    "file": "14.c",
    "title": "Stack Operations Using Linked List",
    "category": "Linked Lists",
    "aim": "To write a menu-driven C program to implement Stack operations (Push, Pop, Display) dynamically using a singly linked list.",
    "algorithm": [
      "Define a structure Node containing integer data and a pointer next.",
      "Initialize top pointer to NULL.",
      "PUSH(val): Allocate a new node using malloc. Set newNode->data = val, newNode->next = top, and top = newNode.",
      "POP(): If top == NULL, print Stack Underflow. Else save top in temp, advance top = top->next, free temp, and return value.",
      "DISPLAY(): If top == NULL, print Stack Underflow. Else traverse from top to NULL and print each element.",
      "Loop menu choices (1. Push, 2. Pop, 3. Display, 4. Exit) until user exits."
    ],
    "output": "1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n20\n10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 2\nPopped value: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 15,
    "file": "15.c",
    "title": "Queue Operations Using Linked List",
    "category": "Linked Lists",
    "aim": "To write a menu-driven C program to implement Linear Queue operations (Enqueue, Dequeue, Display) dynamically using a singly linked list.",
    "algorithm": [
      "Define a structure Node containing integer data and a pointer next.",
      "Initialize front and rear pointers to NULL.",
      "ENQUEUE(val): Allocate a new node with data = val and next = NULL. If front == NULL, set front = rear = newNode. Else set rear->next = newNode and rear = newNode.",
      "DEQUEUE(): If front == NULL, print Queue Underflow. Else save front in temp, advance front = front->next. If front becomes NULL, set rear = NULL. Free temp and return value.",
      "DISPLAY(): If front == NULL, print Queue Underflow. Else traverse from front to NULL and print each element.",
      "Loop menu choices (1. Enqueue, 2. Dequeue, 3. Display, 4. Exit) until user exits."
    ],
    "output": "1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n100\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 2\nDequeued value: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 12,
    "file": "12.c",
    "title": "Singly Linked List Operations",
    "output": "- - - Linked List Menu - - -\n1. Create\n2. Display\n3. Search\n4. Insert at Beginning\n5. Insert at Middle\n6. Insert at End\n7. Delete at Beginning\n8. Delete at Middle\n9. Delete at End\n10. Exit\nEnter choice : 1\nEnter data : 10\nNode created successfully\n\n- - - Linked List Menu - - -\nEnter choice : 4\nEnter data : 5\nNode inserted successfully at beginning\n\n- - - Linked List Menu - - -\nEnter choice : 6\nEnter data : 30\nNode inserted successfully at end\n\n- - - Linked List Menu - - -\nEnter choice : 5\nEnter data : 20\nEnter position : 3\nNode inserted successfully at position 3\n\n- - - Linked List Menu - - -\nEnter choice : 2\nLinked List: 5 -> 10 -> 20 -> 30 -> NULL\n\n- - - Linked List Menu - - -\nEnter choice : 3\nEnter element to search : 20\nElement 20 found at position 3\n\n- - - Linked List Menu - - -\nEnter choice : 8\nEnter position to delete : 3\nDeleted element: 20\n\n- - - Linked List Menu - - -\nEnter choice : 7\nDeleted element: 5\n\n- - - Linked List Menu - - -\nEnter choice : 9\nDeleted element: 30\n\n- - - Linked List Menu - - -\nEnter choice : 2\nLinked List: 10 -> NULL\n\n- - - Linked List Menu - - -\nEnter choice : 10\nExiting..."
  },
  {
    "number": 13,
    "file": "13.c",
    "title": "Doubly Linked List Operations",
    "output": "- - - Doubly Linked List Menu - - -\n1. Create\n2. Display\n3. Search\n4. Insert at Beginning\n5. Insert at Middle\n6. Insert at End\n7. Delete at Beginning\n8. Delete at Middle\n9. Delete at End\n10. Exit\nEnter choice : 1\nEnter data : 10\nNode created successfully\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 4\nEnter data : 5\nNode inserted successfully at beginning\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 6\nEnter data : 30\nNode inserted successfully at end\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 5\nEnter data : 20\nEnter position : 3\nNode inserted successfully at position 3\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 2\nLinked List: 5 <-> 10 <-> 20 <-> 30 <-> NULL\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 3\nEnter element to search : 20\nElement 20 found at position 3\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 8\nEnter position to delete : 3\nDeleted element: 20\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 7\nDeleted element: 5\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 9\nDeleted element: 30\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 2\nLinked List: 10 <-> NULL\n\n- - - Doubly Linked List Menu - - -\nEnter choice : 10\nExiting..."
  },
  {
    "number": 14,
    "file": "14.c",
    "title": "Stack Operations Using Linked List",
    "output": "1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to push: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n20\n10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 2\nPopped value: 20\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying contents:\n10\n1. Push\n2. Pop\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 15,
    "file": "15.c",
    "title": "Queue Operations Using Linked List",
    "output": "1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 1\nEnter value to enqueue: 200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n100\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 2\nDequeued value: 100\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 3\nDisplaying Contents:\n200\n1. Enqueue\n2. Dequeue\n3. Display\n4. Exit\nEnter your choice: 4\nExiting..."
  },
  {
    "number": 16,
    "file": "16_linear_search.c",
    "title": "Linear Search",
    "output": "Enter the size of the array: 5\\nEnter 5 numbers:\\n10 20 30 40 50\\nEnter a number to search: 30\\nNumber found at index 2."
  },
  {
    "number": 17,
    "file": "17_binary_search.c",
    "title": "Binary Search",
    "output": "Enter the size of the array: 5\\nEnter 5 sorted numbers:\\n10 20 30 40 50\\nEnter a number to search: 40\\nNumber found at index 3."
  },
  {
    "number": 18,
    "file": "18_insertion_sort.c",
    "title": "Insertion Sort",
    "output": "Enter number of elements: 5\\nEnter 5 integers:\\n50 20 40 10 30\\nSorted list in ascending order:\\n10 20 30 40 50"
  },
  {
    "number": 19,
    "file": "19_selection_sort.c",
    "title": "Selection Sort",
    "output": "Enter number of elements: 5\\nEnter 5 integers:\\n50 20 40 10 30\\nSorted list in ascending order:\\n10 20 30 40 50"
  },
  {
    "number": 20,
    "file": "20_quick_sort.c",
    "title": "Quick Sort",
    "output": "Enter number of elements: 5\\nEnter 5 integers:\\n50 20 40 10 30\\nSorted array:\\n10 20 30 40 50"
  },
  {
    "number": 21,
    "file": "21_merge_sort.c",
    "title": "Merge Sort",
    "output": "Enter number of elements: 5\\nEnter 5 integers:\\n50 20 40 10 30\\nSorted array:\\n10 20 30 40 50"
  }
];

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// 2. Single-pass Syntax Highlighter for C Code
function highlightC(code) {
  const tokenRegex = /(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])+')|(^[ \t]*#[ \t]*\w+[^\r\n]*)|(\b(?:return|if|else|while|for|switch|case|break|continue|default|do|sizeof|goto)\b)|(\b(?:int|char|float|double|void|long|short|unsigned|signed|struct|typedef|size_t|const)\b)|(\b(?:NULL|MAX|stdin|stdout)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*(?=\s*\())/gm;

  let result = '';
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(code.slice(lastIndex, match.index));
    }

    const [full, comment, str, preproc, keyword, type, constant, number, func] = match;

    if (comment) {
      result += `<span class="c-comment">${escapeHtml(comment)}</span>`;
    } else if (str) {
      result += `<span class="c-string">${escapeHtml(str)}</span>`;
    } else if (preproc) {
      const pMatch = preproc.match(/^([ \t]*#[ \t]*\w+)([\s\S]*)$/);
      if (pMatch) {
        result += `<span class="c-preprocessor">${escapeHtml(pMatch[1])}</span><span class="c-include">${escapeHtml(pMatch[2])}</span>`;
      } else {
        result += `<span class="c-preprocessor">${escapeHtml(preproc)}</span>`;
      }
    } else if (keyword) {
      result += `<span class="c-keyword">${escapeHtml(keyword)}</span>`;
    } else if (type) {
      result += `<span class="c-type">${escapeHtml(type)}</span>`;
    } else if (constant) {
      result += `<span class="c-constant">${escapeHtml(constant)}</span>`;
    } else if (number) {
      result += `<span class="c-number">${escapeHtml(number)}</span>`;
    } else if (func) {
      result += `<span class="c-function">${escapeHtml(func)}</span>`;
    } else {
      result += escapeHtml(full);
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    result += escapeHtml(code.slice(lastIndex));
  }

  const lines = result.split('\n');
  return lines.map((line, idx) => {
    const lineNum = String(idx + 1).padStart(2, ' ');
    return `<div class="line-row"><span class="line-num">${lineNum}</span><span class="line-code">${line || '&nbsp;'}</span></div>`;
  }).join('');
}

// 3. Generate HTML Template (Pure Program Files + Output, Clean Light Print Theme)
function buildHTML() {
  let programsHtml = '';
  programs.forEach(prog => {
    const filePath = path.join(__dirname, prog.file);
    const codeContent = fs.readFileSync(filePath, 'utf-8');
    const highlightedCode = highlightC(codeContent);

    programsHtml += `
    <section class="program-page" id="prog-${prog.number}">
      <div class="program-header">
        <div class="header-left">
          <span class="exp-badge">PROGRAM ${prog.number}</span>
          <span class="file-tag">${prog.file}</span>
          <h2 class="program-title">${prog.title}</h2>
        </div>
      </div>

      <div class="code-card">
        <div class="code-card-header">
          <span class="card-title">C SOURCE CODE</span>
          <span class="card-meta">${prog.file}</span>
        </div>
        <div class="code-block">${highlightedCode}</div>
      </div>

      <div class="output-card">
        <div class="output-card-header">
          <span class="card-title">PROGRAM OUTPUT</span>
          <span class="card-meta">Execution Verification</span>
        </div>
        <pre class="output-text">${prog.output}</pre>
      </div>
    </section>
    `;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Data Structures Practical Assignments - Source Code &amp; Output</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 14mm 14mm 14mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 9pt;
      line-height: 1.45;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .program-page {
      page-break-after: always;
      break-after: page;
      padding-bottom: 6px;
    }

    .program-page:last-child {
      page-break-after: avoid;
      break-after: avoid;
    }

    /* PROGRAM HEADER */
    .program-header {
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .exp-badge {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      font-size: 8pt;
      letter-spacing: 0.8px;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .file-tag {
      background: #f1f5f9;
      color: #0369a1;
      font-weight: 600;
      font-size: 8.5pt;
      padding: 2px 7px;
      border-radius: 4px;
      font-family: Consolas, "Cascadia Code", monospace;
      border: 1px solid #cbd5e1;
    }

    .program-title {
      font-size: 12.5pt;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.2px;
    }

    /* CODE CARD */
    .code-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
    }

    .code-card-header, .output-card-header {
      background: #f8fafc;
      border-bottom: 1px solid #e2e8f0;
      padding: 5px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      font-size: 8pt;
      font-weight: 700;
      color: #334155;
      letter-spacing: 0.6px;
    }

    .card-meta {
      font-size: 7.5pt;
      color: #64748b;
      font-family: Consolas, monospace;
    }

    .code-block {
      padding: 6px 10px;
      font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
      font-size: 8pt;
      line-height: 1.36;
      color: #0f172a;
      background: #ffffff;
    }

    .line-row {
      display: flex;
    }

    .line-num {
      width: 26px;
      color: #94a3b8;
      user-select: none;
      text-align: right;
      margin-right: 10px;
      flex-shrink: 0;
      font-size: 7.5pt;
      border-right: 1px solid #e2e8f0;
      padding-right: 6px;
    }

    .line-code {
      flex-grow: 1;
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* SYNTAX HIGHLIGHTING (Light / Print Theme) */
    .c-comment { color: #64748b; font-style: italic; }
    .c-string { color: #166534; font-weight: 500; }
    .c-char { color: #15803d; }
    .c-preprocessor { color: #7c3aed; font-weight: 600; }
    .c-include { color: #475569; font-weight: 500; }
    .c-keyword { color: #0369a1; font-weight: 700; }
    .c-type { color: #b45309; font-weight: 700; }
    .c-constant { color: #6b21a8; font-weight: 700; }
    .c-number { color: #c2410c; }
    .c-function { color: #1d4ed8; font-weight: 600; }

    /* OUTPUT CARD */
    .output-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      page-break-inside: auto;
    }

    .output-card-header {
      background: #f1f5f9;
    }

    .output-text {
      padding: 8px 12px;
      font-family: "Cascadia Code", "Fira Code", Consolas, "Courier New", monospace;
      font-size: 8pt;
      line-height: 1.38;
      color: #0f172a;
      background: #f8fafc;
      white-space: pre-wrap;
      word-break: break-all;
    }
  </style>
</head>
<body>

  ${programsHtml}

</body>
</html>
`;
}

// 4. PDF Generation
(async () => {
  try {
    console.log('Generating HTML...');
    const htmlContent = buildHTML();
    const htmlFilePath = path.join(__dirname, 'Complete_Lab_Record_1_to_21.html');
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');

    console.log('Launching browser engine...');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const htmlUrl = 'file:///' + htmlFilePath.replace(/\\/g, '/');
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });

    const finalPdfPath = path.join(__dirname, 'Complete_Lab_Record_1_to_21.pdf');
    console.log('Rendering clean light-theme PDF...');
    await page.pdf({
      path: finalPdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '12mm',
        bottom: '14mm',
        left: '14mm',
        right: '14mm'
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-bottom: 0.5px solid #e2e8f0; padding-bottom: 3px;">
          <span style="font-weight: 600; color: #0f172a;">Data Structures &amp; Algorithms Laboratory (C Programming)</span>
          <span>Source Code &amp; Output</span>
        </div>
      `,
      footerTemplate: `
        <div style="font-size: 7.5pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #64748b; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; border-top: 0.5px solid #e2e8f0; padding-top: 3px;">
          <span>Practical Assignments</span>
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `
    });

    console.log('Generating updated preview screenshots...');
    await page.setViewport({ width: 794, height: 1123 });

    const prog1El = await page.$('#prog-1');
    if (prog1El) await prog1El.screenshot({ path: path.join(__dirname, 'preview_prog1.png') });

    const prog2El = await page.$('#prog-2');
    if (prog2El) await prog2El.screenshot({ path: path.join(__dirname, 'preview_prog2.png') });

    await browser.close();

    const stats = fs.statSync(finalPdfPath);
    console.log('\n=============================================');
    console.log('PDF GENERATED SUCCESSFULLY!');
    console.log('File Name: Data_Structures_Lab_Record.pdf');
    console.log('File Size: ' + (stats.size / 1024).toFixed(2) + ' KB');
    console.log('Location: ' + finalPdfPath);
    console.log('=============================================\n');

  } catch (err) {
    console.error('Fatal error generating PDF:', err);
  }
})();

