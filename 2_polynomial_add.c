// Addition of 2 polynomials using structure

#include <stdio.h>

struct Poly {
    int coeff, exp;
};


int main() {
    int size_1, size_2;

    printf("Enter number of elements for 1st Polynomial: ");
    scanf("%d", &size_1);
    printf("Enter number of elements for 2nd Polynomial: ");
    scanf("%d", &size_2);

    struct Poly A[size_1], B[size_2], SUM[size_1+size_2];

    for (int count = 1; count < 3; count++) {
        const char *polynomial_number = (count == 1) ? "1st" : "2nd";
        struct Poly *polynomial = (count == 1) ? A : B;
        int size = (count == 1) ? size_1 : size_2;
        printf("\nEnter %d elements for %s polynomial:\n", size, polynomial_number);

        for (int i=0; i < size; i++)
            scanf("%d%d", &polynomial[i].coeff, &polynomial[i].exp);
    }

    int i = 0, j = 0, k = 0;
    while (i < size_1 && j < size_2) {
        if (A[i].exp == B[j].exp) {
            SUM[k].coeff = A[i].coeff + B[j].coeff;
            SUM[k].exp = A[i].exp;
            i++; j++;
        } else if (A[i].exp > B[j].exp) {
            SUM[k] = A[i];
            i++;
        } else {
            SUM[k] = B[j];
            j++;
        }
        k++;
    }

    for (i; i < size_1; i++, k++) SUM[k] = A[i];
    for (j; j < size_2; j++, k++) SUM[k] = B[j];

    printf("Sum:\n");
    for (i = 0; i < k; i++) {
        printf("(%d**%d)", SUM[i].coeff, SUM[i].exp);
        if (i < k-1) printf(" + ");
    }

    return 0;
}