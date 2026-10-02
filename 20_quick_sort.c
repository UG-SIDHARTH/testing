#include <stdio.h>

void display(int arr[], int size)
{
    int i;

    for (i = 0; i < size; i++)
    {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int partition(int arr[], int low, int high, int size)
{
    int pivot = arr[high];
    int i = low - 1;
    int j;
    int temp;

    printf("Pivot is %d\n", pivot);

    for (j = low; j < high; j++)
    {
        if (arr[j] < pivot)
        {
            i++;

            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;

            printf("After swapping: ");
            display(arr, size);
        }
    }

    temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    printf("After placing pivot: ");
    display(arr, size);

    return i + 1;
}

void quickSort(int arr[], int low, int high, int size)
{
    int pivotPosition;

    if (low < high)
    {
        pivotPosition = partition(arr, low, high, size);

        quickSort(arr, low, pivotPosition - 1, size);
        quickSort(arr, pivotPosition + 1, high, size);
    }
}

int main()
{
    int arr[100];
    int size;
    int i;

    printf("Enter the number of elements: ");
    scanf("%d", &size);

    printf("Enter the elements:\n");
    for (i = 0; i < size; i++)
    {
        scanf("%d", &arr[i]);
    }

    printf("\nOriginal array: ");
    display(arr, size);

    printf("\nSteps of quick sort:\n");
    quickSort(arr, 0, size - 1, size);

    printf("\nSorted array: ");
    display(arr, size);

    return 0;
}