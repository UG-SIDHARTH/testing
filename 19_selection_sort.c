#include <stdio.h>

int main()
{
	int a[100];
	int n, i, j, smallest, temp;

	printf("Enter the number of elements: ");
	scanf("%d", &n);

	printf("Enter the elements:\n");
	for (i = 0; i < n; i++)
	{
		scanf("%d", &a[i]);
	}

	printf("\nElements at each step:\n");

	for (i = 0; i < n - 1; i++)
	{
		smallest = i;

		for (j = i + 1; j < n; j++)
		{
			if (a[j] < a[smallest])
			{
				smallest = j;
			}
		}

		temp = a[i];
		a[i] = a[smallest];
		a[smallest] = temp;

		printf("Step %d: ", i + 1);
		for (j = 0; j < n; j++)
		{
			printf("%d ", a[j]);
		}
		printf("\n");
	}

	printf("\nSorted array: ");
	for (i = 0; i < n; i++)
	{
		printf("%d ", a[i]);
	}

	return 0;
}
