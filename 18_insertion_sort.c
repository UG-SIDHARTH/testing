#include <stdio.h>

int main(void)
{
    int numbers[100];
    int n, i, j, key;

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    printf("Enter the elements:\n");
    for (i = 0; i < n; i++)
    {
        scanf("%d", &numbers[i]);
    }

    printf("\nInitial array: ");
    for (i = 0; i < n; i++)
    {
        printf("%d ", numbers[i]);
    }

    for (i = 1; i < n; i++)
    {
        key = numbers[i];
        j = i - 1;

        while (j >= 0 && numbers[j] > key)
        {
            numbers[j + 1] = numbers[j];
            j--;
        }

        numbers[j + 1] = key;

        printf("\nStep %d: ", i);
        for (j = 0; j < n; j++)
        {
            printf("%d ", numbers[j]);
        }
    }

    printf("\n\nSorted array: ");
    for (i = 0; i < n; i++)
    {
        printf("%d ", numbers[i]);
    }

    printf("\n");
    return 0;
}