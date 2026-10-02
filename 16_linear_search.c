#include <stdio.h>

int main(void) {
    int size;
    int target;
    int found = 0;

    printf("Enter the size of the array: ");
    scanf("%d", &size);

    int numbers[size];

    printf("Enter %d numbers:\n", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &numbers[i]);
    }

    printf("Enter a number to search: ");
    scanf("%d", &target);

    // Check each element one by one.
    for (int i = 0; i < size; i++) {
        if (numbers[i] == target) {
            printf("Number found at index %d.\n", i);
            found = 1;
            break;
        }
    }

    if (!found) {
        printf("Number not found.\n");
    }

    return 0;
}