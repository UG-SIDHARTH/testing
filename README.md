# C Lab Programs

This repository contains C programs written for various lab problems in data structures and algorithms, along with an automated lab record PDF generator and web-based LabRecord Studio.

---

## 📚 List of Programs

### 1. Arrays, Matrices & Polynomials
* **[1_matrix_add.c](1_matrix_add.c)**: Matrix addition using two-dimensional arrays.
* **[2_polynomial_add.c](2_polynomial_add.c)**: Polynomial addition using an array of structures.
* **[3_matrix_to_sparse.c](3_matrix_to_sparse.c)**: Conversion of a standard matrix to 3-tuple sparse matrix representation.
* **[4_sparse_matrix_add.c](4_sparse_matrix_add.c)**: Addition of two sparse matrices represented in tuple format.
* **[5_sparse_trans.c](5_sparse_trans.c)**: Transpose of a sparse matrix in tuple format.

### 2. Stacks, Queues & Expressions (Array Implementation)
* **[6_stack.c](6_stack.c)**: Stack implementation with Push, Pop, and Display operations using arrays.
* **[7_standard_queue.c](7_standard_queue.c)**: Standard linear queue implementation (Enqueue, Dequeue, Display).
* **[8_circular_queue.c](8_circular_queue.c)**: Circular queue implementation to overcome array queue memory wastage.
* **[9_dequeue.c](9_dequeue.c)**: Double-ended queue (Deque) implementation with operations at both ends.
* **[10_infixtopostfix.c](10_infixtopostfix.c)**: Infix to postfix expression conversion using stack operator precedence.
* **[11_postfix_evaluation.c](11_postfix_evaluation.c)**: Evaluation of postfix expressions using an operand stack.

### 3. Linked Lists & Dynamic Data Structures
* **[12_single_linked_list.c](12_single_linked_list.c)**: Singly linked list operations (Create, Insert, Delete at beginning/middle/end, Search, Display).
* **[13_doubly_linked_list.c](13_doubly_linked_list.c)**: Doubly linked list operations with forward and backward pointer manipulation.
* **[14_stack_linked_list.c](14_stack_linked_list.c)**: Dynamic stack implementation using linked list (Push, Pop, Display).
* **[15_queue_linked_list.c](15_queue_linked_list.c)**: Dynamic linear queue implementation using linked list (Enqueue, Dequeue, Display).

---

## 🛠️ Compilation & Execution

Each program can be compiled using GCC or any standard C compiler:

```bash
# Compile any program (e.g. 1_matrix_add.c)
gcc 1_matrix_add.c -o 1_matrix_add

# Run the executable
# On Linux/macOS:
./1_matrix_add

# On Windows:
.\1_matrix_add.exe
```

---

## 📄 Lab Record Reports & PDF Generation

The repository includes tools to generate formatted, publication-quality lab records complete with aims, algorithms, syntax-highlighted source code, and verified program execution outputs:

* **[Data_Structures_Lab_Record.pdf](Data_Structures_Lab_Record.pdf)**: Complete PDF record covering Programs 1 to 11.
* **[Programs_12_to_15_Record.pdf](Programs_12_to_15_Record.pdf)**: Dedicated PDF record covering Programs 12 to 15.
* **[generate_pdf.js](generate_pdf.js)** & **[generate_pdf_12_15.js](generate_pdf_12_15.js)**: Node.js & Puppeteer automation scripts to compile HTML and PDF records.

To regenerate records locally:
```bash
npm install
node generate_pdf.js
node generate_pdf_12_15.js
```

---

## 💻 LabRecord Studio (Web Application)

An interactive Express.js web application is included to view, compile, run, and export records through a modern browser UI:

* **Local Dev Server:**
  ```bash
  npm start # or: node server.js
  # Access at http://localhost:8082
  ```

* **Docker:**
  ```bash
  docker compose up --build
  # Access at http://localhost:8082
  ```

---

## 📜 License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in this repository.
