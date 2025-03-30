public class basics{
    public static int fact(int number){
        
        if(number==1){
            return 1;
        }
        *=1;
        
        
        
        
      return number*fact(number-1);

    }
    public static void main(String[] args) {
        int number=5;
        int fact=1;
        // for(int i=1;i<=number;i++){
        //     fact *=i;
           
        // }
        // System.out.println(fact);
        System.out.println(fact(number));
    }
}
