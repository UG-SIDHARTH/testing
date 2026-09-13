/* Matrix Addition */

#include <stdio.h>

int main() {
    int row, col;

    printf("Enter row & column sizes of 1st matrix: ");
    scanf("%d%d", &row, &col);
    int A[row][col], B[row][col];

    for (int count = 1; count < 3; count++) {
        const char *matrix_number = (count == 1) ? "1st" : "2nd";
        int (*matrix)[col] = (count == 1) ? A : B;
        printf("Enter %d elemnts for %s matrix: ", row*col, matrix_number);

        for (int i=0; i < row; i++)
            for (int j=0; j < col; j++)
                scanf("%d", &matrix[i][j]);
    }

    printf("Added:\n");
    for (int i=0; i < row; i++) {
        for (int j=0; j < col; j++)
            printf("%d ", A[i][j] + B[i][j]);
        printf("\n");
    }

    return 0;
}