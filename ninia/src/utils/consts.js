export const HelloWorld = `public class HelloWorld{
    public static void main(String[] args){
        System.out.println("Hello World!");
    }
}
`
export const NestedFor = `public class NestedFor{
    public static void main(String[] args){
        for(int i = 0; i<100; i++){
            for(int j = 0; j<100; j++){
                System.out.println(j);
            }
        }
    }
}
`

export const FizzBuzz = `public class FizzBuzz{
    public static void main(String[] args){
        int i = 3;
        int j = 7;
        fizzbuzz(i, j);
    }
    static void fizzbuzz(int fizz, int buzz){
        int fizzbuzz = fizz * buzz;
        for(int i = 0; i<100; i++){
            if(i%fizzbuzz == 0) {
                System.out.println("fizzbuzz");
            } else if(i%3 == 0) {
                System.out.println("fizz");
            } else if (i%7 == 0) {
                System.out.println("buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}
`


export const GetEven = `public class GetEven{
    public static void main(String[] args){
        int[] ra = {1,2,3,5};
        for(int i = 0; i<ra.length; i++){
            if(i%2 == 0){
                System.out.println(String.valueOf(i));
            } else{
                System.out.println("Odd");
            }
        }
    }
}
`

// export const Fibonacci = `public class fibonacci { 
//     static int fib(int n) { 
//         if (n <= 1){ 
//            return n;
//         }
//         return fib(n-1) + fib(n-2); 
//     } 
       
//     public static void main (String args[]) { 
//         int n = 9; 
//         System.out.println(fib(n)); 
//     } 
// } 
// `

export const Fibonacci = `public class fibonacci { 
    static int fib(int n) { 
        if (n <= 1){ 
           return n;
        }
    }  
}` 


export const map = `import java.util.HashMap;

public class hash {

	public static void main(String[] args) {
		HashMap<String, Integer> myMap = new HashMap<>();
		
		myMap.put("test", 3);
		
		System.out.println(myMap.get("test"));
	}

}
`
