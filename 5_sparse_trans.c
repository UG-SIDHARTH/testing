/* transpose of sparse matrix */

#include <stdio.h>

int main() {
    int rows, cols, non_zero;
    printf("Enter total number of rows and columns for the matrix: ");
    scanf("%d%d", &rows, &cols);
    printf("Enter number of non-zero elements for the matrix: ");
    scanf("%d", &non_zero);

    int sparse[non_zero + 1][3];
    sparse[0][0] = rows; sparse[0][1] = cols; sparse[0][2] = non_zero;

    printf("\nEnter Triplets for the Matrix (Row, Column, Value):\n");
    for (int i = 1; i <= non_zero; i++) {
        scanf("%d%d%d", &sparse[i][0], &sparse[i][1], &sparse[i][2]);
    }

    int transpose[non_zero + 1][3];
    transpose[0][0] = cols; transpose[0][1] = rows; transpose[0][2] = non_zero;

    // Perform transpose
    for (int i = 1; i <= non_zero; i++) {
        transpose[i][0] = sparse[i][1]; // Swap row and column
        transpose[i][1] = sparse[i][0];
        transpose[i][2] = sparse[i][2];
    }

    // Sort the transposed matrix based on row and column
    for (int i = 1; i <= non_zero; i++) {
        for (int j = i + 1; j <= non_zero; j++) {
            if ((transpose[i][0] > transpose[j][0]) || 
                (transpose[i][0] == transpose[j][0] && transpose[i][1] > transpose[j][1])) {
                
                for (int k = 0; k < 3; k++) {
                    int temp = transpose[i][k];
                    transpose[i][k] = transpose[j][k];
                    transpose[j][k] = temp;
                }
            }
        }
    }

    // Display the transposed matrix
    printf("\nThe transposed matrix is:\n");
    for (int i = 0; i <= non_zero; i++) {
        printf("%d %d %d\n", transpose[i][0], transpose[i][1], transpose[i][2]);
    }

    return 0;
}