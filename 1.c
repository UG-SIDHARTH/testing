#include<stdio.h>
int main()
  {
    int a[10][10],b[10][10],c[10][10];
    int r1,r2,c1,c2;
    int i,j;
    printf("enter no of rows and columns of first matrix");
    scanf("%d%d",&r1,&c1);
    printf("enter no of rows and columns of second matrix");
    scanf("%d%d",&r2,&c2);
    if(c2==r1)
    {
      printf("enter the elments for first matrix");
      for(i=0;i<r1;i++)
      {
        for(j=0;j<c1;j++)
        {
          
          scanf("%d",&a[i][j]);
        }
      }
      printf("enter the elments for second matrix");
      for(i=0;i<r2;i++)
      {
        for(j=0;j<c2;j++)
        {
          scanf("%d",&b[i][j]);
        }
     }
     for(i=0;i<r1;i++)
      {
        for(j=0;j<c2;j++)
        {
          c[i][j]=a[i][j]+b[i][j];
        }
      }
      printf("The output marix is given below \n");
      for(i=0;i<r1;i++)
      {
        printf("\n");
        for(j=0;j<c2;j++)
        {
          printf("%d",c[i][j]);
          printf("\t");
        }
      }
    }
    else
    {
       printf("error 404 not found the coulmn of first matrix and row of second matrix is  mismatched");   
    }
return 0;
}  
