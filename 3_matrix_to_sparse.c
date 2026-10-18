/* Tuple Representation of Sparse Matrix */

#include <stdio.h>

int main() {
    int row, col, number_non_zero = 0;
    printf("Enter row & column size: ");
    scanf("%d%d", &row, &col);

    int matrix[row][col];
    printf("Enter %d elements: ", row*col);
    for (int i = 0; i < row; i++) 
        for (int j = 0; j < col; j++) {
            scanf("%d", &matrix[i][j]);
    }

    int sparse[number_non_zero+1][3], r = 1;
    sparse[0][0] = row;
    sparse[0][1] = col;

    for (int i = 0; i < row; i++) 
        for (int j = 0; j < col; j++) 
            if (matrix[i][j] != 0) {
                sparse[r][0] = i;
                sparse[r][1] = j;
                sparse[r][2] = matrix[i][j];
                r++;
                number_non_zero++;
            }

    sparse[0][2] = number_non_zero;

    for (int i = 0; i <= number_non_zero; i++) {
        printf("(");
        for (int j = 0; j < 3; j++) {
            printf("%d", sparse[i][j]);
            if (j < 2) printf(", ");
        }
        printf(")\n");
    }
    
    return 0; 
}