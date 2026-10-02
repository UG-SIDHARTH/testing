#include <stdio.h>

int main() {
	int numbers[100];
	int n, i, target;
	int left, right, middle;
	int found = 0;

	printf("Enter the number of elements: ");
	scanf("%d", &n);

	printf("Enter %d elements in sorted order: ", n);
	for (i = 0; i < n; i++) {
		scanf("%d", &numbers[i]);
	}

	printf("Enter the number to search: ");
	scanf("%d", &target);

	left = 0;
	right = n - 1;

	while (left <= right) {
		middle = (left + right) / 2;
        printf("middle index = %d\tvalue = %d\n", middle, numbers[middle]);

		if (numbers[middle] == target) {
			printf("Number found at position %d\n", middle + 1);
			found = 1;
			break;
		} else if (numbers[middle] < target) {
			left = middle + 1;
		} else {
			right = middle - 1;
		}
	}

	if (found == 0) {
		printf("Number not found\n");
	}

	return 0;
}
