#include <stdio.h>

void printArray(int a[], int n)
{
    int i;

    for (i = 0; i < n; i++)
    {
        printf("%d ", a[i]);
    }
    printf("\n");
}

void merge(int a[], int low, int middle, int high, int n)
{
    int temp[100];
    int i = low;
    int j = middle + 1;
    int k = low;

    while (i <= middle && j <= high)
    {
        if (a[i] < a[j])
        {
            temp[k] = a[i];
            i++;
        }
        else
        {
            temp[k] = a[j];
            j++;
        }
        k++;
    }

    while (i <= middle)
    {
        temp[k] = a[i];
        i++;
        k++;
    }

    while (j <= high)
    {
        temp[k] = a[j];
        j++;
        k++;
    }

    for (i = low; i <= high; i++)
    {
        a[i] = temp[i];
    }

    printf("After merging positions %d to %d: ", low, high);
    printArray(a, n);
}

void mergeSort(int a[], int low, int high, int n)
{
    int middle;

    if (low < high)
    {
        middle = (low + high) / 2;

        mergeSort(a, low, middle, n);
        mergeSort(a, middle + 1, high, n);
        merge(a, low, middle, high, n);
    }
}

int main(void)
{
    int a[100];
    int n;
    int i;

    printf("Enter the number of elements: ");
    scanf("%d", &n);

    if (n <= 0 || n > 100)
    {
        printf("Please enter a number between 1 and 100.\n");
        return 1;
    }

    printf("Enter %d elements:\n", n);
    for (i = 0; i < n; i++)
    {
        scanf("%d", &a[i]);
    }

    printf("\nOriginal array: ");
    printArray(a, n);

    printf("\nSteps:\n");
    mergeSort(a, 0, n - 1, n);

    printf("\nSorted array: ");
    printArray(a, n);

    return 0;
}