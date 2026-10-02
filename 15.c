#include<stdio.h>
#include<stdlib.h>
void main()
{
    int arr[100],key=0,found,i,n;
    int t;
    printf("enter no of elements");
    scanf("%d",&n);
    for(i=0;i<n;i++)
    {
    printf("enter elements");
    scanf("%d",&arr[i]);
    }
    // display the elements
    printf("DISPLAY \n");
    for(i=0;i<n;i++)
    {
    printf("%d element :%d\t",i,arr[i]);
    printf("\t");
    }
    printf("\n");

    printf("enter the element to be searched");
    scanf("%d",&found);
    for(i=0;i<n;i++)
    {
        if(found==arr[i])
        {
            key=1;
            t=i;
        }
    }
    if(key==0)
    {
        printf("element is not on the array");

    }
    else
    {
        printf("element found at%d",t);
    }

}